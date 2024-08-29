import { useContext, useEffect, useState } from "react"
import { obtenerPedidosAdmin } from "./lib/libPedidos"
import { AuthContext } from "../Auth/context/AuthContext"
import TablesProductos from "../Components/Table/TablesProductos"
import FiltroProductos from '../Mercaderia/components/Filtros/FiltroProductos'
import BtnVolver from "../Components/Btns/BtnVolver/BtnVolver"

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
              <TablesProductos data={pedidos} filters={filters} />
            </div>
          </article>
          {/* {user.rol === 'admin' && (
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
          )} */}
        </>
      )}
    </section>
    
  )
}

export default VerPedidos