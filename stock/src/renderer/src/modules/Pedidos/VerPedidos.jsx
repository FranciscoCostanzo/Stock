import { useContext, useEffect, useState } from 'react'
import { obtenerPedidosAdmin, obtenerPedidosEmpleadoRecibidos, obtenerPublicoPorId } from './lib/libPedidos'
import { AuthContext } from '../Auth/context/AuthContext'
import TablesProductos from '../Components/Table/TablesProductos'
import FiltroProductos from '../Mercaderia/components/Filtros/FiltroProductos'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import BtnGeneral from '../Components/Btns/BtnGeneral'
import EtiquetaImpresion from './components/EtiquetaImpresion'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const VerPedidos = () => {
  const { user } = useContext(AuthContext)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})
    const navigate = useNavigate()

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

  const handleVolverAImprimir = async (etiqueta) => {
    // Asegúrate de que etiqueta sea un objeto y lo conviertas a array si es necesario
    const etiquetasActualizadas = Array.isArray(etiqueta) ? etiqueta : [etiqueta];
    
    // Cargar el precio de la mercadería
    try {
      if (user) {
        if (user.rol === 'admin') {
          // Asumiendo que tienes una función para hacer el fetch
          const response = await obtenerPublicoPorId(etiqueta.Articulo); // Ajusta esto según cómo estés haciendo el fetch
          // Actualizar cada etiqueta con el nuevo precio
          const etiquetasConPrecio = etiquetasActualizadas.map((eti) => ({
            ...eti,
            Precio: response, // Asignar el valor de precio aquí
          }));
  
          // Actualizar el estado con las etiquetas que ahora incluyen el precio
          setEtiquetas(etiquetasConPrecio);
        }
      }
    } catch (error) {
      console.log('Error al cargar mercadería:', error.message);
    }
  };

  const HandleImprimirEtiqueta = async () => {
    if (etiquetas.length === 0) {
      toast.warn('No hay etiquetas para imprimir.')
      return
    }
    try {
      await window.print()
      toast.success('Todas las etiquetas han sido impresas.')
      navigate('/pedidos')
    } catch (error) {
      toast.error('Error al imprimir las etiquetas.')
    } finally {
      console.log("termino")
    }
  }

  return (
    <>
      {etiquetas.length > 0 ? (
        <>
          <BtnGeneral claseBtn="btn__imprimir" tocar={HandleImprimirEtiqueta}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
              <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
              <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
            </svg>
            Imprimir
          </BtnGeneral>
          <div className="print-area">
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
          </div>
        </>
      )
        :
        (

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
                    dateColumns={['Fecha']}
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
        )}
    </>
  )
}

export default VerPedidos
