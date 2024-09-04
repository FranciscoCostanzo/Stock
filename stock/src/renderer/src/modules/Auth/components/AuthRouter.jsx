import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';

export const AuthRouter = ({ requireAuth = true }) => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation().pathname;

  useEffect(() => {
    const verifyToken = async () => {
      // Si ya hay un usuario autenticado, no hace falta verificar el token
      if (user) {
        setLoading(false);
        return;
      }

      // Solo se usa cuando Electron no maneja bien las cookies
      const token = localStorage.getItem('access_token');
      if (!token) {
        // Si no hay token en localStorage, redirige al login
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('https://servidor.asessaludsrl.com/check-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }), // Envía el token en el cuerpo de la solicitud
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData); // Actualiza el estado del usuario
          navigate(location || '/inicio'); // Redirige a la página actual o a inicio
        } else {
          // Muestra un mensaje de error si el token no es válido
          toast.error('Debes iniciar sesión para acceder a más contenido', {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: 'light',
          });
        }
      } catch (error) {
        console.error('Error verificando token:', error);
        toast.error('Error al verificar el token', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: 'light',
        });
      } finally {
        setLoading(false); // Indica que la verificación está completa
      }
    };

    verifyToken();
  }, [requireAuth, user, setUser, navigate, location]);

  if (loading) {
    return (
      // Muestra un indicador de carga mientras se verifica el token
      <div className="contenedor__loader">
        <span className="loader"></span>
        <span className="text__loader">Cargando</span>
      </div>
    );
  }

  // Si se requiere autenticación y no hay usuario, redirige al login
  if (requireAuth && !user) {
    return <Navigate to="/" />;
  }

  // Si no se requiere autenticación y ya hay usuario, redirige al inicio
  if (!requireAuth && user) {
    return <Navigate to="/inicio" />;
  }

  // Si el usuario está autenticado o no se requiere autenticación, permite el acceso
  return <Outlet />;
};
