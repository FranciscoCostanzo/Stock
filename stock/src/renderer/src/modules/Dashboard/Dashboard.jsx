import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../Auth/context/AuthContext'

const Dashbord = () => {
  const { user } = useContext(AuthContext)
  const btns = [
    { btn: 'Mercaderia', to: '/stock', toAdmin: '/mercaderia' },
    { btn: 'Ventas' },
    { btn: 'Fallas' },
    { btn: 'Pedidos' },
    { btn: 'Configuracion' },
    { btn: 'Codigo de barra' },
    { btn: 'Caja' }
  ]

  return (
    <section className="dashboard">
      {user.rol === 'admin' ? (
        <>
          {btns.map((btn, index) => (
            <Link key={index} to={btn.toAdmin} className="btn">
              {btn.btn}
            </Link>
          ))}
        </>
      ) : (
        <>
          {btns.map((btn, index) => (
            <Link key={index} to={btn.to} className="btn">
              {btn.btn}
            </Link>
          ))}
        </>
      )}
    </section>
  )
}

export default Dashbord
