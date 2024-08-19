// endpoints.js
import { Router } from "express";
import {
    checkToken,
    login,
    logout,
    register,
} from "../controllers/POST/authUsers.js";
import {
    pedirSucursales,
    pedirTarjetas,
} from "../controllers/GET/pedirMateriales.js";
import {
    pedirFallasAdmin,
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
    enviarFalla,
    modificarArticulo,
    restablecerEspecificoPapelera,
    restablecerTodosArticulos,
    vaciarPapelera,
} from "../controllers/POST/mercaderiaTools.js";
import {
    cargarVenta,
    pedirArticuloEmpleado,
} from "../controllers/POST/ventasTools.js";

const router = Router();

// Rutas para autenticación
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.post("/check-token", checkToken);

// Rutas para obtener materiales
// Ruta para obtener sucursales
router.get("/sucursales", authenticateToken, pedirSucursales);
// Ruta para obtener tarjetas
router.get("/tarjetas", authenticateToken, pedirTarjetas);

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
// Ruta para obtener la Fallas registradas del stock para el admin
router.get("/fallas", authenticateToken, pedirFallasAdmin);

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
router.post(
    "/restablecer-especifico-papelera",
    authenticateToken,
    restablecerEspecificoPapelera
);
router.post("/vaciar-papelera", authenticateToken, vaciarPapelera);
router.post(
    "/eliminar-especifico-papelera",
    authenticateToken,
    eliminarEspecificoPapelera
);

router.post("/enviar-falla", authenticateToken, enviarFalla);

//rutas para las ventas
router.post("/articulo-empleado", authenticateToken, pedirArticuloEmpleado);
router.post("/venta", authenticateToken, cargarVenta);

export default router;
