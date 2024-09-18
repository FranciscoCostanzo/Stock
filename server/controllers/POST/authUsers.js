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
        secure: false, // Asegúrate de que sea 'false' para aplicaciones Electron locales
        sameSite: "strict",
        maxAge: expiresIn, // Tiempo de vida en milisegundos
      })
      .status(200)
      .json({ message: "Te autenticaste correctamente", token: token });
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

export const updateUser = async (req, res) => {
  const { id, nombre, password, rol, id_sucursal } = req.body;

  try {
    // Validar los datos recibidos usando Zod (excepto el ID, ya que no lo vamos a modificar)
    registerSchema.parse({ nombre, password, rol });

    // Verificar si el usuario existe en la base de datos
    const connection = await db.getConnection();
    const [user] = await connection.execute("SELECT * FROM Usuarios WHERE id = ?", [id]);

    if (user.length === 0) {
      connection.release();
      return res.status(404).json({
        code: 404,
        error: "Usuario no encontrado.",
        message: "El usuario con el ID proporcionado no existe."
      });
    }

    // Si el rol es admin, id_sucursal debe ser null o no estar presente
    if (rol === "admin" && id_sucursal !== null && id_sucursal !== undefined) {
      connection.release();
      return res.status(400).json({
        code: 4001,
        error: "Rol de administrador no debe tener sucursal.",
        message: "Si el rol es 'admin', no se debe asignar una sucursal."
      });
    }

    // Si se envía una nueva contraseña, compararla con la actual
    if (password) {
      const isMatch = await bcrypt.compare(password, user[0].password);
      if (isMatch) {
        connection.release();
        return res.status(400).json({
          code: 4002,
          error: "La nueva contraseña no puede ser igual a la actual.",
          message: "Intenta usar una contraseña diferente."
        });
      } else {
        // Si no coinciden, hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(password, 10);
        await connection.execute("UPDATE Usuarios SET password = ? WHERE id = ?", [hashedPassword, id]);
      }
    }

    // Actualizar el nombre sin restricciones
    if (nombre) {
      await connection.execute("UPDATE Usuarios SET nombre = ? WHERE id = ?", [nombre, id]);
    }

    // Verificar si el rol es válido ('admin' o 'empleado')
    if (rol) {
      await connection.execute("UPDATE Usuarios SET rol = ? WHERE id = ?", [rol, id]);
    }

    // Si se proporciona una nueva sucursal y el usuario es 'empleado'
    if (rol === "empleado" && id_sucursal) {
      // Verificar si el usuario ya está registrado en esa sucursal
      const [sucursalExistente] = await connection.execute(
        "SELECT * FROM Usuario_Sucursal WHERE id_usuario = ? AND id_sucursal = ?",
        [id, id_sucursal]
      );

      if (sucursalExistente.length > 0) {
        connection.release();
        return res.status(400).json({
          code: 4003,
          error: "El usuario ya está asignado a esta sucursal.",
          message: "No se puede asignar la misma sucursal al usuario."
        });
      }

      // Actualizar la sucursal si ya tiene un registro en otra sucursal
      await connection.execute(
        "UPDATE Usuario_Sucursal SET id_sucursal = ? WHERE id_usuario = ?",
        [id_sucursal, id]
      );
    }

    connection.release();

    res.status(200).json({
      code: 200,
      message: "Usuario actualizado correctamente.",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const formattedErrors = error.errors.map((err) => err.message);
      return res.status(400).json({
        code: 4004,
        errors: formattedErrors,
        message: "Error en la validación de los datos proporcionados."
      });
    }
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({
      code: 500,
      error: "Error al actualizar usuario.",
      message: "Verifica los datos enviados o contacta al soporte."
    });
  }
};

// Si funcionaria en Electron las cookies usario este controller para autenticar el token

// export const checkToken = async (req, res) => {
//   const token = req.cookies.access_token;
//   if (!token) {
//     // Envía el código de estado 403 con un mensaje de error
//     return res.status(403).json({ message: "No estás autenticado" });
//   }

//   try {
//     const userData = jwt.verify(token, process.env.SECRET_JWT_KEY);
//     // Si el token es válido, envía la información del usuario
//     return res.json(userData);
//   } catch (error) {
//     console.error("Error verificando el token:", error);
//     // Envía el código de estado 403 si el token no es válido
//     return res.status(403).json({ message: "Token no válido" });
//   }
// };

// Función para decodificar el JWT desde base64
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decodificando el JWT', e);
    return null;
  }
}

// Controlador actualizado para verificar el token
export const checkToken = async (req, res) => {
  const { token } = req.body; // Obtener el token del cuerpo de la solicitud
  if (!token) {
    // Envía el código de estado 403 con un mensaje de error si el token no está presente
    return res.status(403).json({ message: "No se ha proporcionado un token" });
  }

  try {
    const userData = parseJwt(token); // Decodificar el token usando la función parseJwt

    if (!userData) {
      // Si no se pudo decodificar el token, envía el código de estado 403
      return res.status(403).json({ message: "Token no válido" });
    }

    // Si el token es válido, envía la información del usuario
    return res.json(userData);
  } catch (error) {
    console.error("Error verificando el token:", error);
    // Envía el código de estado 403 si ocurre un error
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
