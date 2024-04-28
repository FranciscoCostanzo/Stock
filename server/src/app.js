import express from "express"

const app = express()
const PORT = process.env.PORT || 3000;

// Definir una ruta básica
app.get('/', (req, res) => {
    res.send('¡Hola, mundo!');
});

// Iniciar el servidor en el puerto 3000
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});