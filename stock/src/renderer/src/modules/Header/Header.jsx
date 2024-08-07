import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Auth/context/AuthContext'
import { useContext } from 'react'

const Header = () => {
  const { user, setUser } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleCerrarSesion = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setUser(null)
        navigate('/') // Redirige a / para cerrar la sesión
      } else {
        // Manejar el caso en que la respuesta no es exitosa
        const errorMessage = await response.json()
        console.error('Error al cerrar sesión:', errorMessage.message)
      }
    } catch (error) {
      console.error('Error al enviar la solicitud de cierre de sesión:', error)
    }
  }

  if (!user) {
    return null
  }
  return (
    <header>
      <section>
        <div className="btnUser">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
          </svg>
        </div>
        
        <span>
          {user.nombre}
        </span>
      </section>
      <section>
        <span>{user.rol}</span>
        <p className="btnCerrarSesion" onClick={handleCerrarSesion}>
          Cerrar Sesion
        </p>
      </section>
    </header>
  )
}

export default Header
