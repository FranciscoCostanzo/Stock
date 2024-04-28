const poolConnection = require('../../config/db');

module.exports.agregarAlCarrito = async (req, res) => {
    const { cantidad, cliente_id, producto_id } = req.body;

    const selectQuery = 'SELECT * FROM carrito WHERE cliente_id = ? AND producto_id = ?';
    const selectValues = [cliente_id, producto_id];

    const insertQuery = 'INSERT INTO carrito (cantidad, cliente_id, producto_id) VALUES (?, ?, ?)';
    const insertValues = [cantidad, cliente_id, producto_id];

    const updateQuery = 'UPDATE carrito SET cantidad = cantidad + ? WHERE cliente_id = ? AND producto_id = ?';
    const updateValues = [cantidad, cliente_id, producto_id];

    try {
        const connection = await poolConnection.getConnection();
        
        // Verificar si ya existe una entrada para el cliente y el producto
        const [existingRows] = await connection.query(selectQuery, selectValues);

        if (existingRows.length > 0) {
            // Si ya existe, actualizar la cantidad
            await connection.query(updateQuery, updateValues);
        } else {
            // Si no existe, insertar una nueva fila
            await connection.query(insertQuery, insertValues);
        }

        connection.release();
        
        res.status(200).send({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
};

module.exports.quitarDelCarrito = async (req, res) => {
    const { carrito_id, eliminarTodo } = req.body;

    try {
        const connection = await poolConnection.getConnection();

        if (eliminarTodo) {
            // Si se debe eliminar por completo la fila independientemente de la cantidad
            const deleteQuery = 'DELETE FROM carrito WHERE id_carrito = ?';
            await connection.query(deleteQuery, [carrito_id]);
        } else {
            // Si no se debe eliminar por completo la fila, se consulta la cantidad actual del producto en el carrito
            const selectQuery = 'SELECT cantidad FROM carrito WHERE id_carrito = ?';
            const [rows] = await connection.query(selectQuery, [carrito_id]);
            const cantidadActual = rows[0].cantidad;

            if (cantidadActual > 1) {
                // Si la cantidad es mayor que 1, restar 1 a la cantidad en lugar de eliminar la fila
                const updateQuery = 'UPDATE carrito SET cantidad = ? WHERE id_carrito = ?';
                const updatedCantidad = cantidadActual - 1;
                await connection.query(updateQuery, [updatedCantidad, carrito_id]);
            } else {
                // Si la cantidad es 1, eliminar la fila del carrito
                const deleteQuery = 'DELETE FROM carrito WHERE id_carrito = ?';
                await connection.query(deleteQuery, [carrito_id]);
            }
        }

        connection.release();

        res.status(200).send({ message: 'Producto eliminado del carrito correctamente' });
    } catch (error) {
        console.error('Error al eliminar producto del carrito:', error);
        res.status(500).send({ error: 'Error interno del servidor' });
    }
};

