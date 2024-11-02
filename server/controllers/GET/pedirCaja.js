import db from "../../config/db.js";
import { obtenerFechaHoraArgentina } from "../../config/server.js";

export const pedirTotalCajaSucursal = async (req, res) => {
  const { idSucursal } = req.params;

  try {
    // 1. Obtener la última fecha de cierre de caja y el fondo para la sucursal
    const [ultimoCierreResults] = await db.query(
      `
      SELECT 
          id_sucursal,
          CASE 
              WHEN TIME(hora_cierre) < '13:00:00' THEN 'mañana'
              ELSE 'tarde'
          END AS turno,
          MAX(CONCAT(fecha_cierre, ' ', hora_cierre)) AS ultima_fecha_hora_cierre,
          MAX(fondo) AS fondo 
      FROM 
          Caja
      WHERE 
          id_sucursal = ?
      GROUP BY 
          id_sucursal, turno
      `,
      [idSucursal]
    );

    const ultimoCierre = ultimoCierreResults.length ? ultimoCierreResults[0] : null;
    const ultimaFechaHoraCierre = ultimoCierre ? ultimoCierre.ultima_fecha_hora_cierre : null;
    const fondo = ultimoCierre ? ultimoCierre.fondo : 0; // Si no hay cierre, el fondo es 0

    // 2. Obtener las ventas pendientes después del último cierre de caja
    const [ventasPendientesResults] = await db.query(
      `
      SELECT  
          Ventas.id_sucursal,
          Ventas.id_venta,
          Ventas.fecha_venta,
          Ventas.hora_venta,
          Ventas.total,
          Ventas.metodo_de_pago,
          Ventas.adelanto
      FROM 
          Ventas
      LEFT JOIN (
          SELECT 
              id_sucursal,
              CASE 
                  WHEN TIME(hora_cierre) < '13:00:00' THEN 'mañana'
                  ELSE 'tarde'
              END AS turno,
              MAX(CONCAT(fecha_cierre, ' ', hora_cierre)) AS ultima_fecha_hora_cierre
          FROM 
              Caja
          WHERE 
              id_sucursal = ?
          GROUP BY 
              id_sucursal, turno
      ) AS UltimoCierre
      ON 
          Ventas.id_sucursal = UltimoCierre.id_sucursal
      WHERE 
          (CONCAT(Ventas.fecha_venta, ' ', Ventas.hora_venta) > UltimoCierre.ultima_fecha_hora_cierre
          OR UltimoCierre.ultima_fecha_hora_cierre IS NULL)
      `,
      [idSucursal]
    );

    // Inicializar contadores
    let cantidadEfectivo = 0;
    let totalEfectivoVentas = 0;
    let cantidadTarjeta = 0;
    let totalTarjeta = 0;
    let totalAdelanto = 0;

    // Usar un conjunto para contar ventas únicas por método de pago
    const ventasUnicasEfectivo = new Set();
    const ventasUnicasTarjeta = new Set();

    // Recorrer las ventas pendientes para calcular los totales y contar ventas únicas
    ventasPendientesResults.forEach((venta) => {
      if (venta.metodo_de_pago === 'efectivo') {
        // Añadir id_venta al conjunto de ventas únicas para efectivo
        ventasUnicasEfectivo.add(venta.id_venta);
        totalEfectivoVentas += parseFloat(venta.total); // Sumar total independientemente de duplicados
      } else if (venta.metodo_de_pago === 'tarjeta') {
        // Añadir id_venta al conjunto de ventas únicas para tarjeta
        ventasUnicasTarjeta.add(venta.id_venta);
        totalTarjeta += parseFloat(venta.total); // Sumar total independientemente de duplicados
        totalAdelanto += parseFloat(venta.adelanto || 0); // Sumar adelanto solo para ventas con tarjeta
      }
    });

    // Asignar el tamaño de los conjuntos a cantidadEfectivo y cantidadTarjeta
    cantidadEfectivo = ventasUnicasEfectivo.size;
    cantidadTarjeta = ventasUnicasTarjeta.size;

    // Total de ventas (efectivo + tarjeta)
    const totalVentas = totalEfectivoVentas + totalTarjeta;

    // Responder con los datos calculados
    res.json({
      cantidadEfectivo,
      totalEfectivoVentas: totalEfectivoVentas.toFixed(2),
      cantidadTarjeta,
      totalTarjeta: totalTarjeta.toFixed(2),
      totalVentas: totalVentas.toFixed(2),
      totalAdelanto: totalAdelanto.toFixed(2),
      fondo: fondo.toFixed(2), // Incluir el fondo en la respuesta
      ventasPendientes: ventasPendientesResults, // Devuelve todas las ventas pendientes
    });
  } catch (error) {
    console.error("Error al obtener el resumen de caja:", error);
    res.status(500).json({ message: "Error al obtener el resumen de caja." });
  }
};


export const pedirCajaAdmin = async (req, res) => {
  try {
    const [caja] = await db.query("SELECT * FROM Caja");
    res.status(200).json(caja);
  } catch (error) {
    console.error("Error obteniendo las tarjetas:", error);
    res.status(500).json({ error: "Error obteniendo la tabla caja." });
  }
};
