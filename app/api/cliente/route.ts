import { NextResponse } from 'next/server';
import { dbConnect } from '../../../utils/dbConnect';  // Ruta para conectar con la BD
import sql from 'mssql';

export async function POST(request: Request) {
  const { Nombre, Apellido } = await request.json(); // Datos enviados desde el frontend

  if (!Nombre || !Apellido) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 });
  }

  try {
    const pool = await dbConnect(); // Conectar a la base de datos
    const result = await pool.request()
      .input('Nombre', sql.NVarChar(50), Nombre)
      .input('Apellido', sql.NVarChar(50), Apellido)
      .execute('AgregarCliente'); // Llamada al procedimiento almacenado

    // Suponiendo que el procedimiento almacenado devuelve el ID del cliente
    const clienteID = result.recordset[0]?.ID_cliente;

    if (clienteID) {
      return NextResponse.json({ message: 'Cliente agregado correctamente', ID_cliente: clienteID });
    } else {
      return NextResponse.json({ error: 'Error al agregar el cliente' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error al agregar el cliente:', error);
    return NextResponse.json({ error: 'Error del servidor' }, { status: 500 });
  }
}
