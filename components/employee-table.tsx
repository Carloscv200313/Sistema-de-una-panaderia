"use client";
import { useEffect, useState } from "react";
import { crearEmpleado, empleados } from "@/consultas/empleados";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Pencil, UserPlus, ClipboardList } from 'lucide-react'
import { actualizarEmpleado } from "../consultas/empleados";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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
  id_empleado: number;
  dni: string;
  nombre: string;
  apellido: string;
  cargo: string;
  telefono: string;
  direccion: string;
  activo: number;
}

interface Empleado {
  ID_empleado: number;
  Nombre: string;
  Apellido: string;
  Cargo: string;
  Telefono: string;
  Direccion: string;
  estado_empleado: string; // "Activo" o "Inactivo"
}

interface newEmpleado {
  dni: string;
  nombre: string;
  apellido: string;
  cargo: string;
  telefono: string;
  direccion: string;
  usuario: string;
  contraseña: string;
}
interface SelectedEmployeeSales {
  Nombre: string;
  Apellido: string;
  sales: Array<{
    id: number;
    date: string;
    product: string;
    amount: number;
  }>;
}

const inversaCargos: { [key: string]: number } = {
  Cocinero: 1,
  Cajero: 2,
  Repartidor: 3,
  Gerente: 4,
  Ayudante: 5,
};


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
    dni: "",
    nombre: "",
    apellido: "",
    cargo: "Cajero", // Valor por defecto
    telefono: "",
    direccion: "",
    usuario: "",
    contraseña: "",
  });

  const [empleadoEditado, setempleadoEditado] = useState<EmpleadoUpdate | null>(
    null
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false)
  const [selectedEmployeeSales, setSelectedEmployeeSales] = useState<SelectedEmployeeSales | null>(null)

  // Búsqueda optimizada de empleados
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      // Si el término de búsqueda está vacío, mostramos todos los empleados
      setDisplayEmpleados(Empleados);
    } else {
      // Filtramos los empleados que coincidan con el término de búsqueda
      const filtered = Empleados.filter((emp) =>
        `${emp.Nombre} ${emp.Apellido}`
          .toLowerCase()
          .includes(term.toLowerCase().trim())
      );
      setDisplayEmpleados(filtered);
    }
  };

  // Modificar handleOpenSalesModal para hacer la llamada API
  const handleOpenSalesModal = async (empleado: Empleado) => {
    try {
      const response = await fetch(`/api/empleados/ventas/${empleado.ID_empleado}`);
      const data = await response.json();

      setSelectedEmployeeSales({
        Nombre: empleado.Nombre,
        Apellido: empleado.Apellido,
        sales: data.map((sale: { ID_venta: unknown; Fecha: string | number | Date; ProductosVendidos: unknown; Total: unknown; }) => ({
          id: sale.ID_venta,
          date: new Date(sale.Fecha).toLocaleDateString(), // Formatear la fecha
          product: sale.ProductosVendidos, // Lista de productos vendidos
          amount: sale.Total // Monto de la venta
        }))
      });
      setIsSalesModalOpen(true); // Abrir el modal después de cargar los datos
    } catch (error) {
      console.error("Error al obtener las ventas del empleado:", error);
      alert("Error al cargar las ventas. Intenta de nuevo.");
    }
  };

  // Agregar un nuevo empleado
  const handleAddEmpleado = async () => {
    if (
      newEmpleado.nombre &&
      newEmpleado.apellido &&
      newEmpleado.telefono &&
      newEmpleado.direccion &&
      newEmpleado.usuario &&
      newEmpleado.contraseña
    ) {
      const nuevo: newEmpleado = {
        dni: newEmpleado.dni,
        nombre: newEmpleado.nombre,
        apellido: newEmpleado.apellido,
        cargo: newEmpleado.cargo, // Guardar el número del cargo en la base de datos
        telefono: newEmpleado.telefono,
        direccion: newEmpleado.direccion,
        usuario: newEmpleado.usuario,
        contraseña: newEmpleado.contraseña,
      };

      console.log(nuevo);
      // Ejecutar la actualización del empleado en la base de datos
      await crearEmpleado(nuevo);

      // Refrescar la página después de crear un empleado
      window.location.reload();
    } else {
      alert("Por favor, complete todos los campos"); // Alerta si faltan campos
    }
  };

  // Editar un empleado existente
  const handleEditEmpleado = async () => {
    if (empleadoEditado) {
      try {
        // Extraer los campos a actualizar junto con el ID_empleado
        const { id_empleado, dni, nombre, apellido, cargo, telefono, direccion, activo } =
          empleadoEditado;
        console.log(empleadoEditado);

        // Ejecutar la actualización del empleado en la base de datos
        await actualizarEmpleado({
          id_empleado,
          dni,
          nombre,
          apellido,
          cargo,
          telefono,
          direccion,
          activo,
        });

        // Refrescar la página después de editar un empleado
        window.location.reload();
      } catch (error) {
        console.error("Error al actualizar empleado:", error);
        alert("Error al actualizar el empleado. Inténtalo de nuevo.");
      }
    }
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
                  DNI
                </Label>
                <Input
                  id="dni"
                  value={newEmpleado.dni}
                  onChange={(e) =>
                    setNewEmpleado({ ...newEmpleado, dni: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  value={newEmpleado.nombre}
                  onChange={(e) =>
                    setNewEmpleado({ ...newEmpleado, nombre: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewEmpleado({ ...newEmpleado, apellido: e.target.value })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cargo" className="text-right">
                  Cargo
                </Label>
                <select
                  id="cargo"
                  value={newEmpleado.cargo}
                  onChange={(e) =>
                    setNewEmpleado({ ...newEmpleado, cargo: e.target.value })
                  }
                  className="col-span-3 border rounded-md p-2"
                >
                  <option value="1">Cocinero</option>
                  <option value="2">Cajero</option>
                  <option value="3">Repartidor</option>
                  <option value="4">Gerente</option>
                  <option value="5">Ayudante</option>
                </select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="telefono" className="text-right">
                  Teléfono
                </Label>
                <Input
                  id="telefono"
                  value={newEmpleado.telefono}
                  onChange={(e) =>
                    setNewEmpleado({ ...newEmpleado, telefono: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewEmpleado({
                      ...newEmpleado,
                      direccion: e.target.value,
                    })
                  }
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
                  onChange={(e) =>
                    setNewEmpleado({ ...newEmpleado, usuario: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewEmpleado({
                      ...newEmpleado,
                      contraseña: e.target.value,
                    })
                  }
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
                <Button variant="outline" size="sm" onClick={() => handleOpenSalesModal(Empleado)}>
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Ver Ventas
                </Button>
              </TableCell>
              <TableCell>
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        setempleadoEditado({
                          id_empleado: Empleado.ID_empleado,
                          dni: "",
                          nombre: Empleado.Nombre,
                          apellido: Empleado.Apellido,
                          cargo: inversaCargos[Empleado.Cargo],
                          telefono: Empleado.Telefono,
                          direccion: Empleado.Direccion,
                          activo: 1,
                        })
                      }
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent aria-describedby="description">
                    <DialogHeader>
                      <DialogTitle>
                        Editar Empleado
                      </DialogTitle>
                    </DialogHeader>
                    {empleadoEditado && (
                      <div className="grid gap-4 py-4">
                        {/* Nombre */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="edit-name"
                            className="text-right"
                          >
                            Nombre
                          </Label>
                          <Input
                            id="edit-name"
                            value={empleadoEditado.nombre}
                            onChange={(e) =>
                              setempleadoEditado({
                                ...empleadoEditado,
                                nombre: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>

                        {/* Apellido */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="edit-lastName"
                            className="text-right"
                          >
                            Apellido
                          </Label>
                          <Input
                            id="edit-lastName"
                            value={empleadoEditado.apellido}
                            onChange={(e) =>
                              setempleadoEditado({
                                ...empleadoEditado,
                                apellido: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>

                        {/* Cargo */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="cargo" className="text-right">
                            Cargo
                          </Label>
                          <select
                            id="edit-cargo"
                            value={empleadoEditado.cargo}
                            onChange={(e) =>
                              setempleadoEditado({
                                ...empleadoEditado,
                                cargo: e.target.value,
                              })
                            }
                            className="col-span-3 border rounded-md p-2"
                          >
                            <option value="1">Cocinero</option>
                            <option value="2">Cajero</option>
                            <option value="3">Repartidor</option>
                            <option value="4">Gerente</option>
                            <option value="5">Ayudante</option>
                          </select>
                        </div>

                        {/* Teléfono */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="edit-telefono"
                            className="text-right"
                          >
                            Teléfono
                          </Label>
                          <Input
                            id="edit-telefono"
                            value={empleadoEditado.telefono}
                            onChange={(e) =>
                              setempleadoEditado({
                                ...empleadoEditado,
                                telefono: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>

                        {/* Dirección */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label
                            htmlFor="edit-direccion"
                            className="text-right"
                          >
                            Dirección
                          </Label>
                          <Input
                            id="edit-direccion"
                            value={empleadoEditado.direccion}
                            onChange={(e) =>
                              setempleadoEditado({
                                ...empleadoEditado,
                                direccion: e.target.value,
                              })
                            }
                            className="col-span-3"
                          />
                        </div>

                        {/* Activo */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="activo" className="text-right">
                            Activo
                          </Label>
                          <select
                            id="edit-activo"
                            value={empleadoEditado?.activo ?? 1} // Si activo es undefined o null, establece el valor predeterminado en 1
                            onChange={(e) =>
                              setempleadoEditado({
                                ...empleadoEditado,
                                activo: parseInt(e.target.value, 10), // Convertir a número usando parseInt
                              })
                            }
                            className="col-span-3 border rounded-md p-2"
                          >
                            <option value={1}>Activo</option>
                            <option value={0}>Inactivo</option>
                          </select>
                        </div>
                      </div>
                    )}
                    <Button onClick={handleEditEmpleado}>
                      Guardar Cambios
                    </Button>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de estadísticas */}
      <Dialog open={isSalesModalOpen} onOpenChange={setIsSalesModalOpen}>
  <DialogContent className="sm:max-w-[625px] max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Ventas Realizadas</DialogTitle>
    </DialogHeader>
    {selectedEmployeeSales && (
      <div className="py-4">
        <h3 className="text-lg font-semibold mb-2">
          {selectedEmployeeSales.Nombre} {selectedEmployeeSales.Apellido}
        </h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Producto</TableHead>
              <TableHead className="text-right">Monto</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedEmployeeSales.sales.map((sale) => (
              <TableRow key={sale.id}>
                <TableCell>{sale.date}</TableCell>
                <TableCell>{sale.product}</TableCell>
                <TableCell className="text-right">
                  ${sale.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )}
  </DialogContent>
</Dialog>



    </div>
  );
};
