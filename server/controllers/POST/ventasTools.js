import db from "../../config/db.js";
import crypto from "crypto";

export const cargarVenta = async (req, res) => {
  try {
    const ventas = req.body;

    // Generar un ID de venta único para todas las filas del mismo req.body
    function generateUniqueId() {
      return crypto.randomUUID(); // Node.js 15+ y versiones modernas
    }
    const idVenta = generateUniqueId();

    // Fecha y hora actual en formato ISO 8601
        const fechaVenta = new Date().toLocaleDateString('en-CA').replace(/-/g, '/'); // YYYY/MM/DD
        const horaVenta = new Date().toLocaleTimeString('es-AR', {
          hour12: false,
          timeZone: 'America/Argentina/Buenos_Aires',
        });

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

      // Validación adicional para ventas con método de pago 'tarjeta'
      if (metodo_de_pago === "tarjeta") {
        if (!nombre_cliente || !apellido_cliente || !dni_cliente) {
          return res.status(400).json({ message: "Datos de cliente son obligatorios para pagos con tarjeta" });
        }
      }

      // Verificar si hay suficiente stock disponible antes de realizar la venta
      const [stockResult] = await db.query(
        `SELECT cantidad FROM Stock WHERE id_mercaderia = ? AND id_sucursal = ?`,
        [id_mercaderia, id_sucursal]
      );

      if (stockResult.length === 0) {
        return res.status(400).json({ message: "Mercadería no encontrada en stock" });
      }

      const stockDisponible = stockResult[0].cantidad;

      if (stockDisponible < cantidad) {
        return res.status(400).json({ message: "Stock insuficiente para realizar la venta" });
      }

      // Calcular el campo total como suma de adelanto y total_venta
      const total = adelanto + total_venta;

      // Ejecutar la inserción en la base de datos
      await db.query(
        `INSERT INTO Ventas (
          id_venta, fecha_venta, hora_venta, id_usuario, id_sucursal, id_mercaderia, cantidad, 
          metodo_de_pago, id_tarjeta, nombre_cliente, apellido_cliente, dni_cliente, cuotas, 
          adelanto, total_venta, total
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          idVenta,
          fechaVenta,
          horaVenta,
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

      // Descontar la cantidad de mercadería en la tabla Stock
      await db.query(
        `UPDATE Stock
        SET cantidad = cantidad - ?
        WHERE id_mercaderia = ? AND id_sucursal = ?`,
        [cantidad, id_mercaderia, id_sucursal]
      );
    }

    res.status(200).json({ message: "Ventas registradas correctamente y stock actualizado" });
  } catch (error) {
    console.error("Error al registrar las ventas:", error);
    res.status(500).json({ message: "Error al registrar las ventas", error });
  }
};

export const pedirArticuloEmpleado = async (req, res) => {
  const { id_mercaderia, id_sucursal } = req.body;

  if (!id_mercaderia || !id_sucursal) {
    return res.status(400).json({ 
      error: "FaltanDatos", 
      message: "Faltan datos en la solicitud." 
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
        message: "No hay stock disponible o el artículo está marcado como borrado.",
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



