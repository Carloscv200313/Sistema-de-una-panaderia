// app/api/ventas/detalladas/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../utils/dbConnect';  // Ruta para conectar con la BD

export async function GET() {
  const pool = await dbConnect();

  try {
    const result = await pool.request().execute('VerVentasDetalladas');
    return NextResponse.json(result.recordset);
  } catch (error) {
    console.error('Error al obtener las ventas detalladas:', error);
    return NextResponse.json({ error: 'Error al obtener las ventas detalladas' }, { status: 500 });
  }
}
