import { useContext, useEffect, useState } from 'react'
import { obtenerPedidosAdmin } from './lib/libPedidos'
import { AuthContext } from '../Auth/context/AuthContext'
import TablesProductos from '../Components/Table/TablesProductos'
import FiltroProductos from '../Mercaderia/components/Filtros/FiltroProductos'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'

const VerPedidos = () => {
  const { user } = useContext(AuthContext)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    const loadMercaderia = async () => {
      try {
        if (user) {
          let data
          if (user.rol === 'admin') {
            data = await obtenerPedidosAdmin()
          }
          setPedidos(data)
        }
      } catch (error) {
        console.log('Error al cargar mercadería:', error.message)
      } finally {
        setLoading(false)
      }
    }

    loadMercaderia()
  }, [user])

  console.log(pedidos)

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
          <BtnVolver donde="/pedidos" />
          <article className="table__container">
            <FiltroProductos
              columns={Object.keys(pedidos[0] || {})}
              onFilterChange={handleFilterChange}
            />
            <div className="table-wrapper">
              <TablesProductos pedidos={true} data={pedidos} filters={filters} />
            </div>
          </article>
        </>
      )}
    </section>
  )
}

export default VerPedidos
