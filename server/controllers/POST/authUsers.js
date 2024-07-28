import db from "../../config/db.js";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../../config/validationAuth.js";
import { z } from "zod";
import jwt from "jsonwebtoken";

// Función de registro
export const register = async (req, res) => {
  const { nombre, password, rol } = req.body;
  try {
    // Validar los datos recibidos contra el esquema de registro
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

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, process.env.SALT_ROUNDS);

    // Crear el usuario en la base de datos
    const [result] = await connection.execute(
      "INSERT INTO Usuarios (nombre, password, rol) VALUES (?, ?, ?)",
      [nombre, hashedPassword, rol]
    );
    connection.release();

    res.status(201).json({
      message: "Usuario creado correctamente.",
      userId: result.insertId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
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
    // Validar los datos recibidos contra el esquema de login
    loginSchema.parse({ nombre, password });

    // Verificar si el usuario existe
    const connection = await db.getConnection();
    const [user] = await connection.execute(
      "SELECT * FROM Usuarios WHERE nombre = ?",
      [nombre]
    );

    if (user.length === 0) {
      connection.release();
      return res
        .status(401)
        .json({ error: "Nombre de usuario o contraseña incorrectos." });
    }

    // Comparar la contraseña proporcionada con la contraseña hasheada
    const passwordMatch = await bcrypt.compare(password, user[0].password);
    connection.release();

    if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: "Nombre de usuario o contraseña incorrectos." });
    }

    const token = jwt.sign(
      {
        id: user[0].id,
        nombre: user[0].nombre,
        rol: user[0].rol,
      },
      process.env.SECRET_JWT_KEY,
      {
        expiresIn: "1h",
      }
    );

    // Establecer la cookie y enviar la respuesta en un solo paso
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1000 * 60 * 60,
      })
      .status(200)
      .json({ message: "Te autenticaste correctamente" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => err.message);
      return res.status(400).json({ errors: formattedErrors });
    }
    console.error("Error al autenticar usuario:", error);
    res.status(500).json({
      error: "Error al autenticar usuario. Verifica los datos enviados.",
    });
  }
};

export const checkToken = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) {
    // Envía el código de estado 403 con un mensaje de error
    return res.status(403).json({ message: "No estás autenticado" });
  }

  try {
    const userData = jwt.verify(token, process.env.SECRET_JWT_KEY);
    // Si el token es válido, envía la información del usuario
    return res.json(userData);
  } catch (error) {
    console.error('Error verificando el token:', error);
    // Envía el código de estado 403 si el token no es válido
    return res.status(403).json({ message: "Token no válido" });
  }
};

