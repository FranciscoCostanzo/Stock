import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../context/AuthContext';

export const AuthRouter = ({ requireAuth = true }) => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      // Si no se requiere autenticación o ya hay un usuario autenticado, no hace falta verificar el token
      if (user) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/check-token', {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          const userData = await response.json();
          console.log(userData);
          setUser(userData); // Actualiza el estado del usuario
          navigate('/dashboard'); // Redirige a /dashboard si el token es válido
        } else {
          // No hacer nada, ya que no está autenticado y no se requiere autenticación
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
      } finally {
        setLoading(false); // Indica que la verificación está completa
      }
    };

    verifyToken();
  }, [requireAuth, user, setUser, navigate]);

  if (loading) {
    return <span className="loader"></span>; // Muestra un indicador de carga mientras se verifica el token
  }

  if (requireAuth && !user) {
    // Si se requiere autenticación y no hay usuario, redirige al login
    return <Navigate to="/" />;
  }

  // Si no se requiere autenticación y no hay usuario, permite el acceso
  return <Outlet />;
};
