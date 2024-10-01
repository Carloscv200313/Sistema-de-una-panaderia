"use client";
import { useEffect, useState } from 'react';
import { actualizarCargoEmpleado, crearEmpleado, empleados } from '@/consultas/empleados'; // Asegúrate de que la función empleados esté definida
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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

interface EmployeeUpdate {
  ID_empleado: number;
  Nombre: string;
  Apellido: string;
  Cargo: string;
  Telefono: string;
  Direccion: string;
}


interface EstadoActualizado {
  ID_empleado: number;
  Nombre: string;
  Apellido: string;
  Cargo: string;
  Telefono: string;
  Direccion: string;
  estado_empleado: string;
}


interface Employee {
  ID_empleado: number;
  Nombre: string;
  Apellido: string;
  Cargo : string;
  Telefono: string;
  Direccion: string;
  estado_empleado : string; // "Activo" o "Inactivo"
  weeklySales?: number[]; // Ventas semanales (opcional)
}

interface newEmployee {
  nombre: string;
  apellido: string;
  cargo : string;
  telefono: string;
  direccion: string;
  usuario: string;
  contraseña: string;
}



export const EmployeeTableComponent = () => {
  const [employees, setEmployees] = useState<Employee[]>([]); // Empleados cargados
  const [displayEmployees, setDisplayEmployees] = useState<Employee[]>([]); // Empleados mostrados (para búsqueda)

  useEffect(() => {
    const fetchEmpleados = async () => {
      const data = await empleados();
      setEmployees(data);
      setDisplayEmployees(data); // Inicialmente se muestran todos los empleados
    };

    fetchEmpleados();
  }, []); // Asegúrate de que el array de dependencias esté vacío para que se ejecute solo una vez

  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    nombre: "",
    apellido: "",
    cargo: "Cajero", // Valor por defecto
    telefono: "",
    direccion: "",
    usuario: "",
    contraseña: ""
  });
  
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [selectedEmployeeStats, setSelectedEmployeeStats] = useState<Employee | null>(null);

  // Búsqueda optimizada de empleados
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    if (term.trim() === "") {
      // Si el término de búsqueda está vacío, mostramos todos los empleados
      setDisplayEmployees(employees);
    } else {
      // Filtramos los empleados que coincidan con el término de búsqueda
      const filtered = employees.filter((emp) =>
        `${emp.Nombre} ${emp.Apellido}`.toLowerCase().includes(term.toLowerCase().trim())
      );
      setDisplayEmployees(filtered);
    }
  };

 // Agregar un nuevo empleado
const handleAddEmployee = async () => {
  if (newEmployee.nombre && newEmployee.apellido && newEmployee.telefono && newEmployee.direccion && newEmployee.usuario && newEmployee.contraseña) {
    const newEmp: Employee = {
      ID_empleado: Date.now(), // Generar un ID temporal
      Nombre: newEmployee.nombre,
      Apellido: newEmployee.apellido,
      Cargo: newEmployee.cargo || "Cajero", // Asignar "Cajero" si no se define un cargo
      Telefono: newEmployee.telefono,
      Direccion: newEmployee.direccion,
      estado_empleado: 'Activo'
    };
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const nuevo : newEmployee = {
      nombre: newEmployee.nombre,
      apellido: newEmployee.apellido,
      cargo: newEmployee.cargo || "Cajero", // Asignar "Cajero" si no se define un cargo
      telefono: newEmployee.telefono,
      direccion: newEmployee.direccion,
      usuario: newEmployee.usuario,
      contraseña: newEmployee.contraseña,
    };
    console.log(nuevo)
        // Ejecutar la actualización del empleado en la base de datos
        await crearEmpleado (nuevo);
    // Actualizar los estados de empleados
    setEmployees((prevEmployees) => [...prevEmployees, newEmp]);
    setDisplayEmployees((prevEmployees) => [...prevEmployees, newEmp]); // Actualizar los empleados mostrados
    
    // Resetear el formulario para nuevo empleado
    setNewEmployee({
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
  const handleEditEmployee = async () => {
    if (editingEmployee) {
      try {
        // Extraer los campos a actualizar junto con el ID_empleado
        const { ID_empleado, Nombre, Apellido, Cargo, Telefono, Direccion } = editingEmployee;

        // Crear un objeto solo con los campos que quieres enviar
        const empleadoActualizado: EmployeeUpdate = {
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
        setEmployees(
          employees.map((emp) =>
            emp.ID_empleado === editingEmployee.ID_empleado ? editingEmployee : emp
          )
        );

        // Actualizar también los empleados mostrados (filtrados o no)
        setDisplayEmployees(
          displayEmployees.map((emp) =>
            emp.ID_empleado === editingEmployee.ID_empleado ? editingEmployee : emp
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



  const handleToggleStatus = async (ID_empleado: number) => {
    // Encontrar el empleado cuyo estado quieres cambiar
    const empleadoActual = employees.find((emp) => emp.ID_empleado === ID_empleado);

    if (empleadoActual) {
      try {
        console.log(empleadoActual);

        // Crear el nuevo estado a actualizar (cambiamos entre "Activo" e "Inactivo")
        const nuevoEstado =
          empleadoActual.estado_empleado.toLowerCase() === "activo" ? "Inactivo" : "Activo";
        // Crear el objeto solo con los campos necesarios para actualizar
        const empleadoActualizado: EstadoActualizado = {
          ID_empleado: empleadoActual.ID_empleado, // Incluimos ID para identificar al empleado
          estado_empleado: nuevoEstado,
          Nombre: empleadoActual.Nombre,
          Apellido: empleadoActual.Apellido,
          Cargo: empleadoActual.Cargo,
          Telefono: empleadoActual.Telefono,
          Direccion: empleadoActual.Direccion
        };

        // Ejecutar la actualización del estado del empleado en la base de datos
        await actualizarCargoEmpleado(empleadoActualizado);

        // Si la actualización es exitosa, actualizar el estado local
        setEmployees(
          employees.map((emp) =>
            emp.ID_empleado === ID_empleado
              ? { ...emp, estado_empleado: nuevoEstado } // Cambiar el estado en el estado local
              : emp
          )
        );

        // Actualizar también los empleados mostrados (filtrados o no)
        setDisplayEmployees(
          displayEmployees.map((emp) =>
            emp.ID_empleado === ID_empleado
              ? { ...emp, estado_empleado: nuevoEstado } // Cambiar el estado en el display
              : emp
          )
        );

        // Mostrar un mensaje de éxito o realizar otra acción
        console.log(`Estado del empleado con ID ${ID_empleado} actualizado a ${nuevoEstado}`);
        alert(`Se ha actualizado el estado del empleado:  ${empleadoActual.Nombre} al estado ${empleadoActual.estado_empleado.toLowerCase() === "activo" ? "Inactivo" : "Activo"} `);

      } catch (error) {
        console.error('Error al actualizar el estado del empleado:', error);
        alert('Error al actualizar el estado del empleado. Inténtalo de nuevo.');
      }
    } else {
      console.error('Empleado no encontrado');
    }
  };
  // Abrir modal de estadísticas de un empleado específico
  const handleOpenStatsModal = (employee: Employee) => {
    setSelectedEmployeeStats(employee);
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
                  value={newEmployee.nombre}
                  onChange={(e) => setNewEmployee({ ...newEmployee, nombre: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="apellido" className="text-right">
                  Apellido
                </Label>
                <Input
                  id="apellido"
                  value={newEmployee.apellido}
                  onChange={(e) => setNewEmployee({ ...newEmployee, apellido: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="cargo" className="text-right">
                  Cargo
                </Label>
                <Input
                  id="cargo"
                  value={newEmployee.cargo}
                  onChange={(e) => setNewEmployee({ ...newEmployee, cargo: e.target.value })}
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
                  value={newEmployee.telefono}
                  onChange={(e) => setNewEmployee({ ...newEmployee, telefono: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="direccion" className="text-right">
                  Dirección
                </Label>
                <Input
                  id="direccion"
                  value={newEmployee.direccion}
                  onChange={(e) => setNewEmployee({ ...newEmployee, direccion: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="usuario" className="text-right">
                  Usuario
                </Label>
                <Input
                  id="usuario"
                  value={newEmployee.usuario}
                  onChange={(e) => setNewEmployee({ ...newEmployee, usuario: e.target.value })}
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
                  value={newEmployee.contraseña}
                  onChange={(e) => setNewEmployee({ ...newEmployee, contraseña: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <Button onClick={handleAddEmployee}>Añadir Empleado</Button>
          </DialogContent>
        </Dialog>

      </div>

      {/* Tabla de empleados */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Apellido</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Estadística</TableHead>
            <TableHead>Editar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayEmployees.map((employee) => (
            <TableRow key={employee.ID_empleado}>
              <TableCell>{employee.Nombre}</TableCell>
              <TableCell>{employee.Apellido}</TableCell>
              <TableCell>
                <Switch
                  checked={employee.estado_empleado.toLowerCase() === "activo"} // El estado del Switch se basa en estado_empleado, insensible a mayúsculas
                  onCheckedChange={() => handleToggleStatus(employee.ID_empleado)}
                />
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm" onClick={() => handleOpenStatsModal(employee)}>
                  <BarChart className="mr-2 h-4 w-4" />
                  Ver Estadísticas
                </Button>
              </TableCell>
              <TableCell>
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setEditingEmployee(employee)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent aria-describedby="description" >
                    <DialogHeader>
                      <DialogTitle>Editar Empleado {employee.Nombre}</DialogTitle>
                    </DialogHeader>
                    {editingEmployee && (
                      <div className="grid gap-4 py-4">
                        {/* Nombre */}
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="edit-name" className="text-right">
                            Nombre
                          </Label>
                          <Input
                            id="edit-name"
                            value={editingEmployee.Nombre}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, Nombre: e.target.value })}
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
                            value={editingEmployee.Apellido}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, Apellido: e.target.value })}
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
                            value={editingEmployee.Cargo}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, Cargo: e.target.value })}
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
                            value={editingEmployee.Telefono}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, Telefono: e.target.value })}
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
                            value={editingEmployee.Direccion}
                            onChange={(e) => setEditingEmployee({ ...editingEmployee, Direccion: e.target.value })}
                            className="col-span-3"
                          />
                        </div>
                      </div>
                    )}
                    <Button onClick={handleEditEmployee}>Guardar Cambios</Button>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Modal de estadísticas */}
      <Dialog open={isStatsModalOpen} onOpenChange={setIsStatsModalOpen}>
        <DialogContent  aria-describedby="description" className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Estadísticas de Ventas Semanales</DialogTitle>
          </DialogHeader>
          {selectedEmployeeStats && (
            <div className="py-4">
              <h3 className="text-lg font-semibold mb-2">
                {selectedEmployeeStats.Nombre} {selectedEmployeeStats.Apellido}
              </h3>
              <Line
                options={chartOptions}
                data={{
                  labels: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
                  datasets: [
                    {
                      label: "Ventas",
                      data: selectedEmployeeStats.weeklySales || [0, 0, 0, 0, 0, 0, 0],
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
