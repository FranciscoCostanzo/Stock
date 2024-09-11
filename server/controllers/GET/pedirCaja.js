import db from "../../config/db.js";

export const pedirTotalCajaSucursal = async (req, res) => {
  const { idSucursal } = req.params;

  // Obtener la fecha actual en formato ISO 8601 (YYYY-MM-DD)
  const fechaActual = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  try {
    // Verificar si ya se ha registrado un cierre de caja hoy para la misma sucursal
    const [cierreCajaResults] = await db.query(
      `
      SELECT COUNT(*) AS cierre_existente
      FROM Caja
      WHERE id_sucursal = ?
      AND DATE(fecha) = ?
      `,
      [idSucursal, fechaActual]
    );

    if (cierreCajaResults[0].cierre_existente > 0) {
      return res.json({
        message: "Ya se cerró caja y rendición el día de hoy",
      });
    }

    // Verificar si hay ventas registradas para el día de hoy
    const [ventasResults] = await db.query(
      `
      SELECT COUNT(*) AS ventas_existentes
      FROM Ventas
      WHERE id_sucursal = ?
      AND DATE(fecha_venta) = ?
      `,
      [idSucursal, fechaActual]
    );

    if (ventasResults[0].ventas_existentes === 0) {
      return res.json({ message: "Aún no hay ventas realizadas" });
    }

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
      SELECT SUM(CAST(Ventas.total AS DECIMAL(10, 2))) AS total_ventas
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

    // Sumar el total de ventas en efectivo
    const [totalEfectivoResults] = await db.query(
      `
      SELECT SUM(CAST(Ventas.total AS DECIMAL(10, 2))) AS total_efectivo_ventas
      FROM Ventas
      WHERE Ventas.id_sucursal = ?
      AND Ventas.metodo_de_pago = 'efectivo'
      AND DATE(Ventas.fecha_venta) = ?
      `,
      [idSucursal, fechaActual]
    );

    // Calcular el total de efectivo en la caja (sumar ventas en efectivo y adelantos con tarjeta)
    const totalCaja =
      parseFloat(efectivoResults[0].total_efectivo || 0) +
      parseFloat(adelantoResults[0].total_adelanto || 0);

    // Responder con los datos obtenidos
    res.json({
      totalCaja: totalCaja.toFixed(2),
      cantidadEfectivo: cantidadEfectivoResults[0].cantidad_efectivo,
      cantidadTarjeta: cantidadTarjetaResults[0].cantidad_tarjeta,
      totalVentas: parseFloat(totalVentasResults[0].total_ventas || 0).toFixed(
        2
      ),
      totalTarjeta: parseFloat(
        totalTarjetaResults[0].total_tarjeta || 0
      ).toFixed(2),
      totalEfectivoVentas: parseFloat(
        totalEfectivoResults[0].total_efectivo_ventas || 0
      ).toFixed(2),
    });
  } catch (error) {
    console.error("Error al obtener los totales de la caja:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los totales de la caja." });
  }
};
