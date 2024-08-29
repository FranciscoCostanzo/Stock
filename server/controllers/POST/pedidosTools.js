import db from "../../config/db.js";
import crypto from "crypto";

export const pedirArticuloPedidos = async (req, res) => {
  const { id_mercaderia } = req.body;

  if (!id_mercaderia) {
    return res.status(400).json({
      error: "FaltanDatos",
      message: "Faltan datos en la solicitud.",
    });
  }

  try {
    // Consulta primero la tabla Mercaderia para verificar si el artículo existe
    const [mercaderia] = await db.query(
      `SELECT
          id AS Artículo,
          descripcion AS Descripcion,
          publico AS Precio
        FROM Mercaderia WHERE id = ?`,
      [id_mercaderia]
    );

    if (mercaderia.length === 0) {
      return res.status(404).json({
        error: "NoArticulo", // Error específico para manejar en el front
        message: "Artículo no encontrado en la tabla Mercaderia.",
      });
    }

    // Envía los datos del artículo si todo está bien
    res.status(200).json(mercaderia[0]);
  } catch (error) {
    console.error("Error obteniendo el artículo:", error);
    res.status(500).json({
      error: "ServerError", // Error genérico para manejar en el front
      message: "Error obteniendo el artículo.",
    });
  }
};

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
        message: "No se encontraron pedidos pendientes para la sucursal especificada.",
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
export const EnviarPedidoAdmin = async (req, res) => {
  try {
    const pedidos = req.body;

    if (!Array.isArray(pedidos) || pedidos.length === 0) {
      return res.status(400).json({
        message: "El cuerpo de la solicitud debe ser un array con pedidos.",
      });
    }

    // Mapa para asociar un UUID a cada id_sucursal
    const pedidosPorSucursal = new Map();

    // Validar datos y asignar UUID
    for (const pedido of pedidos) {
      const { id_usuario, id_sucursal, id_mercaderia, cantidad } = pedido;

      // Validar presencia y tipo de los campos
      if (!id_usuario || !id_sucursal || !id_mercaderia || !cantidad) {
        return res.status(400).json({
          message:
            "Todos los campos (id_usuario, id_sucursal, id_mercaderia, cantidad) son obligatorios.",
        });
      }

      if (
        typeof id_usuario !== "number" ||
        typeof id_sucursal !== "number" ||
        typeof id_mercaderia !== "number" ||
        typeof cantidad !== "number" ||
        isNaN(id_usuario) ||
        isNaN(id_sucursal) ||
        isNaN(id_mercaderia) ||
        isNaN(cantidad)
      ) {
        return res.status(400).json({
          message: "Los campos deben ser de tipo numérico y no pueden ser NaN.",
        });
      }

      // Asignar UUID si no existe para esta id_sucursal
      if (!pedidosPorSucursal.has(id_sucursal)) {
        pedidosPorSucursal.set(id_sucursal, crypto.randomUUID());
      }
    }

    // Fecha actual en formato ISO 8601 sin hora
    const fechaActual = new Date().toISOString().split("T")[0];

    // Insertar cada pedido en la tabla Pedidos
    const queries = [];
    for (const pedido of pedidos) {
      const { id_usuario, id_sucursal, id_mercaderia, cantidad } = pedido;
      // Obtener el UUID asociado a esta id_sucursal
      const idPedido = pedidosPorSucursal.get(id_sucursal);

      queries.push(
        db.query(
          `INSERT INTO Pedidos (id, id_usuario, id_sucursal, id_mercaderia, cantidad, fecha) 
             VALUES (?, ?, ?, ?, ?, ?)`,
          [
            idPedido,
            id_usuario,
            id_sucursal,
            id_mercaderia,
            cantidad,
            fechaActual,
          ]
        )
      );
    }

    // Ejecutar todas las consultas en paralelo
    await Promise.all(queries);

    res.status(200).json({ message: "Pedidos registrados correctamente." });
  } catch (error) {
    console.error("Error al registrar los pedidos:", error);
    res.status(500).json({ message: "Error al registrar los pedidos", error });
  }
};

export const recibirPedido = async (req, res) => {
  const connection = await db.getConnection(); // Asegúrate de obtener una conexión de la base de datos

  try {
    // Obtener el array de IDs de los pedidos desde el cuerpo de la solicitud
    const { ids } = req.body;

    // Verificar que el array de IDs esté definido y tenga al menos un ID
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        error: "FaltanDatos",
        message: "Se requiere un array de IDs de pedidos en el formato { ids: [array de IDs] }.",
      });
    }

    // Obtener los datos de los pedidos
    const checkQuery = `SELECT id, id_sucursal, id_mercaderia, cantidad FROM Pedidos WHERE id IN (?)`;
    const [pedidosData] = await connection.query(checkQuery, [ids]);

    if (pedidosData.length === 0) {
      return res.status(404).json({
        error: "NoExiste",
        message: "No se encontraron pedidos con los IDs proporcionados.",
      });
    }

    // Mapear los datos obtenidos por id_sucursal e id_mercaderia
    const stockUpdates = pedidosData.reduce((acc, { id_sucursal, id_mercaderia, cantidad }) => {
      const key = `${id_sucursal}-${id_mercaderia}`;
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += cantidad;
      return acc;
    }, {});

    // Iniciar una transacción para actualizar la tabla Stock y Pedidos
    await connection.beginTransaction();

    for (const [key, totalCantidad] of Object.entries(stockUpdates)) {
      const [id_sucursal, id_mercaderia] = key.split('-');

      // Verificar si existe una fila en Stock con id_sucursal e id_mercaderia
      const stockQuery = `SELECT cantidad FROM Stock WHERE id_sucursal = ? AND id_mercaderia = ?`;
      const [stockData] = await connection.query(stockQuery, [id_sucursal, id_mercaderia]);

      if (stockData.length === 0) {
        // Si no existe, insertar una nueva fila en Stock
        const insertQuery = `INSERT INTO Stock (id_sucursal, id_mercaderia, cantidad) VALUES (?, ?, ?)`;
        await connection.query(insertQuery, [id_sucursal, id_mercaderia, totalCantidad]);
      } else {
        // Si existe, sumar la cantidad a la cantidad existente
        const existingQuantity = stockData[0].cantidad;
        const updatedQuantity = existingQuantity + totalCantidad;
        const updateQuery = `UPDATE Stock SET cantidad = ? WHERE id_sucursal = ? AND id_mercaderia = ?`;
        await connection.query(updateQuery, [updatedQuantity, id_sucursal, id_mercaderia]);
      }
    }

    // Actualizar el estado de los pedidos a '1'
    const updateEstadoQuery = `UPDATE Pedidos SET estado = 1 WHERE id IN (?)`;
    await connection.query(updateEstadoQuery, [ids]);

    // Confirmar la transacción
    await connection.commit();

    res.status(200).json({
      message: "Pedidos actualizados correctamente.",
      updatedIds: ids,
    });
  } catch (error) {
    // Revertir la transacción en caso de error
    await connection.rollback();
    console.error("Error al recibir los pedidos:", error);
    res.status(500).json({
      error: "ServerError",
      message: "Error al procesar la solicitud de recibir pedidos.",
    });
  } finally {
    // Liberar la conexión
    connection.release();
  }
};

