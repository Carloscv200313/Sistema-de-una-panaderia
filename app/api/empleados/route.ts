// app/api/empleados/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../utils/dbConnect';  // Ruta para conectar con la BD
import sql from 'mssql'; 
export async function GET() {
  const pool = await dbConnect();
  const result = await pool.request().query('EXEC ListadoEmpleados;');
  return NextResponse.json(result.recordset);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Verificar los datos recibidos en el backend
    console.log("Datos recibidos en el backend:", data);

    if (!data.nombre || !data.apellido || !data.cargo || !data.telefono || !data.direccion || !data.usuario || !data.contraseña) {
      return NextResponse.json({ error: "Faltan datos requeridos" }, { status: 400 });
    }

    const pool = await dbConnect();

    // Ejecutar el procedimiento almacenado para crear un empleado
    await pool.request()
      .input("Nombre", sql.VarChar, data.nombre)
      .input("Apellido", sql.VarChar, data.apellido)
      .input("Cargo", sql.VarChar, data.cargo)
      .input("Telefono", sql.VarChar, data.telefono)
      .input("Direccion", sql.VarChar, data.direccion)
      .input("Usuario", sql.VarChar, data.usuario)
      .input("Contraseña", sql.VarChar, data.contraseña)
      .execute("CrearUsuarioBasico");

    return NextResponse.json({ message: "Empleado creado correctamente" });
  } catch (error) {
    console.error("Error al crear empleado:", error);
    return NextResponse.json({ error: "Error interno al crear empleado" }, { status: 500 });
  }
}