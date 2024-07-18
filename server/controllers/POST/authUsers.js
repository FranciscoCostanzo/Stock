import { z } from "zod";
import db from "../../config/db.js";

// Definir el esquema de validación con Zod
const registerSchema = z.object({
  nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." })
    .max(50, { message: "El nombre no debe exceder los 50 caracteres." }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
  rol: z.enum(["admin", "empleado"], {
    message: "El rol debe ser 'admin' o 'empleado'.",
  }),
});

const loginSchema = z.object({
  nombre: z
    .string()
    .min(3, { message: "El nombre debe tener al menos 3 caracteres." })
    .max(50, { message: "El nombre no debe exceder los 50 caracteres." }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres." }),
});

// Función de registro
export const register = async (req, res) => {
  const { nombre, password, rol } = req.body;

  try {
    // Validar los datos recibidos contra el esquema
    registerSchema.parse({ nombre, password, rol });

    // Verificar si el usuario ya existe
    const connection = await db.getConnection();
    const [existingUser] = await connection.execute(
      "SELECT * FROM Usuarios WHERE nombre = ?",
      [nombre]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(409).json({ error: "Nombre de usuario ya existe." });
    }

    // Si los datos son válidos, proceder con la creación del usuario en la base de datos
    const [result] = await connection.execute(
      "INSERT INTO Usuarios (nombre, password, rol) VALUES (?, ?, ?)",
      [nombre, password, rol]
    );
    connection.release();

    res.status(201).json({
      message: "Usuario creado correctamente.",
      userId: result.insertId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Manejo de errores de validación de Zod
      const formattedErrors = error.errors.map((err) => err.message);
      return res.status(400).json({ errors: formattedErrors });
    }
    console.error("Error al registrar usuario:", error);
    res.status(500).json({
      error: "Error al registrar usuario. Verifica los datos enviados.",
    });
  }
};

// Función de login
export const login = async (req, res) => {
  const { nombre, password } = req.body;

  try {
    // Validar los datos recibidos contra el esquema
    loginSchema.parse({ nombre, password });

    // Verificar si el usuario existe y la contraseña es correcta
    const connection = await db.getConnection();
    const [user] = await connection.execute(
      "SELECT * FROM Usuarios WHERE nombre = ? AND password = ?",
      [nombre, password]
    );
    connection.release();

    if (user.length === 0) {
      return res
        .status(401)
        .json({ error: "Nombre de usuario o contraseña incorrectos." });
    }

    // Si el usuario es válido, retornar una respuesta de éxito
    res.status(200).json({
      message: "Autenticación exitosa",
      userId: user[0].id,
      rol: user[0].rol,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Manejo de errores de validación de Zod
      const formattedErrors = error.errors.map((err) => err.message);
      return res.status(400).json({ errors: formattedErrors });
    }
    console.error("Error al autenticar usuario:", error);
    res.status(500).json({
      error: "Error al autenticar usuario. Verifica los datos enviados.",
    });
  }
};
