import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Auth/context/AuthContext'

const Dashbord = () => {
  const { user } = useContext(AuthContext)

  const btns = [
    { btn: 'Mercaderia', to: '/stock', toAdmin: '/mercaderia', roles: ['admin', 'empleado'] },
    { btn: 'Ventas', to: '/ventas', toAdmin: '/ventas', roles: ['admin', 'empleado'] },
    { btn: 'Pedidos', roles: ['admin', 'empleado'] },
    { btn: 'Caja', roles: ['admin', 'empleado'] },
    { btn: 'Codigo de barra', roles: ['admin'] },
    { btn: 'Configuracion', toAdmin: '/configuracion', roles: ['admin'] },
    { btn: 'register', toAdmin: '/register', roles: ['admin'] }
  ]

  // Filtra los botones según el rol del usuario
  const filteredBtns = btns.filter((btn) => btn.roles.includes(user.rol))

  return (
    <section className="dashboard">
      {filteredBtns.map((btn, index) => (
        <Link key={index} to={user.rol === 'admin' ? btn.toAdmin : btn.to || '#'} className="btn">
          {btn.btn}
        </Link>
      ))}
    </section>
  )
}

export default Dashbord
