const express = require("express");
const { cors } = require("./config/server.js");
const routes = require("./routes/endpoints.js");

const app = express();
const PORT = process.env.PORT || 4000;

// Aplicar middleware de CORS
app.use(cors);

// Analizar el cuerpo de las solicitudes JSON
app.use(express.json());

// Configurar la Política de Seguridad de Contenido (CSP)
app.use((req, res, next) => {
    res.setHeader(`Content-Security-Policy', "default-src 'self' http://localhost:${PORT}/`);
    next();
});

// Definir las rutas de la aplicación
app.use("/", routes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en el puerto http://localhost:${PORT}/`);
});
