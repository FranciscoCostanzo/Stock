import { useNavigate, useLocation } from 'react-router-dom'
import { AuthContext } from '../Auth/context/AuthContext'
import { useContext, useState } from 'react'

const Header = () => {
  const { user, setUser } = useContext(AuthContext)
  const [btnUser, setBtnUser] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname
  const routeName = currentPath === '/' ? 'Inicio' : currentPath.replace('/', '').replace('-', ' ')

  const handleCerrarSesion = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        setUser(null)
        localStorage.removeItem('access_token');
        navigate('/') // Redirige a / para cerrar la sesión
        window.location.reload()
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
            <p>Rol:</p>
            <span>{rol}</span>
            {user.sucursal && (
              <>
                <p>Pertenece a la sucursal:</p>
                <span>
                  {user.sucursal.nombre} / {user.sucursal.ciudad} / {user.sucursal.direccion}
                </span>
              </>
            )}
          </article>
        )}
        <span>
          {user.nombre} {user.sucursal && <>- {user.sucursal.ciudad}</>} - {rol}
        </span>
      </section>
      <h1>{capitalizeFirstLetter(routeName)}</h1>
      <section>
        <p className="btn__cerrar__sesion" onClick={handleCerrarSesion}>
          Cerrar Sesion
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
            <path d="M9 12h12l-3 -3" />
            <path d="M18 15l3 -3" />
          </svg>
        </p>
      </section>
    </header>
  )
}

export default Header
