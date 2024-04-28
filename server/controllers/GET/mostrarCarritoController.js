const poolConnection = require("../../config/db");

module.exports.obtenerCarritoCliente = async (req, res) => {
    const { cliente_id } = req.params;

    const selectQuery = `
    SELECT carrito.*, productos.*
    FROM carrito
    JOIN productos ON carrito.producto_id = productos.id_producto
    WHERE carrito.cliente_id = ?    
    `;
    const values = [cliente_id];

    try {
        const connection = await poolConnection.getConnection();
        const [rows] = await connection.query(selectQuery, values);
        
        // Mapear sobre los productos en el carrito para obtener las imágenes asociadas a cada uno
        const productosConImagenesPromises = rows.map(async (producto) => {
            const { id_producto } = producto;
            const selectImagenesQuery = 'SELECT imagen FROM imagenes_producto WHERE producto_id = ?';
            const [imagenesRows] = await connection.query(selectImagenesQuery, [id_producto]);
            const imagenes = imagenesRows.map(row => row.imagen);
            return { ...producto, imagenes };
        });

        // Esperar a que todas las promesas de obtención de imágenes se completen
        const productosConImagenes = await Promise.all(productosConImagenesPromises);

        connection.release();

        res.status(200).send(productosConImagenes);
    } catch (error) {
        console.error("Error al obtener carrito del cliente:", error);
        res.status(500).send({ error: "Error interno del servidor" });
    }
};

