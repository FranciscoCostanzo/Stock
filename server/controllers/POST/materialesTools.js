import db from "../../config/db.js";

export const eliminarTarjeta = async (req, res) => {
    const { id, OKT } = req.body; // Obtener id y confirmación del cuerpo de la solicitud

    // Verificar que la confirmación es "OKT"
    if (OKT !== "OKT") {
        return res
            .status(400)
            .json({ error: "Confirmación incorrecta. Escriba 'OKT' para proceder." });
    }

    try {
        // Obtener una conexión a la base de datos
        const connection = await db.getConnection();

        // Iniciar una transacción
        await connection.beginTransaction();

        // Verificar si la tarjeta existe
        const [rows] = await connection.execute(
            "SELECT * FROM Tarjetas WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            // Si no existe la tarjeta, lanzar un error
            return res
                .status(404)
                .json({ error: "Tarjeta no encontrada. Verifique el id." });
        }

        // Eliminar la tarjeta
        await connection.execute("DELETE FROM Tarjetas WHERE id = ?", [id]);

        // Confirmar la transacción
        await connection.commit();

        // Liberar la conexión a la base de datos
        connection.release();

        // Enviar una respuesta exitosa
        res
            .status(200)
            .json({ message: "Tarjeta eliminada correctamente." });
    } catch (error) {
        console.error("Error al eliminar la tarjeta:", error);

        try {
            // En caso de error, deshacer la transacción
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Error al revertir la transacción:", rollbackError);
        }

        res.status(500).json({
            error: "Error al eliminar la tarjeta. Intenta nuevamente más tarde.",
        });
    }
};

export const editarTarjeta = async (req, res) => {
    let { id, aumento } = req.body;

    // Parsear id y aumento a entero
    id = parseInt(id, 10);
    aumento = parseInt(aumento, 10);

    // Verificar que se proporcionaron el id y el aumento correctamente
    if (isNaN(id) || !Number.isInteger(id)) {
        return res.status(400).json({ error: "ID inválido. Debe ser un número entero." });
    }

    if (isNaN(aumento) || !Number.isInteger(aumento)) {
        return res.status(400).json({ error: "Aumento inválido. Debe ser un número entero." });
    }

    try {
        // Obtener una conexión a la base de datos
        const connection = await db.getConnection();

        // Iniciar una transacción
        await connection.beginTransaction();

        // Verificar si la tarjeta existe
        const [rows] = await connection.execute(
            "SELECT * FROM Tarjetas WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            // Si no existe la tarjeta, lanzar un error
            return res.status(404).json({ error: "Tarjeta no encontrada. Verifique el ID." });
        }

        // Actualizar el aumento
        await connection.execute(
            "UPDATE Tarjetas SET aumento = ? WHERE id = ?",
            [aumento, id]
        );

        // Confirmar la transacción
        await connection.commit();

        // Liberar la conexión a la base de datos
        connection.release();

        // Enviar una respuesta exitosa
        res.status(200).json({ message: "Aumento de la tarjeta actualizado correctamente." });
    } catch (error) {
        console.error("Error al actualizar el aumento de la tarjeta:", error);

        try {
            // En caso de error, deshacer la transacción
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Error al revertir la transacción:", rollbackError);
        }

        res.status(500).json({
            error: "Error al actualizar el aumento de la tarjeta. Intenta nuevamente más tarde.",
        });
    }
};

export const agregarTarjeta = async (req, res) => {
    let { tipo_tarjeta, aumento } = req.body;

    // Verificar que se proporcionaron tipo_tarjeta y aumento
    if (!tipo_tarjeta || typeof tipo_tarjeta !== 'string') {
        return res.status(400).json({ error: "Debe proporcionar un tipo de tarjeta válido." });
    }

    // Parsear aumento a entero y verificar
    aumento = parseInt(aumento, 10);
    if (isNaN(aumento) || !Number.isInteger(aumento)) {
        return res.status(400).json({ error: "Aumento inválido. Debe ser un número entero." });
    }

    // Convertir tipo_tarjeta a minúsculas
    tipo_tarjeta = tipo_tarjeta.toLowerCase();

    try {
        // Obtener una conexión a la base de datos
        const connection = await db.getConnection();

        // Traer todos los tipos de tarjeta de la tabla Tarjetas
        const [rows] = await connection.execute("SELECT tipo_tarjeta FROM Tarjetas");

        // Convertir todos los tipos de tarjeta existentes a minúsculas
        const tiposTarjetaExistentes = rows.map(row => row.tipo_tarjeta.toLowerCase());

        // Verificar si el tipo_tarjeta ya existe
        if (tiposTarjetaExistentes.includes(tipo_tarjeta)) {
            return res.status(400).json({ error: "El tipo de tarjeta ya existe." });
        }

        // Insertar los datos en la tabla Tarjetas
        await connection.execute(
            "INSERT INTO Tarjetas (tipo_tarjeta, aumento) VALUES (?, ?)",
            [req.body.tipo_tarjeta, req.body.aumento]
        );

        // Confirmar la transacción
        await connection.commit();

        // Liberar la conexión a la base de datos
        connection.release();

        // Enviar una respuesta exitosa
        res.status(201).json({ message: "Tarjeta agregada correctamente." });
    } catch (error) {
        console.error("Error al agregar la tarjeta:", error);

        try {
            // En caso de error, deshacer la transacción
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Error al revertir la transacción:", rollbackError);
        }

        res.status(500).json({
            error: "Error al agregar la tarjeta. Intenta nuevamente más tarde.",
        });
    }
};

