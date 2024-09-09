import db from "../../config/db.js";

export const pedirPedidosAdmin = async (req, res) => {
    try {
        // Consulta con JOIN y CASE para transformar los valores de estado
        const query = `
        SELECT
          p.id,
          u.nombre AS Usuario,
          m.id AS Articulo,
          m.descripcion AS Descripcion,
          p.cantidad AS Cantidad,
          CONCAT(s.ciudad, ' - ', s.nombre) AS Sucursal,
          DATE_FORMAT(p.fecha, '%Y/%m/%d') AS Fecha,
          CASE
            WHEN p.estado = 0 THEN 'Pendiente'
            WHEN p.estado = 1 THEN 'Recibido'
            ELSE 'Desconocido'
          END AS Estado
        FROM Pedidos p
        JOIN Usuarios u ON p.id_usuario = u.id
        JOIN Sucursal s ON p.id_sucursal = s.id
        JOIN Mercaderia m ON p.id_mercaderia = m.id
      `;

        // `db.query` devuelve un array donde el primer elemento son los resultados de la consulta
        const [pedidos] = await db.query(query);

        if (pedidos.length === 0) {
            return res.status(404).json({
                error: "NoPedidos",
                message: "No se encontraron pedidos.",
            });
        }

        // Envía solo los resultados de los pedidos
        res.status(200).json(pedidos);
    } catch (error) {
        console.error("Error obteniendo los pedidos:", error);
        res.status(500).json({
            error: "ServerError",
            message: "Error obteniendo los pedidos.",
        });
    }
};

export const pedirPedidosEmpleado = async (req, res) => {
    const { id_sucursal } = req.params; // Obtener id_sucursal desde la URL

    if (!id_sucursal) {
        return res.status(400).json({
            error: "FaltanDatos",
            message: "El ID de la sucursal es obligatorio en la URL.",
        });
    }

    try {
        // Consulta con JOIN para obtener toda la información requerida, filtrando por id_sucursal
        const query = `
        SELECT
          p.id,
          u.nombre AS Usuario,
          m.id AS Articulo,
          m.descripcion AS Descripcion,
          p.cantidad AS Cantidad,
          CONCAT(s.ciudad, ' - ', s.nombre) AS Sucursal,
          DATE_FORMAT(p.fecha, '%Y/%m/%d') AS Fecha,
          CASE
            WHEN p.estado = 0 THEN 'Pendiente'
            WHEN p.estado = 1 THEN 'Recibido'
            ELSE 'Desconocido'
          END AS Estado
        FROM Pedidos p
        JOIN Usuarios u ON p.id_usuario = u.id
        JOIN Sucursal s ON p.id_sucursal = s.id
        JOIN Mercaderia m ON p.id_mercaderia = m.id
        WHERE p.id_sucursal = ?
      `;

        // Ejecutar la consulta con el id_sucursal proporcionado
        const [pedidos] = await db.query(query, [id_sucursal]);

        if (pedidos.length === 0) {
            return res.status(404).json({
                error: "NoPedidos",
                message: "No se encontraron pedidos para la sucursal especificada.",
            });
        }

        // Envía los resultados de los pedidos filtrados por id_sucursal
        res.status(200).json(pedidos);
    } catch (error) {
        console.error("Error obteniendo los pedidos para la sucursal:", error);
        res.status(500).json({
            error: "ServerError",
            message: "Error obteniendo los pedidos.",
        });
    }
};

export const pedirPedidosEmpleadoPendientes = async (req, res) => {
    const { id_sucursal } = req.params; // Obtener id_sucursal desde la URL
  
    if (!id_sucursal) {
      return res.status(400).json({
        error: "FaltanDatos",
        message: "El ID de la sucursal es obligatorio en la URL.",
      });
    }
  
    try {
      // Consulta con JOIN para obtener toda la información requerida, filtrando por id_sucursal y estado = 0
      const query = `
        SELECT
          p.id,
          u.nombre AS Usuario,
          m.id AS Articulo,
          m.descripcion AS Descripcion,
          p.cantidad AS Cantidad,
          CONCAT(s.ciudad, ' - ', s.nombre) AS Sucursal,
          DATE_FORMAT(p.fecha, '%Y/%m/%d') AS Fecha,
          CASE
            WHEN p.estado = 0 THEN 'Pendiente'
            WHEN p.estado = 1 THEN 'Recibido'
            ELSE 'Desconocido'
          END AS Estado
        FROM Pedidos p
        JOIN Usuarios u ON p.id_usuario = u.id
        JOIN Sucursal s ON p.id_sucursal = s.id
        JOIN Mercaderia m ON p.id_mercaderia = m.id
        WHERE p.id_sucursal = ? AND p.estado = 0  -- Filtrar por id_sucursal y estado = 0
      `;
  
      // Ejecutar la consulta con el id_sucursal proporcionado
      const [pedidos] = await db.query(query, [id_sucursal]);
  
      if (pedidos.length === 0) {
        return res.status(404).json({
          error: "NoPedidos",
          message:
            "No se encontraron pedidos pendientes para la sucursal especificada.",
        });
      }
  
      // Envía los resultados de los pedidos filtrados por id_sucursal y estado
      res.status(200).json(pedidos);
    } catch (error) {
      console.error("Error obteniendo los pedidos para la sucursal:", error);
      res.status(500).json({
        error: "ServerError",
        message: "Error obteniendo los pedidos.",
      });
    }
  };
