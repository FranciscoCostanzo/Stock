import express from "express";
import { PORT, corsMiddleware } from "./config/server.js";
import poolConnection from './config/db.js';

const app = express();

// Usar CORS middleware
app.use(corsMiddleware);

// Rutas
app.get('/', (req, res) => {
  res.send('Hola Mundo');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor inicializado en el puerto ${PORT} http://localhost:${PORT}/`);
});
