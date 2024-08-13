import { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import Table from '../Components/Table/TablesProductos'
import { obtenerStockPorSucursal, obtenerStockAdmin } from './lib/libMercaderia'
import { AuthContext } from '../Auth/context/AuthContext'
import FiltroProductos from './components/Filtros/FiltroProductos'

const Stock = () => {
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
            data = await obtenerStockAdmin()
          } else if (user.sucursal) {
            data = await obtenerStockPorSucursal(user.sucursal.id)
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
          {user.rol === 'admin' ? <BtnVolver donde="/mercaderia" /> : <BtnVolver donde="/inicio" />}
          <article className="table__container">
            <FiltroProductos
              columns={Object.keys(mercaderia[0] || {})}
              onFilterChange={handleFilterChange}
            />
            <div className="table-wrapper">
              <Table data={mercaderia} filters={filters} />
            </div>
          </article>
        </>
      )}
    </section>
  )
}

export default Stock
