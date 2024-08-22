import db from "../../config/db.js";

export const pedirSucursales = async (req, res) => {
  try {
    const [sucursales] = await db.query("SELECT * FROM Sucursal");
    res.status(200).json(sucursales);
  } catch (error) {
    console.error("Error obteniendo las sucursales:", error);
    res.status(500).json({ error: "Error obteniendo las sucursales." });
  }
};

export const pedirTarjetas = async (req, res) => {
  try {
    const [tarjetas] = await db.query("SELECT * FROM Tarjetas");
    res.status(200).json(tarjetas);
  } catch (error) {
    console.error("Error obteniendo las tarjetas:", error);
    res.status(500).json({ error: "Error obteniendo las tarjetas." });
  }
};

export const pedirTarjetasAdmin = async (req, res) => {
  try {
    // Consulta para obtener la mercadería
    const [results] = await db.query(`
      SELECT
        tipo_tarjeta AS Tarjeta,
        aumento AS Aumento
      FROM 
        Tarjetas
    `);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error al obtener la tarjetas para el admin:", error);
    res
      .status(500)
      .json({ message: "Error al obtener la tarjetas para el admin" });
  }
};

export const pedirUsuariosAdmin = async (req, res) => {
  try {
    // Consulta para obtener la mercadería
    const [results] = await db.query(`
SELECT 
    u.nombre AS Nombre, 
    u.rol AS Rol, 
    COALESCE(CONCAT(s.nombre, ' - ', s.ciudad), 'No tiene') AS Sucursal
FROM 
    Usuarios u
LEFT JOIN 
    Usuario_Sucursal us ON u.id = us.id_usuario
LEFT JOIN 
    Sucursal s ON us.id_sucursal = s.id;

    `);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error al obtener la tarjetas para el admin:", error);
    res
      .status(500)
      .json({ message: "Error al obtener la tarjetas para el admin" });
  }
};

export const pedirSucursalesAdmin = async (req, res) => {
  try {
    const [sucursales] = await db.query("SELECT nombre AS Nombre, direccion AS Direccion, ciudad AS Ciudad FROM `Sucursal`");
    res.status(200).json(sucursales);
  } catch (error) {
    console.error("Error obteniendo las sucursales:", error);
    res.status(500).json({ error: "Error obteniendo las sucursales." });
  }
};