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
    const fechaVenta = new Date().toISOString().split("T")[0];
    const horaVenta = new Date().toISOString().split("T")[1].split(".")[0];

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

      // Si el método de pago es 'tarjeta', usar los datos de tarjeta, caso contrario, null
      const tarjetaInfo =
        metodo_de_pago === "tarjeta"
          ? {
              id_tarjeta,
              nombre_cliente,
              apellido_cliente,
              dni_cliente,
              cuotas,
              adelanto,
            }
          : {
              id_tarjeta: null,
              nombre_cliente: null,
              apellido_cliente: null,
              dni_cliente: null,
              cuotas: null,
              adelanto: null,
            };

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
          tarjetaInfo.id_tarjeta,
          tarjetaInfo.nombre_cliente,
          tarjetaInfo.apellido_cliente,
          tarjetaInfo.dni_cliente,
          tarjetaInfo.cuotas,
          tarjetaInfo.adelanto,
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
    return res.status(400).json({ error: "Faltan datos en la solicitud." });
  }

  try {
    // Consulta la tabla Stock
    const [stock] = await db.query(
      "SELECT * FROM Stock WHERE id_mercaderia = ? AND id_sucursal = ? AND borrado = 0 AND cantidad > 1",
      [id_mercaderia, id_sucursal]
    );

    if (stock.length === 0) {
      return res.status(404).json({
        error: "No se encontraron artículos disponibles o están borrados.",
      });
    }

    // Consulta la tabla Mercaderia
    const [mercaderia] = await db.query(
      `SELECT
        id AS Artículo,
        descripcion AS Descripcion,
        publico AS Precio
        FROM Mercaderia WHERE id = ?`,
      [id_mercaderia]
    );

    if (mercaderia.length === 0) {
      return res
        .status(404)
        .json({ error: "Artículo no encontrado en la tabla Mercaderia." });
    }

    // Envía los datos encontrados
    res.status(200).json(mercaderia[0]);
  } catch (error) {
    console.error("Error obteniendo el artículo:", error);
    res.status(500).json({ error: "Error obteniendo el artículo." });
  }
};

