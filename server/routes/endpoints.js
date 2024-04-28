const express = require("express");
const router = express.Router();
const { auth } = require("../controllers/POST/authController");
const { register } = require("../controllers/POST/registerController");
const { productos } = require("../controllers/GET/productoController");
const { agregarAlCarrito, quitarDelCarrito } = require("../controllers/POST/accionesCarritoController");
const { obtenerCarritoCliente } = require("../controllers/GET/mostrarCarritoController");

router.post("/auth", auth);
router.post("/register", register);
router.post("/agregar_carrito", agregarAlCarrito);
router.post("/quitar_carrito", quitarDelCarrito);

router.get("/productos", productos);
router.get("/obtener_productos_carrito/:cliente_id", obtenerCarritoCliente);

module.exports = router;
