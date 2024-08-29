import db from "../../config/db.js";


export const pedirArticuloPedidos = async (req, res) => {
    const { id_mercaderia } = req.body;
  
    if (!id_mercaderia) {
      return res.status(400).json({ 
        error: "FaltanDatos", 
        message: "Faltan datos en la solicitud." 
      });
    }
  
    try {
      // Consulta primero la tabla Mercaderia para verificar si el artículo existe
      const [mercaderia] = await db.query(
        `SELECT
          id AS Artículo,
          descripcion AS Descripcion,
          publico AS Precio
        FROM Mercaderia WHERE id = ?`,
        [id_mercaderia]
      );
  
      if (mercaderia.length === 0) {
        return res.status(404).json({
          error: "NoArticulo", // Error específico para manejar en el front
          message: "Artículo no encontrado en la tabla Mercaderia.",
        });
      }

      // Envía los datos del artículo si todo está bien
      res.status(200).json(mercaderia[0]);
    } catch (error) {
      console.error("Error obteniendo el artículo:", error);
      res.status(500).json({
        error: "ServerError", // Error genérico para manejar en el front
        message: "Error obteniendo el artículo.",
      });
    }
  };