import { Navigate, Outlet } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthContext } from '../Context/AuthContext';

export const AuthRouter = ({ requireAuth = true }) => {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (!requireAuth || user) {
        // No necesita autenticación o ya hay un usuario autenticado
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
          setUser(userData);
        } else {
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
        setLoading(false);
      }
    };

    verifyToken();
  }, [requireAuth, user, setUser]);

  if (loading) {
    return <span className="loader"></span>; // Muestra un indicador de carga mientras se verifica el token
  }

  if (requireAuth && !user) {
    return <Navigate to="/" />;
  }

  if (!requireAuth && user) {
    toast.error('Ya estás autenticado, si quieres usar otra cuenta cierra sesión en esta', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};
