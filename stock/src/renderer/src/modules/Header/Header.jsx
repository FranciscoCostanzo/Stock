import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../Auth/context/AuthContext'
import { useContext, useState } from 'react'

const Header = () => {
  const { user, setUser } = useContext(AuthContext)
  const [btnUser, setBtnUser] = useState(false)
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
  function capitalizeFirstLetter(string) {
    if (!string) return '' // Manejar cadenas vacías o nulas
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  const hanbleAbrirBtnUser = () => {
    setBtnUser(true)
    if (btnUser === true) {
      setBtnUser(false)
    }
  }

  if (!user) {
    return null
  }
  const rol = capitalizeFirstLetter(user.rol)
  return (
    <header>
      <section>
        <div onClick={hanbleAbrirBtnUser} className="btnUser">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
            <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
          </svg>
        </div>
        {btnUser && (
          <article className="modal__user">
            <p>Usuario:</p>
            <span>{user.nombre}</span>
            <span>{rol}</span>
            {user.sucursal && (
              <>
            <p>Pertenece a la sucursal:</p>
            <span>{user.sucursal.nombre}</span>
            <span>{user.sucursal.ciudad}</span>
            <span>{user.sucursal.direccion}</span>
              </>
            )}
          </article>
        )}
        <span>
          {user.nombre} {user.sucursal && (<>- {user.sucursal.ciudad}</>)} - {rol}
        </span>
      </section>
      <section>
        <p className="btnCerrarSesion" onClick={handleCerrarSesion}>
          Cerrar Sesion
        </p>
      </section>
    </header>
  )
}

export default Header
