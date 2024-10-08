"use client";
import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

interface VentaDetallada {
    ID_venta: number;
    Fecha: string; // Fecha completa incluyendo hora
    Dia: string;   // Fecha separada
    Hora: string;  // Hora separada
    NombreEmpleado: string;
    ApellidoEmpleado: string;
    NombreCliente: string;
    ApellidoCliente: string;
    ProductosVendidos: string;
    MetodoPago: string;
    TipoVenta: string;
    Total: number;
}

export const VentasDetalladasComponent = () => {
    const [ventasDetalladas, setVentasDetalladas] = useState<VentaDetallada[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Para el calendario
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        const fetchVentasDetalladas = async () => {
            try {
                const response = await fetch("/api/ventas");
                const data = await response.json();
                
                console.log("Datos del backend:", data);
    
                // Separar la fecha y la hora de cada venta
                const ventasConFormato = data.map((venta: VentaDetallada) => {
                    // Separar la fecha y la hora basándonos en "T" (ISO) o en espacio, dependiendo de cómo venga la fecha
                    const [fecha, hora] = venta.Fecha.includes("T")
                        ? venta.Fecha.split("T") // Si es formato ISO con "T"
                        : venta.Fecha.split(" "); // Si es otro formato con espacio

                    return {
                        ...venta,
                        Dia: fecha, // Guardar la fecha separada
                        Hora: hora ? hora.split(".")[0] : "",  // Guardar la hora separada, sin milisegundos
                    };
                });
    
                console.log("Ventas con formato (separación de fecha y hora):", ventasConFormato);
    
                setVentasDetalladas(ventasConFormato);
            } catch (error) {
                console.error("Error al cargar ventas detalladas:", error);
            }
        };
    
        fetchVentasDetalladas();
    }, []);

    // Filtrar las ventas por la fecha seleccionada
    const filteredVentas = selectedDate
        ? ventasDetalladas.filter((venta) => {
            const ventaFecha = new Date(venta.Dia).toISOString().split('T')[0];
            const filtroFecha = format(selectedDate, 'yyyy-MM-dd');
            return ventaFecha === filtroFecha;
        })
        : ventasDetalladas;

    const handleDateSelect = (date: Date | undefined) => {
        setSelectedDate(date);
        setIsCalendarOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Ventas Detalladas</h1>

            {/* Filtro de fecha con calendario */}
            <div className="mb-4 flex justify-between items-center">
                <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, 'PP') : 'Filtrar por fecha'}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Seleccionar fecha</DialogTitle>
                        </DialogHeader>
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            initialFocus
                        />
                    </DialogContent>
                </Dialog>
                {selectedDate && (
                    <Button variant="ghost" onClick={() => setSelectedDate(undefined)}>
                        Limpiar filtro
                    </Button>
                )}
            </div>

            {/* Tabla de ventas detalladas */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID de Venta</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Hora</TableHead>
                        <TableHead>Empleado</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Productos Vendidos</TableHead>
                        <TableHead>Método de Pago</TableHead>
                        <TableHead>Tipo de Venta</TableHead>
                        <TableHead>Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredVentas.map((venta) => (
                        <TableRow key={venta.ID_venta}>
                            <TableCell>{venta.ID_venta}</TableCell>
                            <TableCell>{venta.Dia}</TableCell> {/* Mostrar solo la fecha */}
                            <TableCell>{venta.Hora}</TableCell>  {/* Mostrar solo la hora */}
                            <TableCell>{venta.NombreEmpleado} {venta.ApellidoEmpleado}</TableCell>
                            <TableCell>{venta.NombreCliente} {venta.ApellidoCliente}</TableCell>
                            <TableCell>{venta.ProductosVendidos}</TableCell>
                            <TableCell>{venta.MetodoPago}</TableCell>
                            <TableCell>{venta.TipoVenta}</TableCell>
                            <TableCell className="text-right">${venta.Total.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {filteredVentas.length === 0 && (
                <div className="text-center py-4 text-gray-500">
                    No se encontraron ventas para la fecha seleccionada.
                </div>
            )}

            <div className="mt-4 text-right">
                <p className="font-semibold">
                    Total de ventas: ${filteredVentas.reduce((sum, venta) => sum + venta.Total, 0).toFixed(2)}
                </p>
            </div>
        </div>
    );
};
