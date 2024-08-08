import express from "express";
import { corsMiddleware } from "./config/server.js";
import routes from "./routes/endpoints.js";
import cookieParser from "cookie-parser";

const app = express();

// Usar CORS middleware
app.use(corsMiddleware);

// Middleware para parsear JSON
app.use(express.json());

app.use(cookieParser());

// Usar rutas importadas
app.use("/", routes);

// Iniciar el servidor
app.listen(process.env.PORT, () => {
  console.log(
    `Servidor inicializado en el puerto ${process.env.PORT} http://localhost:${process.env.PORT}/`
  );
});
