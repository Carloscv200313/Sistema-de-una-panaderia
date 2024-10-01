// app/api/empleados/actualizar-cargo/[id]/route.js
import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../utils/dbConnect';  
import sql from 'mssql'; 

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const data = await req.json();

    try {
        const pool = await dbConnect();
        // Actualizar cargo del empleado
        await pool.request()
            .input('id', sql.VarChar, id)
            .input('estado_empleado', sql.VarChar, data.estado_empleado)
            .query('UPDATE empleados SET estado_empleado = @estado_empleado WHERE ID_empleado = @id');

        // Obtener los datos actualizados
        const result = await pool.request()
            .input('id', sql.VarChar, id)
            .query('SELECT * FROM empleados WHERE ID_empleado = @id');

        return NextResponse.json(result.recordset[0]);
    } catch (error) {
        console.error('Error al actualizar cargo:', error);
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
    }
}
