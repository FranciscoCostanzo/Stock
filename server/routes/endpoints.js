import { Router } from "express";
import {
    checkToken,
    login,
    logout,
    register,
} from "../controllers/POST/authUsers.js";
import {
    pedirMotivosCaja,
    pedirSucursales,
    pedirSucursalesAdmin,
    pedirTarjetas,
    pedirTarjetasAdmin,
    pedirUsuariosAdmin,
} from "../controllers/GET/pedirMateriales.js";
import {
    pedirFallasAdmin,
    pedirFallasEmpleado,
    pedirInversionAdmin,
    pedirMercaderiaAdmin,
    pedirPapeleraAdmin,
    pedirStockAdmin,
    pedirStockPorSucursal,
} from "../controllers/GET/pedirProductos.js";
import {
    agregarArticulo,
    eliminarArticulo,
    eliminarEspecificoPapelera,
    enviarFalla,
    modificarArticulo,
    restablecerEspecificoPapelera,
    restablecerFalla,
    restablecerTodosArticulos,
    vaciarPapelera,
} from "../controllers/POST/mercaderiaTools.js";
import {
    cargarVenta,
    pedirArticuloEmpleado,
} from "../controllers/POST/ventasTools.js";
import { pedirVentasAdmin, pedirVentasPorSucursal } from "../controllers/GET/pedirVentas.js";
import {
    EnviarPedidoAdmin,
    pedirArticuloPedidos,
    pedirPedidosAdmin,
    pedirPedidosEmpleado,
    pedirPedidosEmpleadoPendientes,
    recibirPedido,
} from "../controllers/POST/pedidosTools.js";
import { agregarTarjeta, editarTarjeta, eliminarTarjeta } from "../controllers/POST/materialesTools.js";
import { pedirTotalCajaSucursal } from "../controllers/GET/pedirCaja.js";

const router = Router();

// Rutas para autenticación
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.post("/check-token", checkToken);

// Rutas para obtener materiales
// Ruta para obtener sucursales
router.get("/sucursales", pedirSucursales);
// Ruta para obtener tarjetas
router.get("/tarjetas", pedirTarjetas);

// Rutas GET de los productos
// Ruta para obtener Stock por Sucursal
router.get("/stock/:idSucursal", pedirStockPorSucursal);
// Ruta para obtener Stock para el admin
router.get("/stock", pedirStockAdmin);
// Ruta para obtener Mercaderia para el admin
router.get("/mercaderia", pedirMercaderiaAdmin);
// Ruta para obtener Papelera para el admin
router.get("/papelera", pedirPapeleraAdmin);
// Ruta para obtener la inversion y el retorno del stock para el admin
router.get("/inversion", pedirInversionAdmin);
// Ruta para obtener la Fallas registradas del stock para el admin
router.get("/fallas", pedirFallasAdmin);
router.get("/fallas/:idSucursal", pedirFallasEmpleado);

router.get("/ventas-admin", pedirVentasAdmin);
router.get("/ventas-sucursal/:idSucursal", pedirVentasPorSucursal);

// Rutas POST de los productos
// Ruta para la tabla Mercaderia
router.post("/agregar-articulo", agregarArticulo);
router.post("/eliminar-articulo", eliminarArticulo);
router.post("/modificar-articulo", modificarArticulo);

// Rutas para la pepelera
router.post("/restablecer-todos-articulos-papelera", restablecerTodosArticulos);
router.post("/restablecer-especifico-papelera", restablecerEspecificoPapelera);
router.post("/vaciar-papelera", vaciarPapelera);
router.post("/eliminar-especifico-papelera", eliminarEspecificoPapelera);

router.post("/enviar-falla", enviarFalla);
router.post("/restablecer-falla", restablecerFalla);

// Rutas para las ventas
router.post("/articulo-empleado", pedirArticuloEmpleado);
router.post("/venta", cargarVenta);

router.get("/tarjetas-admin", pedirTarjetasAdmin);
router.get("/usuarios-admin", pedirUsuariosAdmin);
router.get("/sucursales-admin", pedirSucursalesAdmin);

router.post("/articulo-pedidos", pedirArticuloPedidos);
router.post("/recibir-pedidos", recibirPedido);
router.post("/pedidos", EnviarPedidoAdmin);

router.get("/ver-pedidos-admin", pedirPedidosAdmin);
router.get("/ver-pedidos-empleado/:id_sucursal", pedirPedidosEmpleado);
router.get(
    "/ver-pedidos-empleado-pendientes/:id_sucursal",
    pedirPedidosEmpleadoPendientes
);

router.post("/eliminar-tarjeta", eliminarTarjeta)
router.post("/editar-tarjeta", editarTarjeta)
router.post("/agregar-tarjeta", agregarTarjeta)


router.get("/caja/:idSucursal", pedirTotalCajaSucursal)
router.get("/motivos-caja", pedirMotivosCaja)

export default router;
