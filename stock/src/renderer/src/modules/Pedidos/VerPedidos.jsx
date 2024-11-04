import { useContext, useEffect, useState } from 'react'
import { obtenerPedidosAdmin, obtenerPedidosEmpleadoRecibidos } from './lib/libPedidos'
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
          } else {
            data = await obtenerPedidosEmpleadoRecibidos(user.sucursal.id)
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

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }
  const [etiquetas, setEtiquetas] = useState([])

  const handleVolverAImprimir = (etiqueta) => {
    console.log(etiqueta)
    setEtiquetas(etiqueta)
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
          <BtnVolver donde={user.rol === 'admin' ? '/pedidos' : '/recibir-pedidos'} />
          <article className="table__container">
            <FiltroProductos
              columns={Object.keys(pedidos[0] || {})}
              onFilterChange={handleFilterChange}
              dateColumns={["Fecha"]}
            />
            <div className="table-wrapper">
              <TablesProductos
                pedidos={user.rol === 'admin' && true}
                data={pedidos}
                ventas={user.rol === 'admin' && true}
                filters={filters}
                onRowClick={handleVolverAImprimir}
              />
            </div>
          </article>
        </>
      )}
                {/* <div className="print-area">
            {etiquetas.map((eti, i) =>
              Array.from({ length: eti.Cantidad }).map((_, index) => (
                <EtiquetaImpresion
                  key={`${i}-${index}`}
                  descripcion={eti.Descripcion}
                  articulo={eti.Articulo}
                  precio={eti.Precio}
                  sucursal={eti.Sucursal}
                />
              ))
            )}
          </div> */}
    </section>
  )
}

export default VerPedidos
