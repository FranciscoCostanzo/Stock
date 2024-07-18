import dotenv from 'dotenv';
import cors from 'cors';

// Configurar dotenv
dotenv.config();

// Configurar CORS
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

export const {
  PORT = 3000
} = process.env

export const corsMiddleware = cors(corsOptions);
