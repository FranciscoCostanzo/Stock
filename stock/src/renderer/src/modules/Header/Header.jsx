import { useNavigate } from "react-router-dom"
import { useAuth } from "../Auth/context/AuthContext"

const Header = () => {
  const dataUser = useAuth().user
  const navigate = useNavigate()

  const handleCerrarSesion = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include',
      });
  
      if (response.ok) {
        navigate('/'); // Redirige a / para cerrar la sesión
      } else {
        // Manejar el caso en que la respuesta no es exitosa
        const errorMessage = await response.json();
        console.error('Error al cerrar sesión:', errorMessage.message);
      }
    } catch (error) {
      console.error('Error al enviar la solicitud de cierre de sesión:', error);
    }
  };
  

  if (!dataUser) {
    return null;
  }
  return (
    <header>
      <button onClick={handleCerrarSesion}>cerrar</button>
      <span>{dataUser.nombre}</span>
      <span>{dataUser.rol}</span>
      <span>{dataUser.nombre}</span>
      <span>{dataUser.nombre}</span>
    </header>
  )
}

export default Header