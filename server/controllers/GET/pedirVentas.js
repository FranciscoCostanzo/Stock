import db from "../../config/db.js";

export const pedirVentasAdmin = async (req, res) => {
  try {
    // Consulta para obtener todas las ventas sin límite de tiempo
    const [results] = await db.query(
      `
      SELECT 
        Ventas.id_venta AS id_venta,
        DATE_FORMAT(Ventas.fecha_venta, '%Y/%m/%d') AS Fecha,
        Ventas.hora_venta AS Hora,
        Usuarios.nombre AS Usuario,
        CONCAT(Sucursal.ciudad, ' - ', Sucursal.nombre) AS Sucursal,
        Mercaderia.descripcion AS Descripcion,
        Mercaderia.costo AS Costo,
        Mercaderia.publico AS Publico,
        Ventas.cantidad AS Cantidad,
        Ventas.metodo_de_pago AS Metodo,
        COALESCE(Tarjetas.tipo_tarjeta, 'No tiene') AS Tarjeta,
        COALESCE(Ventas.cuotas, 'No tiene') AS Cuotas,
        COALESCE(Ventas.nombre_cliente, 'No tiene') AS NombreCliente,
        COALESCE(Ventas.apellido_cliente, 'No tiene') AS ApellidoCliente,
        COALESCE(Ventas.dni_cliente, 'No tiene') AS DNICliente,
        COALESCE(Ventas.adelanto, 'No tiene') AS Adelanto,
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
      GROUP BY 
        Ventas.id_venta, Ventas.fecha_venta, Ventas.hora_venta, Usuarios.nombre, Sucursal.ciudad, Sucursal.nombre, 
        Mercaderia.descripcion, Mercaderia.publico, Ventas.cantidad, Ventas.metodo_de_pago, Tarjetas.tipo_tarjeta,
        Ventas.cuotas, Ventas.nombre_cliente, Ventas.apellido_cliente, Ventas.dni_cliente, Ventas.adelanto, 
        Ventas.total_venta, Ventas.total
    `
    );

    // Enviar los resultados
    res.json(results);
  } catch (error) {
    console.error("Error al obtener todas las ventas:", error);
    res.status(500).json({ message: "Error al obtener las ventas." });
  }
};

export const pedirVentasPorSucursal = async (req, res) => {
  const { idSucursal } = req.params; // Obtener el id de la sucursal de los parámetros

  try {
    // Consulta para obtener las ventas de una sucursal específica
    const [results] = await db.query(
      `
      SELECT 
        Ventas.id_venta AS id_venta,
        DATE_FORMAT(Ventas.fecha_venta, '%Y/%m/%d') AS Fecha,
        Ventas.hora_venta AS Hora,
        Usuarios.nombre AS Usuario,
        CONCAT(Sucursal.ciudad, ' - ', Sucursal.nombre) AS Sucursal,
        Mercaderia.descripcion AS Descripcion,
        Mercaderia.costo AS Costo,
        Mercaderia.publico AS Publico,
        Ventas.cantidad AS Cantidad,
        Ventas.metodo_de_pago AS Metodo,
        COALESCE(Tarjetas.tipo_tarjeta, 'No tiene') AS Tarjeta,
        COALESCE(Ventas.cuotas, 'No tiene') AS Cuotas,
        COALESCE(Ventas.nombre_cliente, 'No tiene') AS NombreCliente,
        COALESCE(Ventas.apellido_cliente, 'No tiene') AS ApellidoCliente,
        COALESCE(Ventas.dni_cliente, 'No tiene') AS DNICliente,
        COALESCE(Ventas.adelanto, 'No tiene') AS Adelanto,
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
        Ventas.id_sucursal = ?
      GROUP BY 
        Ventas.id_venta, Ventas.fecha_venta, Ventas.hora_venta, Usuarios.nombre, Sucursal.ciudad, Sucursal.nombre, 
        Mercaderia.descripcion, Mercaderia.publico, Ventas.cantidad, Ventas.metodo_de_pago, Tarjetas.tipo_tarjeta,
        Ventas.cuotas, Ventas.nombre_cliente, Ventas.apellido_cliente, Ventas.dni_cliente, Ventas.adelanto, 
        Ventas.total_venta, Ventas.total
    `,
      [idSucursal]
    );

    // Enviar los resultados
    res.json(results);
  } catch (error) {
    console.error("Error al obtener las ventas de la sucursal:", error);
    res.status(500).json({ message: "Error al obtener las ventas." });
  }
};

