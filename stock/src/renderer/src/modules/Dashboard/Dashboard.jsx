import { Link } from 'react-router-dom'

const Dashbord = () => {
  const btns = [
    { btn: 'Mercaderia', to: '/stock' },
    { btn: 'Ventas' },
    { btn: 'Fallas' },
    { btn: 'Pedidos' },
    { btn: 'Configuracion' },
    { btn: 'Codigo de barra' },
    { btn: 'Caja' }
  ]

  return (
    <section className="dashboard">
      {btns.map((btn, index) => (
          <Link key={index} to={btn.to} className="btn">
            {btn.btn}
          </Link>
      ))}
    </section>
  )
}

export default Dashbord
