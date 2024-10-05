// app/api/empleados/actualizar-cargo/[id]/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../utils/dbConnect';  
import sql from 'mssql'; 

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params; // Obtener el ID_empleado desde la URL
  const pool = await dbConnect();

  try {
    const result = await pool.request()
      .input('ID_empleado', sql.Int, id)
      .execute('VerVentasEmpleado'); // Procedimiento almacenado

    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener las ventas del empleado:', error);
    return NextResponse.json({ error: 'Error al obtener las ventas del empleado' }, { status: 500 });
  }
}

