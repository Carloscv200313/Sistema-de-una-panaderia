import { NextResponse } from 'next/server';
import { dbConnect } from '../../../utils/dbConnect';  // Ruta para conectar con la BD
import sql from 'mssql';

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json(); // Capturar el usuario y la contraseña desde el cuerpo de la solicitud
        // Mostrar los valores recibidos
        console.log("Usuario:", username);
        console.log("Contraseña:", password);

        // Conectarse a la base de datos
        const pool = await dbConnect();

        // Llamar al procedimiento almacenado para verificar el usuario y la contraseña
        const result = await pool.request()
            .input('Usuario', sql.VarChar, username)
            .input('Contraseña', sql.VarChar, password)
            .execute('VerificarUsuario');

        console.log("Resultado del procedimiento almacenado:", result);

        const user = result.recordset[0];

        // Si el resultado no contiene datos, las credenciales son incorrectas
        if (!user) {
            return NextResponse.json({ message: 'Credenciales incorrectas' }, { status: 401 });
        }

        // Si todo está bien, devolver los datos del usuario
        return NextResponse.json(user);
    } catch (error) {
        console.error('Error al verificar usuario:', error);
        return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
    }
}
