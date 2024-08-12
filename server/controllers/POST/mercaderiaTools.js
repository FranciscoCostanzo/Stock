import db from "../../config/db.js";

// Papelera TOOLS
export const agregarArticulo = async (req, res) => {
  let { descripcion, costo, publico } = req.body;

  try {
    // Validar que todos los campos estén presentes
    if (!descripcion || costo === undefined || publico === undefined) {
      return res.status(400).json({ error: "Todos los campos son requeridos." });
    }

    // Eliminar espacios al principio y al final de las cadenas de texto
    descripcion = descripcion.trim();

    // Verificar si algún campo de texto está vacío después de eliminar espacios
    if (descripcion === "") {
      return res.status(400).json({ error: "La descripción no puede estar vacía." });
    }

    // Verificar si los valores numéricos son válidos
    if (isNaN(costo) || isNaN(publico) || costo === "" || publico === "") {
      return res.status(400).json({ error: "Costo y público deben ser números válidos." });
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

export const modificarArticulo = async (req, res) => {
  const { id, descripcion, costo, publico } = req.body;

  try {
    // Validar que el ID esté presente
    if (!id) {
      return res.status(400).json({ error: "El ID del artículo es requerido." });
    }

    // Obtener una conexión a la base de datos
    const connection = await db.getConnection();

    // Verificar si el artículo con el ID dado existe
    const [existingProduct] = await connection.execute(
      "SELECT * FROM Mercaderia WHERE id = ?",
      [id]
    );

    if (existingProduct.length === 0) {
      connection.release();
      return res.status(404).json({ error: "El artículo no existe." });
    }

    // Preparar un array con los campos a actualizar y sus valores
    const updateFields = [];
    const updateValues = [];

    if (descripcion && descripcion.trim() !== "") {
      updateFields.push("descripcion = ?");
      updateValues.push(descripcion.trim());
    }

    if (costo !== undefined && costo !== null && !isNaN(costo) && costo !== "") {
      updateFields.push("costo = ?");
      updateValues.push(costo);
    }

    if (publico !== undefined && publico !== null && !isNaN(publico) && publico !== "") {
      updateFields.push("publico = ?");
      updateValues.push(publico);
    }

    // Verificar si hay campos para actualizar
    if (updateFields.length === 0) {
      connection.release();
      return res.status(400).json({
        error: "No se ha proporcionado ningún dato válido para actualizar.",
      });
    }

    // Realizar la actualización en la base de datos
    await connection.execute(
      `UPDATE Mercaderia SET ${updateFields.join(", ")} WHERE id = ?`,
      [...updateValues, id]
    );

    // Liberar la conexión a la base de datos
    connection.release();

    // Enviar una respuesta exitosa
    res.status(200).json({
      message: "Artículo actualizado correctamente.",
      updatedFields: updateFields.map((field) => field.split(" = ")[0]),
    });
  } catch (error) {
    console.error("Error al actualizar el artículo:", error);
    res.status(500).json({
      error: "Error al actualizar el artículo. Verifica los datos enviados.",
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
    await connection.execute("UPDATE Mercaderia SET borrado = 1 WHERE id = ?", [
      id,
    ]);

    // Obtener todas las filas de Stock con el mismo id_mercaderia y verificar su estado de borrado
    const [stockEntries] = await connection.execute(
      "SELECT id, borrado FROM Stock WHERE id_mercaderia = ?",
      [id]
    );

    for (const stock of stockEntries) {
      if (stock.borrado === 0) {
        // Marcar el artículo en la tabla Stock como eliminado actualizando el campo borrado a 1
        await connection.execute("UPDATE Stock SET borrado = 1 WHERE id = ?", [
          stock.id,
        ]);
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

// Papelera TOOLS
export const restablecerTodosArticulos = async (req, res) => {
  const { OKR } = req.body; // Obtener la confirmación del cuerpo de la solicitud

  // Verificar que la confirmación es "OKR"
  if (OKR !== "OKR") {
    return res
      .status(400)
      .json({ error: "Confirmación incorrecta. Escriba 'OKR' para proceder." });
  }

  try {
    // Obtener una conexión a la base de datos
    const connection = await db.getConnection();

    // Iniciar una transacción
    await connection.beginTransaction();

    // Restablecer la columna borrado en la tabla Mercaderia a 0 para todos los artículos
    await connection.execute("UPDATE Mercaderia SET borrado = 0");

    // Restablecer la columna borrado en la tabla Stock a 0 para todos los registros
    await connection.execute("UPDATE Stock SET borrado = 0");

    // Confirmar la transacción
    await connection.commit();

    // Liberar la conexión a la base de datos
    connection.release();

    // Enviar una respuesta exitosa
    res
      .status(200)
      .json({
        message: "Todos los artículos han sido restablecidos correctamente.",
      });
  } catch (error) {
    console.error("Error al restablecer todos los artículos:", error);

    try {
      // En caso de error, deshacer la transacción
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Error al revertir la transacción:", rollbackError);
    }

    res.status(500).json({
      error:
        "Error al restablecer todos los artículos. Intenta nuevamente más tarde.",
    });
  }
};

export const restablecerEspecificoPapelera = async (req, res) => {
  const { id, OKRE } = req.body; // Obtener el ID y la confirmación desde el cuerpo de la solicitud

  // Verificar que la confirmación es "OKRE"
  if (OKRE !== "OKRE") {
    return res.status(400).json({ error: "Confirmación incorrecta. Escriba 'OKRE' para proceder." });
  }

  try {
    // Obtener una conexión a la base de datos
    const connection = await db.getConnection();

    // Verificar si el artículo existe en la tabla Mercaderia y si su estado de borrado es 1
    const [existingProduct] = await connection.execute(
      "SELECT borrado FROM Mercaderia WHERE id = ?",
      [id]
    );

    if (existingProduct.length === 0) {
      connection.release();
      return res.status(404).json({ error: "El artículo no existe." });
    }

    const { borrado: borradoMercaderia } = existingProduct[0];

    // Verificar si el artículo está marcado como borrado
    if (borradoMercaderia !== 1) {
      connection.release();
      return res.status(409).json({ error: "El artículo no está en la papelera." });
    }

    // Iniciar una transacción
    await connection.beginTransaction();

    // Restablecer el estado de borrado del artículo en la tabla Mercaderia
    await connection.execute(
      "UPDATE Mercaderia SET borrado = 0 WHERE id = ?",
      [id]
    );

    // Restablecer el estado de borrado en todas las filas de la tabla Stock que corresponden al id_mercaderia
    await connection.execute(
      "UPDATE Stock SET borrado = 0 WHERE id_mercaderia = ?",
      [id]
    );

    // Confirmar la transacción
    await connection.commit();

    // Liberar la conexión a la base de datos
    connection.release();

    // Enviar una respuesta exitosa
    res.status(200).json({ message: "El artículo ha sido restablecido correctamente." });
  } catch (error) {
    console.error("Error al restablecer el artículo:", error);

    try {
      // En caso de error, deshacer la transacción
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Error al revertir la transacción:", rollbackError);
    }

    res.status(500).json({
      error: "Error al restablecer el artículo. Intenta nuevamente más tarde.",
    });
  }
};

export const vaciarPapelera = async (req, res) => {
  const { OKV } = req.body; // Obtener la confirmación desde el cuerpo de la solicitud

  // Verificar que la confirmación sea "OKV"
  if (OKV !== "OKV") {
    return res.status(400).json({ error: "Error en la confirmación. Debes escribir 'OKV' para vaciar la papelera." });
  }

  try {
    // Obtener una conexión a la base de datos
    const connection = await db.getConnection();

    // Iniciar una transacción
    await connection.beginTransaction();

    // Eliminar registros de la tabla Stock donde la columna borrado sea 1
    await connection.execute(
      "DELETE FROM Stock WHERE borrado = 1"
    );

    // Eliminar registros de la tabla Mercaderia donde la columna borrado sea 1
    await connection.execute(
      "DELETE FROM Mercaderia WHERE borrado = 1"
    );

    // Confirmar la transacción
    await connection.commit();

    // Liberar la conexión a la base de datos
    connection.release();

    // Enviar una respuesta exitosa
    res.status(200).json({ message: "Papelera vaciada correctamente. Todos los registros eliminados." });
  } catch (error) {
    console.error("Error al vaciar la papelera:", error);

    try {
      // En caso de error, deshacer la transacción
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Error al revertir la transacción:", rollbackError);
    }

    res.status(500).json({
      error: "Error al vaciar la papelera. Intenta nuevamente más tarde.",
    });
  }
};

export const eliminarEspecificoPapelera = async (req, res) => {
  const { id, OKVE } = req.body; // Obtener el ID del artículo y la confirmación desde el cuerpo de la solicitud

  // Verificar que la confirmación sea "OKVE"
  if (OKVE !== "OKVE") {
    return res.status(400).json({ error: "Error en la confirmación. Debes escribir 'OKVE' para eliminar el artículo." });
  }

  try {
    // Obtener una conexión a la base de datos
    const connection = await db.getConnection();

    // Verificar si el artículo existe en la tabla Mercaderia y si su estado de borrado es 1
    const [existingProduct] = await connection.execute(
      "SELECT borrado FROM Mercaderia WHERE id = ?",
      [id]
    );

    if (existingProduct.length === 0) {
      connection.release();
      return res.status(404).json({ error: "El artículo no existe." });
    }

    const { borrado: borradoMercaderia } = existingProduct[0];

    // Verificar si el artículo está marcado como borrado
    if (borradoMercaderia !== 1) {
      connection.release();
      return res.status(409).json({ error: "El artículo no está en la papelera." });
    }

    // Iniciar una transacción
    await connection.beginTransaction();

    // Eliminar el artículo en la tabla Stock donde id_mercaderia coincide y borrado es 1
    await connection.execute(
      "DELETE FROM Stock WHERE id_mercaderia = ? AND borrado = 1",
      [id]
    );

    // Eliminar el artículo en la tabla Mercaderia donde el id coincide y borrado es 1
    await connection.execute(
      "DELETE FROM Mercaderia WHERE id = ? AND borrado = 1",
      [id]
    );

    // Confirmar la transacción
    await connection.commit();

    // Liberar la conexión a la base de datos
    connection.release();

    // Enviar una respuesta exitosa
    res.status(200).json({ message: "Artículo eliminado definitivamente." });
  } catch (error) {
    console.error("Error al eliminar el artículo:", error);

    try {
      // En caso de error, deshacer la transacción
      await connection.rollback();
    } catch (rollbackError) {
      console.error("Error al revertir la transacción:", rollbackError);
    }

    res.status(500).json({
      error: "Error al eliminar el artículo. Intenta nuevamente más tarde.",
    });
  }
};

