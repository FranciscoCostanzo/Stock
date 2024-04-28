const poolConnection = require('../../config/db');

module.exports.productos = async (req, res) => {
    const consult = 'SELECT p.*, i.imagen FROM productos p LEFT JOIN imagenes_producto i ON p.id_producto = i.producto_id';

    try {
        const connection = await poolConnection.getConnection();
        const [rows] = await connection.query(consult);
        connection.release();

        // Objeto para almacenar los productos con sus imágenes
        const productosConImagenes = {};

        // Iterar sobre los resultados para agrupar las imágenes por producto
        rows.forEach(row => {
            const { id_producto, nombre_producto, descripcion, precio, stock, ...imagen } = row;
            if (!productosConImagenes[id_producto]) {
                // Si es la primera imagen para este producto, inicializar el objeto de imágenes
                productosConImagenes[id_producto] = {
                    id_producto,
                    nombre_producto,
                    descripcion,
                    precio,
                    stock,
                    imagenes: [imagen.imagen]
                };
            } else {
                // Si ya existe el producto en el objeto, agregar la imagen al arreglo de imágenes
                productosConImagenes[id_producto].imagenes.push(imagen.imagen);
            }
        });

        // Convertir el objeto en un array de productos
        const productosConImagenesArray = Object.values(productosConImagenes);

        res.status(200).send(productosConImagenesArray);
    } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
};
