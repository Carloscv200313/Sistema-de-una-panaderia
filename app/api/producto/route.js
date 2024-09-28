// app/api/inventario/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../utils/dbConnect';

export async function GET() {
  const pool = await dbConnect();
  const result = await pool.request().query('SELECT * FROM Producto');
  
  return NextResponse.json(result.recordset);
}
