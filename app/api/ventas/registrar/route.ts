import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../utils/dbConnect'; // Asegúrate de que la ruta sea la correcta a tu archivo de conexión
import sql from 'mssql';

export async function POST(request: Request) {
  try {
    const {
      ID_empleado,
      Cliente_Nombre = "Desconocido", // Nombre por defecto si no se especifica
      Cliente_Apellido = "Desconocido", // Apellido por defecto si no se especifica
      Total,
      ID_estado_venta,
      ID_metodo_pago,
      ID_tipo_venta,
      Productos,
    } = await request.json();

    const pool = await dbConnect(); // Conexión a la base de datos

    // Ejecutar el procedimiento almacenado para registrar la venta
    const result = await pool
      .request()
      .input("ID_empleado", sql.Int, ID_empleado)
      .input("NombreCliente", sql.NVarChar(50), Cliente_Nombre) // Asegúrate de usar el nombre correcto en el SP
      .input("ApellidoCliente", sql.NVarChar(50), Cliente_Apellido) // Incluye el apellido
      .input("Total", sql.Decimal(10, 2), Total)
      .input("ID_estado_venta", sql.Int, ID_estado_venta)
      .input("ID_metodo_pago", sql.Int, ID_metodo_pago)
      .input("ID_tipo_venta", sql.Int, ID_tipo_venta)
      .input("Productos", sql.NVarChar(sql.MAX), Productos) // Productos en formato JSON
      .execute("RegistrarVenta");

    return NextResponse.json({
      message: "Venta registrada correctamente",
      ventaID: result.recordset[0]?.ID_venta || null, // Manejo del ID de la venta registrado
    });
  } catch (error) {
    console.error("Error al registrar la venta:", error);
    return NextResponse.json(
      { error: "Error al registrar la venta" },
      { status: 500 }
    );
  }
}


export async function GET() {
    const pool = await dbConnect();

    try {
        const result = await pool.request().execute('VerProductosTipoProducto'); // Ejecuta el procedimiento almacenado

        return NextResponse.json(result.recordset); // Devuelve los productos
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        return NextResponse.json({ error: 'Error al obtener los productos' }, { status: 500 });
    }
}