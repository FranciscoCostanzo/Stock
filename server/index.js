import express from "express";
import { PORT, corsMiddleware } from "./config/server.js";
import routes from "./routes/endpoints.js"

const app = express();

// Usar CORS middleware
app.use(corsMiddleware);

// Usar rutas importadas
app.use('/', routes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor inicializado en el puerto ${PORT} http://localhost:${PORT}/`);
});
