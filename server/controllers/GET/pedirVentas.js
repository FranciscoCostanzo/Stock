import db from "../../config/db.js";

export const pedirVentasSemana = async (req, res) => {
  try {
    // Obtener la fecha actual y la fecha de una semana atrás
    const fechaActual = new Date().toISOString().split("T")[0]; // Formato YYYY/MM/DD
    const fechaUnaSemanaAntes = new Date();
    fechaUnaSemanaAntes.setDate(fechaUnaSemanaAntes.getDate() - 7);
    const fechaInicio = fechaUnaSemanaAntes.toISOString().split("T")[0];

    // Consulta para obtener las ventas en el rango de fecha con todos los joins necesarios
    const [results] = await db.query(
      `
      SELECT 
        Ventas.id_venta AS id_venta,
        DATE_FORMAT(Ventas.fecha_venta, '%Y/%m/%d') AS Fecha,
        Ventas.hora_venta AS Hora,
        Usuarios.nombre AS Usuario,
        CONCAT(Sucursal.ciudad, ' - ', Sucursal.nombre) AS Sucursal,
        Mercaderia.descripcion AS Descripcion,
        Mercaderia.publico AS Publico,
        Ventas.cantidad AS Cantidad,
        Ventas.metodo_de_pago AS Metodo,
        Tarjetas.tipo_tarjeta AS Tarjeta,
        Ventas.cuotas AS Cuotas,
        Ventas.nombre_cliente AS NombreCliente,
        Ventas.apellido_cliente AS ApellidoCliente,
        Ventas.dni_cliente AS DNICliente,
        Ventas.adelanto AS Adelanto,
        Ventas.total_venta AS total_venta,
        Ventas.total AS Total
      FROM 
        Ventas
      INNER JOIN 
        Usuarios ON Ventas.id_usuario = Usuarios.id
      INNER JOIN 
        Sucursal ON Ventas.id_sucursal = Sucursal.id
      INNER JOIN 
        Mercaderia ON Ventas.id_mercaderia = Mercaderia.id
      LEFT JOIN 
        Tarjetas ON Ventas.id_tarjeta = Tarjetas.id
      WHERE 
        Ventas.fecha_venta BETWEEN ? AND ?
      GROUP BY 
        Ventas.id_venta, Ventas.fecha_venta, Ventas.hora_venta, Usuarios.nombre, Sucursal.ciudad, Sucursal.nombre, 
        Mercaderia.descripcion, Mercaderia.publico, Ventas.cantidad, Ventas.metodo_de_pago, Tarjetas.tipo_tarjeta,
        Ventas.cuotas, Ventas.nombre_cliente, Ventas.apellido_cliente, Ventas.dni_cliente, Ventas.adelanto, 
        Ventas.total_venta, Ventas.total
    `,
      [fechaInicio, fechaActual]
    );


    // Enviar los resultados
    res.json(results);
  } catch (error) {
    console.error("Error al obtener las ventas de la semana:", error);
    res.status(500).json({ message: "Error al obtener las ventas." });
  }
};
