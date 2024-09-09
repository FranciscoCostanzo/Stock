import db from "../../config/db.js";
import crypto from "crypto";

export const cargarCierreCaja = async (req, res) => {
    try {
        const cajaEntries = req.body;

        // Validar que llega un array con al menos un objeto
        if (!Array.isArray(cajaEntries) || cajaEntries.length === 0) {
            return res
                .status(400)
                .json({ message: "No se recibieron entradas de caja" });
        }

        // Validar que todos los objetos tengan los campos requeridos y sean números
        for (const entry of cajaEntries) {
            if (
                typeof entry.monto !== "number" ||
                typeof entry.sobrante !== "number" ||
                typeof entry.id_motivo !== "number" ||
                typeof entry.id_usuario !== "number" ||
                typeof entry.id_sucursal !== "number"
            ) {
                return res
                    .status(400)
                    .json({ message: "Todos los datos deben ser números válidos" });
            }
        }

        // Generar un ID único (UUID) para el cierre de caja
        const idCierreCaja = crypto.randomUUID();

        // Generar la fecha actual en formato ISO 8601
        const fechaCierreCaja = new Date()
            .toLocaleDateString("en-CA")
            .replace(/-/g, "/"); // YYYY/MM/DD

        // Recorrer cada entrada de caja y realizar la inserción
        for (const entry of cajaEntries) {
            const { monto, sobrante, id_motivo, id_usuario, id_sucursal } = entry;

            // Truncar los valores de monto y sobrante a 2 decimales
            const montoTruncado = Math.trunc(monto * 100) / 100;
            const sobranteTruncado = Math.trunc(sobrante * 100) / 100;

            // Insertar cada entrada en la tabla Caja
            await db.query(
                `INSERT INTO Caja (
          id, fecha, monto, sobrante, id_motivo, id_usuario, id_sucursal
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    idCierreCaja, // UUID generado
                    fechaCierreCaja, // Fecha en formato ISO 8601
                    montoTruncado, // Monto truncado a 2 decimales
                    sobranteTruncado, // Sobrante truncado a 2 decimales
                    id_motivo, // Motivo de cierre
                    id_usuario, // Usuario que realizó el cierre
                    id_sucursal, // Sucursal de donde proviene la caja
                ]
            );
        }

        // Responder con éxito si todas las inserciones fueron correctas
        res
            .status(200)
            .json({ message: "Cierre de caja registrado correctamente" });
    } catch (error) {
        console.error("Error al registrar el cierre de caja:", error);
        res
            .status(500)
            .json({ message: "Error al registrar el cierre de caja", error });
    }
};
