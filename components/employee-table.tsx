"use client";
import { useEffect, useState } from 'react';
import { crearEmpleado, empleados } from '@/consultas/empleados'; // Asegúrate de que la función empleados esté definida
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { Pencil, UserPlus, BarChart } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import { actualizarEmpleado } from '../consultas/empleados';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EmpleadoUpdate {
  ID_empleado: number;
  Nombre: string;
  Apellido: string;
  Cargo: string;
  Telefono: string;
  Direccion: string;
}




interface Empleado {
  ID_empleado: number;
  Nombre: string;
  Apellido: string;
  Cargo: string;
  Telefono: string;
  Direccion: string;
  estado_empleado: string; // "Activo" o "Inactivo"
  weeklySales?: number[]; // Ventas semanales (opcional)
}

interface newEmpleado {
  nombre: string;
  apellido: string;
  cargo: string;
  telefono: string;
  direccion: string;
  usuario: string;
  contraseña: string;
}



export const EmpleadoTableComponent = () => {
  const [Empleados, setEmpleados] = useState<Empleado[]>([]); // Empleados cargados
  const [displayEmpleados, setDisplayEmpleados] = useState<Empleado[]>([]); // Empleados mostrados (para búsqueda)

  useEffect(() => {
    const fetchEmpleados = async () => {
      const data = await empleados();
      setEmpleados(data);
      setDisplayEmpleados(data); // Inicialmente se muestran todos los empleados
    };

    fetchEmpleados();
  }, []); // Asegúrate de que el array de dependencias esté vacío para que se ejecute solo una vez

  const [searchTerm, setSearchTerm] = useState("");
  const [newEmpleado, setNewEmpleado] = useState({
    nombre: "",
    apellido: "",
    cargo: "Cajero", // Valor por defecto
    telefono: "",
    direccion: "",
    usuario: "",
    contraseña: ""
  });

  const [empleadoEditado, setempleadoEditado] = useState<Empleado | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedEmpleadoStats, setSelectedEmpleadoStats] = useState<Empleado | null>(null);

  // Búsqueda optimizada de empleados
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      // Si el término de búsqueda está vacío, mostramos todos los empleados
      setDisplayEmpleados(Empleados);
    } else {
      // Filtramos los empleados que coincidan con el término de búsqueda
      const filtered = Empleados.filter((emp) =>
        `${emp.Nombre} ${emp.Apellido}`.toLowerCase().includes(term.toLowerCase().trim())
      );
      setDisplayEmpleados(filtered);
    }
  };

  // Agregar un nuevo empleado
  const handleAddEmpleado = async () => {
    if (newEmpleado.nombre && newEmpleado.apellido && newEmpleado.telefono && newEmpleado.direccion && newEmpleado.usuario && newEmpleado.contraseña) {
      const newEmp: Empleado = {
        ID_empleado: Date.now(), // Generar un ID temporal
        Nombre: newEmpleado.nombre,
        Apellido: newEmpleado.apellido,
        Cargo: newEmpleado.cargo || "Cajero", // Asignar "Cajero" si no se define un cargo
        Telefono: newEmpleado.telefono,
        Direccion: newEmpleado.direccion,
        estado_empleado: 'Activo'
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const nuevo: newEmpleado = {
        nombre: newEmpleado.nombre,
        apellido: newEmpleado.apellido,
        cargo: newEmpleado.cargo || "Cajero", // Asignar "Cajero" si no se define un cargo
        telefono: newEmpleado.telefono,
        direccion: newEmpleado.direccion,
        usuario: newEmpleado.usuario,
        contraseña: newEmpleado.contraseña,
      };
      console.log(nuevo)
      // Ejecutar la actualización del empleado en la base de datos
      await crearEmpleado(nuevo);
      // Actualizar los estados de empleados
      setEmpleados((prevEmpleados) => [...prevEmpleados, newEmp]);
      setDisplayEmpleados((prevEmpleados) => [...prevEmpleados, newEmp]); // Actualizar los empleados mostrados

      // Resetear el formulario para nuevo empleado
      setNewEmpleado({
        nombre: "",
        apellido: "",
        cargo: "Cajero", // Valor por defecto
        telefono: "",
        direccion: "",
        usuario: "",
        contraseña: ""
      });
      setIsAddModalOpen(false); // Cerrar el modal
    } else {
      alert("Por favor, complete todos los campos"); // Alerta si faltan campos
    }
  };



  // Editar un empleado existente
  const handleEditEmpleado = async () => {
    if (empleadoEditado) {
      try {
        // Extraer los campos a actualizar junto con el ID_empleado
        const { ID_empleado, Nombre, Apellido, Cargo, Telefono, Direccion } = empleadoEditado;

        // Crear un objeto solo con los campos que quieres enviar
        const empleadoActualizado: EmpleadoUpdate = {
          ID_empleado, // Incluimos ID para identificar al empleado en la base de datos
          Nombre,
          Apellido,
          Cargo,
          Telefono,
          Direccion
        };
        console.log(empleadoActualizado)
        // Ejecutar la actualización del empleado en la base de datos
        await actualizarEmpleado(empleadoActualizado);

        // Si la actualización es exitosa, actualizar el estado local
        setEmpleados(
          Empleados.map((emp) =>
            emp.ID_empleado === empleadoEditado.ID_empleado ? empleadoEditado : emp
          )
        );

        // Actualizar también los empleados mostrados (filtrados o no)
        setDisplayEmpleados(
          displayEmpleados.map((emp) =>
            emp.ID_empleado === empleadoEditado.ID_empleado ? empleadoEditado : emp
          )
        );

        // Cerrar el modal de edición
        setIsEditModalOpen(false);

        console.log('Empleado actualizado correctamente');
      } catch (error) {
        console.error('Error al actualizar empleado:', error);
        alert('Error al actualizar el empleado. Inténtalo de nuevo.');
      }
    }
  };




  // Abrir modal de estadísticas de un empleado específico
  const handleOpenStatsModal = (Empleado: Empleado) => {
    setSelectedEmpleadoStats(Empleado);
    setIsStatsModalOpen(true);
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Ventas Semanales",
      },
    },
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Empleados</h1>

      {/* Búsqueda de empleados */}
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Buscar empleado..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)} // Función optimizada de búsqueda
          className="max-w-sm"
        />
        {/* Modal para añadir empleado */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Añadir Empleado
            </Button>
          </DialogTrigger>
          <DialogContent aria-describedby="description">
            <DialogHeader>
              <DialogTitle>Añadir Nuevo Empleado</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  value={newEmpleado.nombre}
                  onChange={(e) => setNewEmpleado({ ...newEmpleado, nombre: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="apellido" className="text-right">
                  Apellido
                </Label>
                <Input
                  id="apellido"
                  value={newEmpleado.apellido}
                  onChange={(e) => setNewEmpleado({ ...newEmpleado, apellido: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cargo" className="text-right">
                  Cargo
                </Label>
                <Input
                  id="cargo"
                  value={newEmpleado.cargo}
                  onChange={(e) => setNewEmpleado({ ...newEmpleado, cargo: e.target.value })}
                  className="col-span-3"
                  placeholder="Cajero" // Valor por defecto
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="telefono" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  value={newEmpleado.telefono}
                  onChange={(e) => setNewEmpleado({ ...newEmpleado, telefono: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="direccion" className="text-right">
                  Dirección
                </Label>
                <Input
                  id="direccion"
                  value={newEmpleado.direccion}
                  onChange={(e) => setNewEmpleado({ ...newEmpleado, direccion: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usuario" className="text-right">
                  Usuario
                </Label>
                <Input
                  id="usuario"
                  value={newEmpleado.usuario}
                  onChange={(e) => setNewEmpleado({ ...newEmpleado, usuario: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contraseña" className="text-right">
                  Contraseña
                </Label>
                <Input
                  id="contraseña"
                  type="password"
                  value={newEmpleado.contraseña}
                  onChange={(e) => setNewEmpleado({ ...newEmpleado, contraseña: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddEmpleado}>Añadir Empleado</Button>
          </DialogContent>
        </Dialog>

      </div>

      {/* Tabla de empleados */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Estadística</TableHead>
            <TableHead>Editar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayEmpleados.map((Empleado) => (
            <TableRow key={Empleado.ID_empleado}>
              <TableCell>{Empleado.Nombre}</TableCell>
              <TableCell>{Empleado.Apellido}</TableCell>
              <TableCell>{Empleado.Cargo}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleOpenStatsModal(Empleado)}>
                  <BarChart className="mr-2 h-4 w-4" />
                  Ver Estadísticas
                </Button>
              </TableCell>
              <TableCell>
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setempleadoEditado(Empleado)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent aria-describedby="description" >
                    <DialogHeader>
                      <DialogTitle>Editar Empleado {Empleado.Nombre}</DialogTitle>
                    </DialogHeader>
                    {empleadoEditado && (
                      <div className="grid gap-4 py-4">
                        {/* Nombre */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            Nombre
                          </Label>
                          <Input
                            id="edit-name"
                            value={empleadoEditado.Nombre}
                            onChange={(e) => setempleadoEditado({ ...empleadoEditado, Nombre: e.target.value })}
                            className="col-span-3"
                          />
                        </div>

                        {/* Apellido */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-lastName" className="text-right">
                            Apellido
                          </Label>
                          <Input
                            id="edit-lastName"
                            value={empleadoEditado.Apellido}
                            onChange={(e) => setempleadoEditado({ ...empleadoEditado, Apellido: e.target.value })}
                            className="col-span-3"
                          />
                        </div>

                        {/* Cargo */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-cargo" className="text-right">
                            Cargo
                          </Label>
                          <Input
                            id="edit-cargo"
                            value={empleadoEditado.Cargo}
                            onChange={(e) => setempleadoEditado({ ...empleadoEditado, Cargo: e.target.value })}
                            className="col-span-3"
                          />
                        </div>

                        {/* Telefono */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-telefono" className="text-right">
                            Teléfono
                          </Label>
                          <Input
                            id="edit-telefono"
                            value={empleadoEditado.Telefono}
                            onChange={(e) => setempleadoEditado({ ...empleadoEditado, Telefono: e.target.value })}
                            className="col-span-3"
                          />
                        </div>

                        {/* Dirección */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-direccion" className="text-right">
                            Dirección
                          </Label>
                          <Input
                            id="edit-direccion"
                            value={empleadoEditado.Direccion}
                            onChange={(e) => setempleadoEditado({ ...empleadoEditado, Direccion: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                        
                      </div>
                    )}
                    <Button onClick={handleEditEmpleado}>Guardar Cambios</Button>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de estadísticas */}
      <Dialog open={isStatsModalOpen} onOpenChange={setIsStatsModalOpen}>
        <DialogContent aria-describedby="description" className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Estadísticas de Ventas Semanales</DialogTitle>
          </DialogHeader>
          {selectedEmpleadoStats && (
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-2">
                {selectedEmpleadoStats.Nombre} {selectedEmpleadoStats.Apellido}
              </h3>
              <Line
                options={chartOptions}
                data={{
                  labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
                  datasets: [
                    {
                      label: "Ventas",
                      data: selectedEmpleadoStats.weeklySales || [0, 0, 0, 0, 0, 0, 0],
                      borderColor: "rgb(53, 162, 235)",
                      backgroundColor: "rgba(53, 162, 235, 0.5)",
                    },
                  ],
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
