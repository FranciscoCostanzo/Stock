import { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import Table from '../Components/Table/TablesProductos'
import { obtenerInversionAdmin } from './lib/libMercaderia'
import { AuthContext } from '../Auth/context/AuthContext'
import FiltroProductos from './components/Filtros/FiltroProductos'

const Inversion = () => {
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
            data = await obtenerInversionAdmin()
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

  if (mercaderia.length > 0) {
    const totalInversion = mercaderia.reduce((acc, item) => acc + item.Inversion, 0);
    console.log("Inversión total:", mercaderia.Inversion);
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
          <BtnVolver donde="/mercaderia" />
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

export default Inversion
