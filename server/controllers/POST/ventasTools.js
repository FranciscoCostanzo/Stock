import db from "../../config/db.js";
import crypto from "crypto";
import { createErrorResponse, ErrorCodes, obtenerFechaHoraArgentina } from "../../config/server.js";

// Controlador para cargar ventas
export const cargarVenta = async (req, res) => {
  const connection = await db.getConnection(); // Obtén una conexión del pool
  try {
    const ventas = req.body;

    // Validar si hay ventas
    if (!Array.isArray(ventas) || ventas.length === 0) {
      return res
        .status(400)
        .json(
          createErrorResponse(
            ErrorCodes.VALIDATION_ERROR,
            "No hay ventas para registrar."
          )
        );
    }

    // Generar un ID de venta único para todas las filas
    const idVenta = crypto.randomUUID();

    const { fecha, hora } = obtenerFechaHoraArgentina();

    // Iniciar transacción
    await connection.beginTransaction();

    // Insertar cada objeto como una fila en la tabla Ventas
    for (const venta of ventas) {
      const {
        id_usuario,
        id_sucursal,
        id_mercaderia,
        cantidad,
        metodo_de_pago,
        id_tarjeta,
        nombre_cliente,
        apellido_cliente,
        dni_cliente,
        cuotas,
        adelanto,
        total_venta,
      } = venta;

      // Validación para ventas con método de pago 'tarjeta'
      if (
        metodo_de_pago === "tarjeta" &&
        (!nombre_cliente || !apellido_cliente || !dni_cliente)
      ) {
        return res
          .status(400)
          .json(
            createErrorResponse(
              ErrorCodes.VALIDATION_ERROR,
              "Datos de cliente son obligatorios para pagos con tarjeta"
            )
          );
      }

      // Verificar si hay suficiente stock
      const [stockResult] = await connection.query(
        `SELECT cantidad FROM Stock WHERE id_mercaderia = ? AND id_sucursal = ?`,
        [id_mercaderia, id_sucursal]
      );

      if (stockResult.length === 0) {
        await connection.rollback(); // Deshacer transacción
        return res
          .status(400)
          .json(
            createErrorResponse(
              ErrorCodes.STOCK_NOT_FOUND,
              "Mercadería no encontrada en stock"
            )
          );
      }

      const stockDisponible = stockResult[0].cantidad;

      if (stockDisponible < cantidad) {
        await connection.rollback(); // Deshacer transacción
        return res
          .status(400)
          .json(
            createErrorResponse(
              ErrorCodes.STOCK_INSUFFICIENT,
              "Stock insuficiente para realizar la venta"
            )
          );
      }

      // Calcular el campo total
      const total = adelanto + total_venta;

      // Ejecutar la inserción en la tabla Ventas
      await connection.query(
        `INSERT INTO Ventas (
          id_venta, fecha_venta, hora_venta, id_usuario, id_sucursal, id_mercaderia, cantidad, 
          metodo_de_pago, id_tarjeta, nombre_cliente, apellido_cliente, dni_cliente, cuotas, 
          adelanto, total_venta, total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          idVenta,
          fecha,
          hora,
          id_usuario,
          id_sucursal,
          id_mercaderia,
          cantidad,
          metodo_de_pago,
          metodo_de_pago === "tarjeta" ? id_tarjeta : null,
          metodo_de_pago === "tarjeta" ? nombre_cliente : null,
          metodo_de_pago === "tarjeta" ? apellido_cliente : null,
          metodo_de_pago === "tarjeta" ? dni_cliente : null,
          metodo_de_pago === "tarjeta" ? cuotas : null,
          metodo_de_pago === "tarjeta" ? adelanto : null,
          total_venta,
          total,
        ]
      );

      // Descontar el stock
      await connection.query(
        `UPDATE Stock SET cantidad = cantidad - ? WHERE id_mercaderia = ? AND id_sucursal = ?`,
        [cantidad, id_mercaderia, id_sucursal]
      );
    }

    // Confirmar transacción
    await connection.commit();
    res
      .status(200)
      .json({
        success: true,
        message: "Ventas registradas correctamente y stock actualizado",
      });
  } catch (error) {
    await connection.rollback(); // Deshacer transacción en caso de error

    let errorCode = ErrorCodes.UNKNOWN_ERROR;
    let errorMessage = "Error desconocido al registrar las ventas";

    // Detectar errores específicos de conexión o transacción
    if (error.code === "ER_NO_SUCH_TABLE") {
      errorCode = ErrorCodes.DB_CONNECTION_ERROR;
      errorMessage = "Error de conexión a la base de datos";
    } else if (error.message.includes("Transaction")) {
      errorCode = ErrorCodes.TRANSACTION_ERROR;
      errorMessage = "Error durante la transacción";
    }

    console.error(`Error (${errorCode}):`, error);
    res
      .status(500)
      .json(createErrorResponse(errorCode, errorMessage, error.message));
  } finally {
    connection.release(); // Liberar la conexión
  }
};

export const pedirArticuloEmpleado = async (req, res) => {
  const { id_mercaderia, id_sucursal } = req.body;

  if (!id_mercaderia || !id_sucursal) {
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

    // Si el artículo existe, consulta la tabla Stock para verificar el stock disponible
    const [stock] = await db.query(
      "SELECT * FROM Stock WHERE id_mercaderia = ? AND id_sucursal = ? AND borrado = 0 AND cantidad > 0",
      [id_mercaderia, id_sucursal]
    );

    if (stock.length === 0) {
      return res.status(404).json({
        error: "NoStock", // Error específico para manejar en el front
        message:
          "No hay stock disponible o el artículo está marcado como borrado.",
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
