import { z } from 'zod';
import db from '../../config/db.js';

// Definir el esquema de validación con Zod
const registerSchema = z.object({
  nombre: z.string().min(3).max(50),
  password: z.string().min(6),
  rol: z.enum(['admin', 'empleado']),
});

const loginSchema = z.object({
  nombre: z.string().min(3).max(50),
  password: z.string().min(6),
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
      'SELECT * FROM Usuarios WHERE nombre = ?',
      [nombre]
    );

    if (existingUser.length > 0) {
      connection.release();
      return res.status(409).json({ error: 'Nombre de usuario ya existe.' });
    }

    // Si los datos son válidos, proceder con la creación del usuario en la base de datos
    const [result] = await connection.execute(
      'INSERT INTO Usuarios (nombre, password, rol) VALUES (?, ?, ?)',
      [nombre, password, rol]
    );
    connection.release();

    res.status(201).json({ message: 'Usuario creado correctamente.', userId: result.insertId });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(400).json({ error: 'Error al registrar usuario. Verifica los datos enviados.' });
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
      'SELECT * FROM Usuarios WHERE nombre = ? AND password = ?',
      [nombre, password]
    );
    connection.release();

    if (user.length === 0) {
      return res.status(401).json({ error: 'Nombre de usuario o contraseña incorrectos.' });
    }

    // Si el usuario es válido, retornar una respuesta de éxito
    res.status(200).json({ message: 'Autenticación exitosa', userId: user[0].id, rol: user[0].rol });
  } catch (error) {
    console.error('Error al autenticar usuario:', error);
    res.status(400).json({ error: 'Error al autenticar usuario. Verifica los datos enviados.' });
  }
};
