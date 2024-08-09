// endpoints.js
import { Router } from "express";
import { checkToken, login, logout, register } from "../controllers/POST/authUsers.js";
import { pedirSucursales } from "../controllers/GET/pedirSucursales.js";
import { pedirStockAdmin, pedirStockPorSucursal } from "../controllers/GET/pedirStock.js";
import { authenticateToken } from "../config/server.js";
import { agregarArticulo } from "../controllers/POST/mercaderiaTools.js";

const router = Router();

// Rutas para autenticación
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.post("/check-token", checkToken);

// Ruta para obtener sucursales
router.get("/sucursales", pedirSucursales);

// Ruta para obtener Mercaderia por Sucursal
router.get("/mercaderia/:idSucursal", authenticateToken, pedirStockPorSucursal)
router.get("/mercaderia", authenticateToken, pedirStockAdmin)

// Ruta para agregar un articulo
router.post("/agregar-articulo", authenticateToken, agregarArticulo)



export default router;
