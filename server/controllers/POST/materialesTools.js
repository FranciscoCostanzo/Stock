import db from "../../config/db.js";
import { z } from "zod";
import bcrypt from "bcrypt";
import { editarUsuarioSchema } from "../../config/validationAuth.js";


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

export const eliminarUsuario = async (req, res) => {
    const { id, OKU } = req.body; // Obtener id y confirmación del cuerpo de la solicitud

    // Verificar que la confirmación es "OKU"
    if (OKU !== "OKU") {
        return res
            .status(400)
            .json({ error: "Confirmación incorrecta. Escriba 'OKU' para proceder." });
    }

    try {
        // Verificar que se proporciona un id válido
        if (typeof id !== 'number' || isNaN(id) || !Number.isInteger(id)) {
            return res.status(400).json({ error: "ID inválido. Debe ser un número entero." });
        }

        // Obtener una conexión a la base de datos
        const connection = await db.getConnection();

        // Iniciar una transacción
        await connection.beginTransaction();

        // Verificar si el usuario existe
        const [rows] = await connection.execute(
            "SELECT * FROM Usuarios WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            // Si no existe el usuario, lanzar un error
            return res
                .status(404)
                .json({ error: "Usuario no encontrado. Verifique el id." });
        }

        // Eliminar el usuario
        await connection.execute("DELETE FROM Usuarios WHERE id = ?", [id]);

        // Confirmar la transacción
        await connection.commit();

        // Liberar la conexión a la base de datos
        connection.release();

        // Enviar una respuesta exitosa
        res
            .status(200)
            .json({ message: "Usuario eliminado correctamente." });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);

        try {
            // En caso de error, deshacer la transacción
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Error al revertir la transacción:", rollbackError);
        }

        res.status(500).json({
            error: "Error al eliminar el usuario. Intenta nuevamente más tarde.",
        });
    }
};

export const editarUsuario = async (req, res) => {
    const { id, nombre, password, rol } = req.body;

    // Validar los datos con Zod
    const validationResult = editarUsuarioSchema.safeParse({ id, nombre, password, rol });
    if (!validationResult.success) {
        return res.status(400).json({ error: validationResult.error.errors });
    }

    try {
        // Obtener una conexión a la base de datos
        const connection = await db.getConnection();

        // Iniciar una transacción
        await connection.beginTransaction();

        // Verificar si el usuario existe
        const [rows] = await connection.execute(
            "SELECT * FROM Usuarios WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado. Verifique el ID." });
        }

        // Preparar los cambios a aplicar
        const updates = {};
        if (nombre) {
            // Verificar que el nombre no esté duplicado
            const [nombreRows] = await connection.execute(
                "SELECT * FROM Usuarios WHERE nombre = ? AND id != ?",
                [nombre, id]
            );
            if (nombreRows.length > 0) {
                return res.status(400).json({ error: "Nombre de usuario ya existe." });
            }
            updates.nombre = nombre;
        }
        if (password) {
            // Hash de la nueva contraseña
            updates.password = await bcrypt.hash(password, 10);
        }
        if (rol) {
            // Verificar que el rol es válido
            if (!['admin', 'empleado'].includes(rol)) {
                return res.status(400).json({ error: "Rol inválido. Debe ser 'admin' o 'empleado'." });
            }
            updates.rol = rol;
        }

        // Actualizar el usuario solo con los campos proporcionados
        if (Object.keys(updates).length > 0) {
            const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updates);
            values.push(id);

            await connection.execute(
                `UPDATE Usuarios SET ${setClause} WHERE id = ?`,
                values
            );
        }

        // Confirmar la transacción
        await connection.commit();

        // Liberar la conexión a la base de datos
        connection.release();

        // Enviar una respuesta exitosa
        res.status(200).json({ message: "Usuario actualizado correctamente." });
    } catch (error) {
        console.error("Error al actualizar el usuario:", error);

        try {
            // En caso de error, deshacer la transacción
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Error al revertir la transacción:", rollbackError);
        }

        res.status(500).json({
            error: "Error al actualizar el usuario. Intenta nuevamente más tarde.",
        });
    }
};

export const eliminarSucursal = async (req, res) => {
    const { id, OKS } = req.body; // Obtener id y confirmación del cuerpo de la solicitud

    // Verificar que la confirmación es "OKS"
    if (OKS !== "OKS") {
        return res
            .status(400)
            .json({ error: "Confirmación incorrecta. Escriba 'OKS' para proceder." });
    }

    try {
        // Obtener una conexión a la base de datos
        const connection = await db.getConnection();

        // Iniciar una transacción
        await connection.beginTransaction();

        // Verificar si la sucursal existe
        const [rows] = await connection.execute(
            "SELECT * FROM Sucursal WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            // Si no existe la sucursal, lanzar un error
            return res
                .status(404)
                .json({ error: "Sucursal no encontrada. Verifique el ID." });
        }

        // Eliminar la sucursal
        await connection.execute("DELETE FROM Sucursal WHERE id = ?", [id]);

        // Confirmar la transacción
        await connection.commit();

        // Liberar la conexión a la base de datos
        connection.release();

        // Enviar una respuesta exitosa
        res
            .status(200)
            .json({ message: "Sucursal eliminada correctamente." });
    } catch (error) {
        console.error("Error al eliminar la sucursal:", error);

        try {
            // En caso de error, deshacer la transacción
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Error al revertir la transacción:", rollbackError);
        }

        res.status(500).json({
            error: "Error al eliminar la sucursal. Intenta nuevamente más tarde.",
        });
    }
};

export const editarSucursal = async (req, res) => {
    const { id, nombre, direccion, ciudad } = req.body;

    // Validar que el id sea un número válido
    if (!id || isNaN(parseInt(id, 10))) {
        return res.status(400).json({ error: "ID inválido. Debe ser un número entero." });
    }

    try {
        // Obtener una conexión a la base de datos
        const connection = await db.getConnection();

        // Iniciar una transacción
        await connection.beginTransaction();

        // Verificar si la sucursal existe
        const [rows] = await connection.execute(
            "SELECT * FROM Sucursal WHERE id = ?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: "Sucursal no encontrada. Verifique el ID." });
        }

        // Recoger los datos existentes
        const sucursalExistente = rows[0];

        // Preparar los cambios a aplicar
        const updates = {};
        if (nombre) {
            // Verificar que el nombre no esté duplicado
            const [nombreRows] = await connection.execute(
                "SELECT * FROM Sucursal WHERE nombre = ? AND id != ?",
                [nombre, id]
            );
            if (nombreRows.length > 0) {
                return res.status(400).json({ error: "El nombre de la sucursal ya existe." });
            }
            updates.nombre = nombre;
        }

        if (direccion) {
            updates.direccion = direccion;
        }

        if (ciudad) {
            updates.ciudad = ciudad;
        }

        // Actualizar la sucursal solo con los campos proporcionados
        if (Object.keys(updates).length > 0) {
            const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updates);
            values.push(id);

            await connection.execute(
                `UPDATE Sucursal SET ${setClause} WHERE id = ?`,
                values
            );
        }

        // Confirmar la transacción
        await connection.commit();

        // Liberar la conexión a la base de datos
        connection.release();

        // Enviar una respuesta exitosa
        res.status(200).json({ message: "Sucursal actualizada correctamente." });
    } catch (error) {
        console.error("Error al actualizar la sucursal:", error);

        try {
            // En caso de error, deshacer la transacción
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Error al revertir la transacción:", rollbackError);
        }

        res.status(500).json({
            error: "Error al actualizar la sucursal. Intenta nuevamente más tarde.",
        });
    }
};

export const agregarSucursal = async (req, res) => {
    let { nombre, direccion, ciudad } = req.body;

    // Verificar que se proporcionaron todos los campos
    if (!nombre || typeof nombre !== 'string') {
        return res.status(400).json({ error: "Debe proporcionar un nombre válido para la sucursal." });
    }
    if (!direccion || typeof direccion !== 'string') {
        return res.status(400).json({ error: "Debe proporcionar una dirección válida para la sucursal." });
    }
    if (!ciudad || typeof ciudad !== 'string') {
        return res.status(400).json({ error: "Debe proporcionar una ciudad válida para la sucursal." });
    }

    // Convertir nombre a minúsculas para hacer la verificación
    nombre = nombre.toLowerCase();

    try {
        // Obtener una conexión a la base de datos
        const connection = await db.getConnection();

        // Traer todos los nombres de sucursales de la tabla Sucursal
        const [rows] = await connection.execute("SELECT nombre FROM Sucursal");

        // Convertir todos los nombres de sucursales existentes a minúsculas
        const nombresSucursalesExistentes = rows.map(row => row.nombre.toLowerCase());

        // Verificar si el nombre de la sucursal ya existe
        if (nombresSucursalesExistentes.includes(nombre)) {
            return res.status(400).json({ error: "El nombre de la sucursal ya existe." });
        }

        // Insertar los datos en la tabla Sucursal
        await connection.execute(
            "INSERT INTO Sucursal (nombre, direccion, ciudad) VALUES (?, ?, ?)",
            [req.body.nombre, req.body.direccion, req.body.ciudad]
        );

        // Confirmar la transacción
        await connection.commit();

        // Liberar la conexión a la base de datos
        connection.release();

        // Enviar una respuesta exitosa
        res.status(201).json({ message: "Sucursal agregada correctamente." });
    } catch (error) {
        console.error("Error al agregar la sucursal:", error);

        try {
            // En caso de error, deshacer la transacción
            await connection.rollback();
        } catch (rollbackError) {
            console.error("Error al revertir la transacción:", rollbackError);
        }

        res.status(500).json({
            error: "Error al agregar la sucursal. Intenta nuevamente más tarde.",
        });
    }
};


