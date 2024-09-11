import db from "../../config/db.js";
import crypto from "crypto";

export const cargarCierreCaja = async (req, res) => {
  try {
    const cajaEntries = req.body;

    if (!Array.isArray(cajaEntries) || cajaEntries.length === 0) {
      return res
        .status(350)
        .json({ message: "No se recibieron entradas de caja" });
    }

    const idSucursal = cajaEntries[0].id_sucursal;
    const fechaActual = new Date()
      .toLocaleDateString("en-CA")
      .replace(/-/g, "/"); // YYYY/MM/DD

    // Sumar el total de las ventas en efectivo del día

    const [totalEfectivoResults] = await db.query(
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

    // Contar la cantidad de ventas en efectivo del día, agrupadas por id_venta
    const [cantidadEfectivoResults] = await db.query(
      `
      SELECT COUNT(DISTINCT Ventas.id_venta) AS cantidad_efectivo
      FROM Ventas
      WHERE Ventas.id_sucursal = ?
      AND Ventas.metodo_de_pago = 'efectivo'
      AND DATE(Ventas.fecha_venta) = ?
      `,
      [idSucursal, fechaActual]
    );

    // Contar la cantidad de ventas con tarjeta del día, agrupadas por id_venta
    const [cantidadTarjetaResults] = await db.query(
      `
      SELECT COUNT(DISTINCT Ventas.id_venta) AS cantidad_tarjeta
      FROM Ventas
      WHERE Ventas.id_sucursal = ?
      AND Ventas.metodo_de_pago = 'tarjeta'
      AND DATE(Ventas.fecha_venta) = ?
      `,
      [idSucursal, fechaActual]
    );

    // Sumar el total de todas las ventas del día, sin discriminar método de pago
    const [totalVentasResults] = await db.query(
      `
      SELECT SUM(CAST(Ventas.total AS DECIMAL(10, 2))) AS total
      FROM Ventas
      WHERE Ventas.id_sucursal = ?
      AND DATE(Ventas.fecha_venta) = ?
      `,
      [idSucursal, fechaActual]
    );

    // Sumar el total de ventas con tarjeta
    const [totalTarjetaResults] = await db.query(
      `
      SELECT SUM(CAST(Ventas.total AS DECIMAL(10, 2))) AS total_tarjeta
      FROM Ventas
      WHERE Ventas.id_sucursal = ?
      AND Ventas.metodo_de_pago = 'tarjeta'
      AND DATE(Ventas.fecha_venta) = ?
      `,
      [idSucursal, fechaActual]
    );

    // Calcular el total de efectivo en ventas
    const totalEfectivoVentas =
      parseFloat(totalEfectivoResults[0].total_efectivo || 0) +
      parseFloat(adelantoResults[0].total_adelanto || 0);

    // Sumar todos los montos del array recibido en el req.body
    const totalMontos = cajaEntries.reduce(
      (total, entry) => total + parseFloat(entry.monto),
      0
    );

    // Calcular el fondo disponible (ventas - totalMontos)
    const fondoDisponible = parseFloat(
      totalEfectivoVentas - totalMontos
    ).toFixed(2);

    // Verificar el fondo que llega en el req.body (motivo id 2)
    const entryMotivo2 = cajaEntries.find((entry) => entry.id_motivo === 2);
    if (!entryMotivo2) {
      return res.status(360).json({
        message: "No se encontró un motivo con id 2 en las entradas.",
      });
    }

    const fondoRecibido = parseFloat(entryMotivo2.fondo).toFixed(2);

    // Comparar el fondo disponible con el fondo recibido
    if (fondoDisponible !== fondoRecibido) {
      return res.status(370).json({
        message: `El fondo disponible (${fondoDisponible}) no coincide con el fondo recibido (${fondoRecibido}).`,
      });
    }

    // Verificar que si hay fondo, el sobrante sea 0
    if (fondoRecibido > 0 && parseFloat(entryMotivo2.sobrante) !== 0) {
      return res
        .status(380)
        .json({ message: "El sobrante debe ser 0 si hay fondo disponible." });
    }

    // Si no hay fondo, permitir cualquier valor de sobrante
    if (fondoRecibido === 0 && parseFloat(entryMotivo2.sobrante) < 0) {
      return res.status(390).json({
        message: "El sobrante no puede ser negativo si no hay fondo.",
      });
    }

    // Generar un ID único para el cierre de caja
    const idCierreCaja = crypto.randomUUID();
    const fechaCierreCaja = new Date()
      .toLocaleDateString("en-CA")
      .replace(/-/g, "/");

    for (const entry of cajaEntries) {
      const { monto, sobrante, fondo, id_motivo, id_usuario, id_sucursal } =
        entry;

      const montoTruncado = Math.trunc(monto * 100) / 100;
      const sobranteTruncado = Math.trunc(sobrante * 100) / 100;
      const fondoTruncado = Math.trunc(fondo * 100) / 100;

      // Verificar si el id_motivo es 2 (rendición)
      if (id_motivo === 2) {
        await db.query(
          `INSERT INTO Caja (
              id, fecha, monto, sobrante, fondo, id_motivo, id_usuario, id_sucursal, cantidad_tarjeta, cantidad_efectivo, total_tarjeta, total_efectivo, total
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            idCierreCaja, // UUID generado
            fechaCierreCaja, // Fecha en formato ISO 8601
            montoTruncado, // Monto truncado a 2 decimales
            sobranteTruncado, // Sobrante truncado a 2 decimales
            fondoTruncado, // Fondo truncado a 2 decimales
            id_motivo, // Motivo de cierre
            id_usuario, // Usuario que realizó el cierre
            id_sucursal, // Sucursal de la caja
            cantidadTarjetaResults[0].cantidad_tarjeta, // Cantidad de ventas con tarjeta
            cantidadEfectivoResults[0].cantidad_efectivo, // Cantidad de ventas en efectivo
            totalTarjetaResults[0].total_tarjeta, // Total de ventas con tarjeta
            totalEfectivoResults[0].total_efectivo, // Total de ventas en efectivo
            totalVentasResults[0].total, // Total de efectivo en caja
          ]
        );
      } else {
        await db.query(
          `INSERT INTO Caja (
              id, fecha, monto, sobrante, fondo, id_motivo, id_usuario, id_sucursal
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            idCierreCaja, // UUID generado
            fechaCierreCaja, // Fecha en formato ISO 8601
            montoTruncado, // Monto truncado a 2 decimales
            sobranteTruncado, // Sobrante truncado a 2 decimales
            fondoTruncado, // Fondo truncado a 2 decimales
            id_motivo, // Motivo de cierre
            id_usuario, // Usuario que realizó el cierre
            id_sucursal, // Sucursal de la caja
          ]
        );
      }
    }

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
