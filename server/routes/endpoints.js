// endpoints.js
import { Router } from "express";
import {
    checkToken,
    login,
    logout,
    register,
} from "../controllers/POST/authUsers.js";
import { pedirSucursales } from "../controllers/GET/pedirSucursales.js";
import {
    pedirInversionAdmin,
    pedirMercaderiaAdmin,
    pedirPapeleraAdmin,
    pedirStockAdmin,
    pedirStockPorSucursal,
} from "../controllers/GET/pedirProductos.js";
import { authenticateToken } from "../config/server.js";
import {
    agregarArticulo,
    eliminarArticulo,
    eliminarEspecificoPapelera,
    modificarArticulo,
    restablecerEspecificoPapelera,
    restablecerTodosArticulos,
    vaciarPapelera,
} from "../controllers/POST/mercaderiaTools.js";

const router = Router();

// Rutas para autenticación
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.post("/check-token", checkToken);

// Ruta para obtener sucursales
router.get("/sucursales", pedirSucursales);

// Rutas GET de los productos
// Ruta para obtener Stock por Sucursal
router.get("/stock/:idSucursal", authenticateToken, pedirStockPorSucursal);
// Ruta para obtener Stock para el admin
router.get("/stock", authenticateToken, pedirStockAdmin);
// Ruta para obtener Mercaderia para el admin
router.get("/mercaderia", authenticateToken, pedirMercaderiaAdmin);
// Ruta para obtener Papelera para el admin
router.get("/papelera", authenticateToken, pedirPapeleraAdmin);
// Ruta para obtener la inversion y el retorno del stock para el admin
router.get("/inversion", authenticateToken, pedirInversionAdmin);

// Rutas POST de los productos
// Ruta para la tabla Mercaderia
router.post("/agregar-articulo", authenticateToken, agregarArticulo);
router.post("/eliminar-articulo", authenticateToken, eliminarArticulo);
router.post("/modificar-articulo", authenticateToken, modificarArticulo);

// Rutas para la pepelera
router.post(
    "/restablecer-todos-articulos-papelera",
    authenticateToken,
    restablecerTodosArticulos
);
router.post("/restablecer-especifico-papelera", authenticateToken, restablecerEspecificoPapelera);
router.post("/vaciar-papelera", authenticateToken, vaciarPapelera);
router.post("/eliminar-especifico-papelera", authenticateToken, eliminarEspecificoPapelera);

export default router;
