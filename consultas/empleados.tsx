interface Employee {
  ID_empleado: number;
  Nombre: string;
  Apellido: string;
  Cargo: string;
  Telefono: string;
  Direccion: string;
}

interface newEmployee {
  nombre: string;
  apellido: string;
  cargo: string,
  telefono: string,
  direccion: string,
  usuario: string,
  contraseña: string,
}
export const empleados = async () => {
  // Hacer la llamada a la API desde el cliente
  const response = await fetch('/api/empleados');
  const data = await response.json();
  return data;
};




export const actualizarEmpleado = async (empleado: Employee) => {
  try {
    const response = await fetch(`/api/empleados/${empleado.ID_empleado}` , {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empleado), // Convertir el objeto empleado a JSON
    });
    if (!response.ok) {
      throw new Error('Error al actualizar el empleado');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la actualización del empleado:', error);
    throw error;
  }
};




export const actualizarCargoEmpleado = async (empleado: Employee) => {
  try {
    const response = await fetch(`/api/empleados/${empleado.ID_empleado}` , {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(empleado), // Convertir el objeto empleado a JSON
    });
    if (!response.ok) {
      throw new Error('Error al actualizar el cargo');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la actualización el cargo:', error);
    throw error;
  }
};








export const crearEmpleado = async (newEmployee : newEmployee) => {
  try {
    console.log("Datos enviados al backend:", newEmployee); // Verifica los datos
    const response = await fetch("/api/empleados", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEmployee),
    });

    if (!response.ok) {
      throw new Error("Error al crear empleado");
    }

    const data = await response.json();
    console.log("Respuesta del servidor:", data); // Verifica la respuesta del servidor
  } catch (error) {
    console.error("Error en la creación:", error);
  }
};
