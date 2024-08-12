import { Link } from 'react-router-dom'
import BtnVolver from '../Components/BtnVolver/BtnVolver'
import FormVentas from './components/FormVentas'
import TablesProductos from '../Components/Table/TablesProductos'
const Ventas = () => {
  const fieldsVentasEmpleado = [
    {
      label: 'Otra cosa',
      name: 'id',
      type: 'number'
    }
  ]

  return (
    <section className="ventas">
      <BtnVolver donde="/inicio" />
      <article className="contenedor__form__ventas">
        <FormVentas fields={fieldsVentasEmpleado} />
      </article>
      <article className="contenedor__btns__sigpestanas">
        <Link className="btn__pestanas__siguiente" to="/ventas">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M11 14l4 -4l-4 -4" />
            <path d="M16 14l4 -4l-4 -4" />
            <path d="M15 10h-7a4 4 0 1 0 0 8h1" />
          </svg>
          Stock
        </Link>
        <Link className="btn__pestanas__siguiente" to="/ventas">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M11 14l4 -4l-4 -4" />
            <path d="M16 14l4 -4l-4 -4" />
            <path d="M15 10h-7a4 4 0 1 0 0 8h1" />
          </svg>
          Inversion
        </Link>
      </article>
    </section>
  )
}

export default Ventas
