import db from "../../config/db.js";

export const agregarArticulo = async (req, res) => {
    const { descripcion, costo, publico } = req.body;

    try {
        // Validar los datos recibidos
        if (!descripcion || costo === undefined || publico === undefined) {
            return res.status(400).json({ error: "Todos los campos son requeridos" });
        }

        // Obtener una conexión a la base de datos
        const connection = await db.getConnection();

        // Normalizar la descripción a minúsculas para la comparación
        const descripcionLower = descripcion.toLowerCase();

        // Verificar si ya existe un producto con la misma descripción
        const [existingProduct] = await connection.execute(
            "SELECT * FROM Mercaderia WHERE LOWER(descripcion) = ?",
            [descripcionLower]
        );

        if (existingProduct.length > 0) {
            connection.release();
            return res.status(409).json({ error: "El producto ya existe." });
        }

        // Insertar el producto en la base de datos
        const [result] = await connection.execute(
            "INSERT INTO Mercaderia (descripcion, costo, publico) VALUES (?, ?, ?)",
            [descripcion, costo, publico]
        );

        const productoId = result.insertId;

        // Liberar la conexión a la base de datos
        connection.release();

        // Enviar una respuesta exitosa
        res.status(201).json({
            message: "Producto agregado correctamente.",
            productoId: productoId,
        });
    } catch (error) {
        console.error("Error al agregar producto:", error);
        res.status(500).json({
            error: "Error al agregar producto. Verifica los datos enviados.",
        });
    }
};

export const eliminarArticulo = async (req, res) => {
  const { id } = req.body; // Obtenemos el ID del artículo desde el cuerpo de la solicitud

  try {
    // Obtener una conexión a la base de datos
    const connection = await db.getConnection();

    // Verificar si el artículo existe en la tabla Mercaderia
    const [existingProduct] = await connection.execute(
      "SELECT borrado FROM Mercaderia WHERE id = ?",
      [id]
    );

    if (existingProduct.length === 0) {
      connection.release();
      return res.status(404).json({ error: "El artículo no existe." });
    }

    // Marcar el artículo en Mercaderia como eliminado actualizando el campo borrado a 1
    await connection.execute(
      "UPDATE Mercaderia SET borrado = 1 WHERE id = ?",
      [id]
    );

    // Obtener todas las filas de Stock con el mismo id_mercaderia y verificar su estado de borrado
    const [stockEntries] = await connection.execute(
      "SELECT id, borrado FROM Stock WHERE id_mercaderia = ?",
      [id]
    );

    for (const stock of stockEntries) {
      if (stock.borrado === 0) {
        // Marcar el artículo en la tabla Stock como eliminado actualizando el campo borrado a 1
        await connection.execute(
          "UPDATE Stock SET borrado = 1 WHERE id = ?",
          [stock.id]
        );
      }
    }

    // Liberar la conexión a la base de datos
    connection.release();

    // Enviar una respuesta exitosa
    res.status(200).json({ message: "Artículo eliminado correctamente." });
  } catch (error) {
    console.error("Error al eliminar el artículo:", error);
    res.status(500).json({
      error: "Error al eliminar el artículo. Verifica los datos enviados.",
    });
  }
};

export const restablecerTodosArticulos = async (req, res) => {
  const { OKR } = req.body; // Obtener la confirmación del cuerpo de la solicitud

  // Verificar que la confirmación es "OKR"
  if (OKR !== "OKR") {
    return res.status(400).json({ error: "Confirmación incorrecta. Escriba 'OKR' para proceder." });
  }

  try {
    // Obtener una conexión a la base de datos
    const connection = await db.getConnection();

    // Iniciar una transacción
    await connection.beginTransaction();

    // Restablecer la columna borrado en la tabla Mercaderia a 0 para todos los artículos
    await connection.execute(
      "UPDATE Mercaderia SET borrado = 0"
    );

    // Restablecer la columna borrado en la tabla Stock a 0 para todos los registros
    await connection.execute(
      "UPDATE Stock SET borrado = 0"
    );

    // Confirmar la transacción
    await connection.commit();

    // Liberar la conexión a la base de datos
    connection.release();

    // Enviar una respuesta exitosa
    res.status(200).json({ message: "Todos los artículos han sido restablecidos correctamente." });
  } catch (error) {
    console.error("Error al restablecer todos los artículos:", error);

    try {
      // En caso de error, deshacer la transacción
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Error al revertir la transacción:", rollbackError);
    }

    res.status(500).json({
      error: "Error al restablecer todos los artículos. Intenta nuevamente más tarde.",
    });
  }
};






