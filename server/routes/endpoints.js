// endpoints.js
import { Router } from "express";
import { checkToken, login, register } from "../controllers/POST/authUsers.js";
import { pedirSucursales } from "../controllers/GET/pedirSucursales.js";

const router = Router();

// Rutas para autenticación
router.post("/login", login);
router.post("/register", register);
router.post("/check-token", checkToken);

// Ruta para obtener sucursales
router.get("/sucursales", pedirSucursales);

export default router;
