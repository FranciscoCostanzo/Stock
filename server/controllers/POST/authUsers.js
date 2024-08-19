import db from "../../config/db.js";
import bcrypt from "bcrypt";
import { loginSchema, registerSchema } from "../../config/validationAuth.js";
import { z } from "zod";
import jwt from "jsonwebtoken";

// Función de registro
export const register = async (req, res) => {
  const { nombre, password, rol, sucursal } = req.body;
  try {
    // Validar los datos recibidos contra el esquema de registro
    registerSchema.parse({ nombre, password, rol, sucursal });

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
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const [result] = await connection.execute(
      "INSERT INTO Usuarios (nombre, password, rol) VALUES (?, ?, ?)",
      [nombre, hashedPassword, rol]
    );
    const userId = result.insertId;

    // Si el rol es 'empleado' y se ha proporcionado una sucursal
    if (rol === "empleado" && sucursal) {
      // Insertar la relación entre el usuario y la sucursal
      await connection.execute(
        "INSERT INTO Usuario_Sucursal (id_usuario, id_sucursal) VALUES (?, ?)",
        [userId, sucursal]
      );
    }

    connection.release();

    res.status(201).json({
      message: "Usuario creado correctamente.",
      userId: userId,
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

    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      connection.release();
      return res
        .status(401)
        .json({ error: "Nombre de usuario o contraseña incorrectos." });
    }

    const { rol } = user[0];
    let sucursalData = null;

    if (rol !== "admin") {
      const [userSucursal] = await connection.execute(
        "SELECT id_sucursal FROM Usuario_Sucursal WHERE id_usuario = ?",
        [user[0].id]
      );

      if (userSucursal.length === 0) {
        connection.release();
        return res
          .status(404)
          .json({ error: "No se encontró sucursal para el usuario." });
      }

      const sucursalId = userSucursal[0].id_sucursal;

      const [sucursal] = await connection.execute(
        "SELECT * FROM Sucursal WHERE id = ?",
        [sucursalId]
      );

      if (sucursal.length === 0) {
        connection.release();
        return res
          .status(404)
          .json({ error: "No se encontró la sucursal especificada." });
      }

      sucursalData = sucursal[0];
    }

    connection.release();

    // Definir el tiempo de expiración en milisegundos
    const expiresIn = 8 * 60 * 60 * 1000; // 8 horas en milisegundos

    const token = jwt.sign(
      {
        id: user[0].id,
        nombre: user[0].nombre,
        rol: user[0].rol,
        sucursal: sucursalData,
      },
      process.env.SECRET_JWT_KEY,
      {
        expiresIn: "8h",
      }
    );

    // Configurar la cookie con maxAge para que coincida con expiresIn
    res
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: expiresIn, // Tiempo de vida en milisegundos
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
    console.error("Error verificando el token:", error);
    // Envía el código de estado 403 si el token no es válido
    return res.status(403).json({ message: "Token no válido" });
  }
};

export const logout = async (req, res) => {
  try {
    // Borra la cookie "access_token"
    res.clearCookie("access_token");

    // Envía una respuesta exitosa al cliente
    return res.status(200).json({ message: "Logout exitoso" });
  } catch (error) {
    console.error("Error haciendo un logout:", error);
    // Envía el código de estado 500 en caso de error
    return res
      .status(500)
      .json({ message: "No se ha podido salir de la sesión" });
  }
};
