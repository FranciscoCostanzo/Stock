import cors from "cors";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

// Configurar dotenv
dotenv.config();

// Configurar CORS
const corsOptions = {
  origin: ['http://localhost:5173', '*'], // Permitir cualquier origen (solo para desarrollo)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "Set-Cookie"],
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);

// Middleware para verificar el token
export const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Enumeración de errores
export const ErrorCodes = {
  VALIDATION_ERROR: 1001,
  STOCK_NOT_FOUND: 1002,
  STOCK_INSUFFICIENT: 1003,
  DB_CONNECTION_ERROR: 1004,
  TRANSACTION_ERROR: 1005,
  UNKNOWN_ERROR: 1006
};

// Función para generar una respuesta de error enriquecida
export function createErrorResponse(code, message, details = null) {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  };
}

export const obtenerFechaHoraArgentina = () => {
  const currentDateTime = new Date();

  // Obtener la fecha en formato YYYY-MM-DD
  const fecha = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(currentDateTime).split('/').reverse().join('-');

  // Obtener la hora en formato HH:MM:SS
  const hora = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(currentDateTime);

  return { fecha, hora };
};

export const pasarADecimal = (num) => {
  parseFloat(num)
}