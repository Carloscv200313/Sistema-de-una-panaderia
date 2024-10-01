// app/api/empleados/[id]/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../utils/dbConnect';  // Asegúrate de que la ruta sea correcta
import sql from 'mssql';

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params; // Extraer el id de los parámetros de la URL

    try {
        const pool = await dbConnect();
        const result = await pool.request()
            .input('id', sql.VarChar, id) // Utilizar el id extraído
            .query('SELECT * FROM empleados WHERE ID_empleado = @id');

        // Verificar si el empleado fue encontrado
        if (result.recordset.length > 0) {
            return NextResponse.json(result.recordset);
        } else {
            return NextResponse.json({ message: 'Empleado no existe' }, { status: 404 });
        }
    } catch (error) {
        console.error('Error al consultar el empleado:', error);
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
    }
}


export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const data = await req.json(); 

    try {
        const pool = await dbConnect();
        // Actualizar datos personales del empleado
        await pool.request()
            .input('id', sql.VarChar, id)
            .input('Nombre', sql.VarChar, data.Nombre)
            .input('Apellido', sql.VarChar, data.Apellido)
            .input('Telefono', sql.VarChar, data.Telefono)
            .query('UPDATE empleados SET Nombre = @Nombre, Apellido = @Apellido, Telefono = @Telefono WHERE ID_empleado = @id');
        
        // Obtener los datos actualizados
        const result = await pool.request()
            .input('id', sql.VarChar, id)
            .query('SELECT * FROM empleados WHERE ID_empleado = @id');

        return NextResponse.json(result.recordset[0]);
    } catch (error) {
        console.error('Error al actualizar datos personales:', error);
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
    }
}