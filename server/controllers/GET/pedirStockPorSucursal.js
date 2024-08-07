import db from "../../config/db.js";

export const pedirStockPorSucursal = async (req, res) => {
  const { idSucursal } = req.params; // Obtenemos el id de la sucursal desde los parámetros de la URL

  try {
    const [result] = await db.query(
      `
      SELECT 
        s.id_mercaderia AS Articulo, 
        m.descripcion AS Descripcion , 
        m.costo AS Costo, 
        m.publico AS Publico,
        s.cantidad AS Stock
      FROM 
        Stock s
      JOIN 
        Mercaderia m ON s.id_mercaderia = m.id
      WHERE 
        s.id_sucursal = ?
      `,
      [idSucursal]
    );

    if (result.length === 0) {
      return res.status(404).json({ message: 'No se encontraron productos para esta sucursal.' });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Error obteniendo el stock por sucursal:', error);
    res.status(500).json({ error: 'Error obteniendo el stock por sucursal.' });
  }
};
