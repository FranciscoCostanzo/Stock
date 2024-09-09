import db from "../../config/db.js";
import crypto from "crypto";

export const cargarCierreCaja = async (req, res) => {
    try {
        const cajaEntries = req.body;

        // Validar que llega un array con al menos un objeto
        if (!Array.isArray(cajaEntries) || cajaEntries.length === 0) {
            return res.status(350).json({ message: "No se recibieron entradas de caja" });
        }

        const idSucursal = cajaEntries[0].id_sucursal;
        const fechaActual = new Date().toLocaleDateString('en-CA').replace(/-/g, '/'); // YYYY/MM/DD

        // Sumar el total de las ventas en efectivo del día
        const [efectivoResults] = await db.query(
            `
        SELECT SUM(CAST(Ventas.total AS DECIMAL(10, 2))) AS total_efectivo
        FROM Ventas
        WHERE Ventas.id_sucursal = ? 
        AND Ventas.metodo_de_pago = 'efectivo'
        AND DATE(Ventas.fecha_venta) = ?
        `,
            [idSucursal, fechaActual]
        );

        // Sumar los adelantos de ventas con tarjeta del día
        const [adelantoResults] = await db.query(
            `
        SELECT SUM(CAST(Ventas.adelanto AS DECIMAL(10, 2))) AS total_adelanto
        FROM Ventas
        WHERE Ventas.id_sucursal = ?
        AND Ventas.metodo_de_pago = 'tarjeta'
        AND DATE(Ventas.fecha_venta) = ?
        `,
            [idSucursal, fechaActual]
        );
        const totalEfectivoVentas = parseFloat(efectivoResults[0].total_efectivo || 0) + parseFloat(adelantoResults[0].total_adelanto || 0);

        // Sumar todos los montos del array recibido en el req.body
        const totalMontos = cajaEntries.reduce((total, entry) => total + parseFloat(entry.monto), 0);

        // Calcular el fondo disponible (ventas - totalMontos)
        const fondoDisponible = parseFloat(totalEfectivoVentas - totalMontos).toFixed(2);

        // Verificar el fondo que llega en el req.body (motivo id 2)
        const entryMotivo2 = cajaEntries.find((entry) => entry.id_motivo === 2);
        if (!entryMotivo2) {
            return res.status(360).json({ message: "No se encontró un motivo con id 2 en las entradas." });
        }

        // Truncar el fondo recibido a dos decimales
        const fondoRecibido = parseFloat(entryMotivo2.fondo).toFixed(2);


        // Comparar el fondo disponible con el fondo recibido
        if (fondoDisponible !== fondoRecibido) {
            return res.status(370).json({ message: `El fondo disponible (${fondoDisponible}) no coincide con el fondo recibido (${fondoRecibido}).` });
        }

        // Verificar que no haya sobrante si el fondo es mayor a 0
        if (fondoDisponible > 0 && cajaEntries.some(entry => entry.sobrante > 0)) {
            return res.status(380).json({ message: "No puedes tener sobrante si aún hay efectivo disponible en el fondo." });
        }

        // Validar que solo las entradas con id_motivo 2 puedan tener sobrante o fondo
        for (const entry of cajaEntries) {
            if (entry.id_motivo !== 2 && (entry.sobrante !== 0 || entry.fondo !== 0)) {
                return res.status(390).json({ message: `Solo las entradas con motivo id 2 pueden tener sobrante o fondo distinto de 0.` });
            }
        }

        // Generar un ID único (UUID) para el cierre de caja
        const idCierreCaja = crypto.randomUUID();

        // Generar la fecha actual en formato ISO 8601
        const fechaCierreCaja = new Date().toLocaleDateString("en-CA").replace(/-/g, "/"); // YYYY/MM/DD

        // Recorrer cada entrada de caja y realizar la inserción
        for (const entry of cajaEntries) {
            const { monto, sobrante, fondo, id_motivo, id_usuario, id_sucursal } = entry;

            // Truncar los valores de monto, sobrante y fondo a 2 decimales
            const montoTruncado = Math.trunc(monto * 100) / 100;
            const sobranteTruncado = Math.trunc(sobrante * 100) / 100;
            const fondoTruncado = Math.trunc(fondo * 100) / 100;

            // Insertar cada entrada en la tabla Caja
            await db.query(
                `INSERT INTO Caja (
                    id, fecha, monto, sobrante, fondo, id_motivo, id_usuario, id_sucursal
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    idCierreCaja,         // UUID generado
                    fechaCierreCaja,      // Fecha en formato ISO 8601
                    montoTruncado,        // Monto truncado a 2 decimales
                    sobranteTruncado,     // Sobrante truncado a 2 decimales
                    fondoTruncado,        // Fondo truncado a 2 decimales
                    id_motivo,            // Motivo de cierre
                    id_usuario,           // Usuario que realizó el cierre
                    id_sucursal           // Sucursal de donde proviene la caja
                ]
            );
        }

        // Responder con éxito si todas las inserciones fueron correctas
        res.status(200).json({ message: "Cierre de caja registrado correctamente" });
    } catch (error) {
        console.error("Error al registrar el cierre de caja:", error);
        res.status(500).json({ message: "Error al registrar el cierre de caja", error });
    }
};
