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
