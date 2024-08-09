import { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/BtnVolver/BtnVolver'
import Table from '../Components/Table/TablesProductos'
import {
  obtenerMercaderiaAdmin
} from './lib/libMercaderia'
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
    <section className='mercaderia'>
      <BtnVolver donde="/inicio" />
      <BtnPapelera />
      {loading ? (
        <div loader="interno" className="contenedor__loader">
          <span className="loader"></span>
          <span className="text__loader">Cargando</span>
        </div>
      ) : (
        <>
          <article className="table__container">
            <FiltroProductos
              columns={Object.keys(mercaderia[0] || {})}
              onFilterChange={handleFilterChange}
            />
            <div className="table-wrapper">
              <Table data={mercaderia} filters={filters} />
            </div>
          </article>
          {user.rol === 'admin' && (
            <>
              <ToolsMercaderia />
              <Link className="btn__pestanas__siguiente" to="/stock">
                Stock
              </Link>
            </>
          )}
        </>
      )}
    </section>
  )
}

export default Mercaderia
