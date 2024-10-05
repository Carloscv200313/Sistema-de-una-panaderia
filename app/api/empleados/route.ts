// app/api/empleados/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../utils/dbConnect';  // Ruta para conectar con la BD
import sql from 'mssql'; 



//traer solo empleados activos
export async function GET() {
  const pool = await dbConnect();
  const result = await pool.request().query('EXEC ListadoEmpleados @FiltroActivo = 1;');
  return NextResponse.json(result.recordset);
}



//crear nuevo empleado
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Verificar los datos recibidos en el backend
    console.log("Datos recibidos en el backend:", data);
    const fechaContratacion = new Date()
    const activo = 1
    const pool = await dbConnect();

    // Ejecutar el procedimiento almacenado para crear un empleado
    await pool.request()
      .input("DNI", sql.VarChar, data.dni)
      .input("Nombre", sql.VarChar, data.nombre)
      .input("Apellido", sql.VarChar, data.apellido)
      .input("Telefono", sql.VarChar, data.telefono)
      .input("Direccion", sql.VarChar, data.direccion)
      .input("Fecha_contratacion", sql.DateTime, fechaContratacion )
      .input("Activo", sql.Int, activo)
      .input("ID_cargo", sql.Int, data.cargo)
      .input("Usuario", sql.VarChar, data.usuario)
      .input("Contraseña", sql.VarChar, data.contraseña)
      .execute("RegistrarEmpleado");
    return NextResponse.json({ message: "Empleado creado correctamente" });
  } catch (error) {
    console.error("Error al crear empleado:", error);
    return NextResponse.json({ error: "Error interno al crear empleado" }, { status: 500 });
  }
}