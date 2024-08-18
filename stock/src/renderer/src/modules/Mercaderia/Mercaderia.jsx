import { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import TablesProductos from '../Components/Table/TablesProductos'
import { obtenerMercaderiaAdmin } from './lib/libMercaderia'
import { AuthContext } from '../Auth/context/AuthContext'
import FiltroProductos from './components/Filtros/FiltroProductos'
import ToolsMercaderia from './components/Tools/ToolsMercaderia'
import { Link } from 'react-router-dom'
import BtnPapelera from './components/BtnPapelera/BtnPapelera'

const Mercaderia = () => {
  const { user } = useContext(AuthContext)
  const [mercaderia, setMercaderia] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMercaderia = async () => {
      try {
        if (user) {
          let data
          if (user.rol === 'admin') {
            data = await obtenerMercaderiaAdmin()
          }
          setMercaderia(data)
        }
      } catch (error) {
        console.log('Error al cargar mercadería:', error.message)
      } finally {
        setLoading(false)
      }
    }

    loadMercaderia()
  }, [user])

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  return (
    <section className="mercaderia">
      {loading ? (
        <div loader="interno" className="contenedor__loader">
          <span className="loader"></span>
          <span className="text__loader">Cargando</span>
        </div>
      ) : (
        <>
          <BtnVolver donde="/inicio" />
          <BtnPapelera />
          <article className="table__container">
            <FiltroProductos
              columns={Object.keys(mercaderia[0] || {})}
              onFilterChange={handleFilterChange}
            />
            <div className="table-wrapper">
              <TablesProductos data={mercaderia} filters={filters} />
            </div>
          </article>
          {user.rol === 'admin' && (
            <>
              <ToolsMercaderia />
              <article className="contenedor__btns__sigpestanas">
              <Link className="btn__pestanas__siguiente" to="/fallas">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M11 14l4 -4l-4 -4" />
                  <path d="M16 14l4 -4l-4 -4" />
                  <path d="M15 10h-7a4 4 0 1 0 0 8h1" />
                </svg>
                Fallas
              </Link>

              <Link className="btn__pestanas__siguiente" to="/stock">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M11 14l4 -4l-4 -4" />
                  <path d="M16 14l4 -4l-4 -4" />
                  <path d="M15 10h-7a4 4 0 1 0 0 8h1" />
                </svg>
                Stock
              </Link>
              <Link className="btn__pestanas__siguiente" to="/inversion">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M11 14l4 -4l-4 -4" />
                  <path d="M16 14l4 -4l-4 -4" />
                  <path d="M15 10h-7a4 4 0 1 0 0 8h1" />
                </svg>
                Inversion
              </Link>
              </article>
            </>
          )}
        </>
      )}
    </section>
  )
}

export default Mercaderia
