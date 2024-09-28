// app/api/empleados/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../utils/dbConnect';  // Ruta para conectar con la BD

export async function GET() {
  const pool = await dbConnect();
  const result = await pool.request().query('SELECT * FROM Empleado');
  
  return NextResponse.json(result.recordset);
}

export async function POST(request) {
  const data = await request.json();
  const pool = await dbConnect();
  await pool.request().input('nombre', sql.VarChar, data.nombre).query('INSERT INTO Empleados (nombre) VALUES (@nombre)');
  return NextResponse.json({ message: 'Empleado creado' });
}
