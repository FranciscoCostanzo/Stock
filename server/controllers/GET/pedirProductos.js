import db from "../../config/db.js";

export const pedirStockPorSucursal = async (req, res) => {
  const { idSucursal } = req.params; // Obtenemos el id de la sucursal desde los parámetros de la URL

  try {
    const [result] = await db.query(
      `
      SELECT 
        s.id_mercaderia AS Articulo, 
        m.descripcion AS Descripcion , 
        m.publico AS Publico,
        s.cantidad AS Stock
      FROM 
        Stock s
      JOIN 
        Mercaderia m ON s.id_mercaderia = m.id
      WHERE 
        s.id_sucursal = ? AND m.borrado = 0
      `,
      [idSucursal]
    );

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron productos para esta sucursal." });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error obteniendo el stock por sucursal:", error);
    res.status(500).json({ error: "Error obteniendo el stock por sucursal." });
  }
};

export const pedirStockAdmin = async (req, res) => {
  try {
    // Consulta para obtener el stock
    const [results] = await db.query(`
      SELECT 
        Mercaderia.id AS Articulo,
        Mercaderia.descripcion AS Descripcion,
        Mercaderia.costo AS Costo,
        Mercaderia.publico AS Publico,
        Stock.cantidad AS Stock,
        Sucursal.ciudad AS Sucursal
      FROM 
        Stock
      INNER JOIN 
        Mercaderia ON Stock.id_mercaderia = Mercaderia.id
      INNER JOIN 
        Sucursal ON Stock.id_sucursal = Sucursal.id
      WHERE 
        Stock.borrado = 0
    `);

    res.json(results);
  } catch (error) {
    console.error("Error al obtener el stock:", error);
    res.status(500).json({ message: "Error al obtener el stock." });
  }
};

export const pedirMercaderiaAdmin = async (req, res) => {
  try {
    // Consulta para obtener la mercadería
    const [results] = await db.query(`
      SELECT
        id AS Articulo,
        descripcion AS Descripcion,
        costo AS Costo,
        publico AS Publico
      FROM 
        Mercaderia
      WHERE 
        borrado = 0
    `);

    res.json(results);
  } catch (error) {
    console.error("Error al obtener la mercadería:", error);
    res.status(500).json({ message: "Error al obtener la mercadería." });
  }
};

export const pedirPapeleraAdmin = async (req, res) => {
  try {
    // Consulta para obtener la mercadería
    const [results] = await db.query(`
      SELECT
        id AS Articulo,
        descripcion AS Descripcion,
        costo AS Costo,
        publico AS Publico
      FROM 
        Mercaderia
      WHERE 
        borrado = 1
    `);

    res.json(results);
  } catch (error) {
    console.error("Error al obtener la mercadería:", error);
    res.status(500).json({ message: "Error al obtener la mercadería." });
  }
};

