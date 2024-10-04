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
    const { id } = params;  // id del empleado a actualizar
    const data = await req.json();  // Se recibe el cuerpo de la solicitud en formato JSON

    try {
        const pool = await dbConnect();
        // Actualizar datos personales del empleado
        await pool.request()
            .input('ID_empleado', sql.Int, id)              // Cambiar de ID_producto a ID_empleado
            .input('DNI', sql.VarChar, data.dni)            // Pasar el DNI desde el JSON
            .input('Nombre', sql.VarChar, data.nombre)      // Pasar el nombre desde el JSON
            .input('Apellido', sql.VarChar, data.apellido)  // Pasar el apellido desde el JSON
            .input('Telefono', sql.VarChar, data.telefono)  // Pasar el teléfono desde el JSON
            .input('Direccion', sql.VarChar, data.direccion) // Pasar la dirección desde el JSON
            .input('Activo', sql.Bit, data.activo)          // Estado activo (0 o 1)
            .input('ID_cargo', sql.Int, data.cargo)         // El cargo del empleado
            .execute('EditarEmpleado');  // Usar el procedimiento almacenado correcto
        return NextResponse.json({ message: 'Empleado actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar datos del empleado:', error);
        return NextResponse.json({ error: 'Error en el servidor' }, { status: 500 });
    }
}
