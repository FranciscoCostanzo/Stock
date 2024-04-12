import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { userDataSession } from "../utils/utilsAuth";

export const AuthRouter = ({ requireAuth = true }) => {
  // Convertir userData de cadena JSON a un objeto de JavaScript
  const userData = userDataSession();
  // Acceder al token dentro de userData si userData está definido
  const token = userData ? userData.token : null;
  if (requireAuth && !token) {
    toast.error("Debes iniciar sesión para acceder a más contenido", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    return <Navigate to="/" />;
  }
  if (!requireAuth && token) {
    toast.error("Ya estas autenticado, si quieres usar otra cuenta cierra sesion en esta", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    return <Navigate to="/dashbord" />;
  }
  return <Outlet />;
};
