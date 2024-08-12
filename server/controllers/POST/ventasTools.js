import db from "../../config/db.js";

export const pedirArticuloEmpleado = async (req, res) => {
    const { id_mercaderia, id_sucursal } = req.body;
  
    if (!id_mercaderia || !id_sucursal) {
      return res.status(400).json({ error: 'Faltan datos en la solicitud.' });
    }
  
    try {
      // Consulta la tabla Stock
      const [stock] = await db.query(
        "SELECT * FROM Stock WHERE id_mercaderia = ? AND id_sucursal = ? AND borrado = 0 AND cantidad > 1",
        [id_mercaderia, id_sucursal]
      );
  
      if (stock.length === 0) {
        return res.status(404).json({ error: 'No se encontraron artículos disponibles o están borrados.' });
      }
  
      // Consulta la tabla Mercaderia
      const [mercaderia] = await db.query(
        `SELECT
        id AS Artículo,
        descripcion AS Descripcion,
        publico AS Precio
        FROM Mercaderia WHERE id = ?`,
        [id_mercaderia]
      );
  
      if (mercaderia.length === 0) {
        return res.status(404).json({ error: 'Artículo no encontrado en la tabla Mercaderia.' });
      }
  
      // Envía los datos encontrados
      res.status(200).json(mercaderia[0]);
  
    } catch (error) {
      console.error('Error obteniendo el artículo:', error);
      res.status(500).json({ error: 'Error obteniendo el artículo.' });
    }
  };
  