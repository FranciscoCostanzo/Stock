import cors from "cors";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";

// Configurar dotenv
dotenv.config();

// Configurar CORS
const corsOptions = {
  origin: "http://localhost:5173", // Cambia esto al origen de tu aplicación cliente
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true // Permitir cookies
};

export const corsMiddleware = cors(corsOptions);

export const authenticateToken = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};