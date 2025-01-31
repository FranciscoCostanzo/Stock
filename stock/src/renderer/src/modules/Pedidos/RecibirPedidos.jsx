import { useContext, useEffect, useState } from 'react'
import { obtenerPedidosEmpleadoPendientes } from './lib/libPedidos'
import { AuthContext } from '../Auth/context/AuthContext'
import TablesProductos from '../Components/Table/TablesProductos'
import FiltroProductos from '../Mercaderia/components/Filtros/FiltroProductos'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import BtnGeneral from '../Components/Btns/BtnGeneral'
import { toast } from 'react-toastify' // Asegúrate de que Toastify esté importado
import { Link } from 'react-router-dom'
import { urlEndpoint } from '../lib'

const RecibirPedidos = () => {
  const { user } = useContext(AuthContext)
  const [pedidos, setPedidos] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({})

  useEffect(() => {
    const loadMercaderia = async () => {
      try {
        if (user) {
          let data
          if (user.rol === 'empleado') {
            data = await obtenerPedidosEmpleadoPendientes(user.sucursal.id)
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
  const handleRecibirPedidos = async () => {
    try {
      // Validación: Si no hay pedidos, salir temprano
      if (!pedidos || pedidos.length === 0) {
        toast.info('No hay pedidos para procesar.')
        return
      }

      // Crear un conjunto de IDs únicos (no duplicados)
      const uniqueIds = [...new Set(pedidos.map((pedido) => pedido.id))]

      // Enviar el formato correcto al servidor
      const response = await fetch(`${urlEndpoint}/recibir-pedidos`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: uniqueIds }), // Enviar el formato correcto
        credentials: 'include' // Solo si es necesario para tu autenticación
      })

      // Verificar la respuesta
      const result = await response.json()
      if (!response.ok) {
        toast.error(`Error al recibir pedidos: ${result.message}`)
        return
      }

      toast.success('Pedidos recibidos con éxito.')

      // Actualizar la lista de pedidos después de la recepción
      setPedidos((prevPedidos) => prevPedidos.filter((pedido) => !uniqueIds.includes(pedido.id)))
    } catch (error) {
      toast.error(`Error al enviar los pedidos: ${error.message}`)
      console.error('Error al enviar los pedidos:', error.message)
    }
  }

  const handleRecibirPedidoUnico = async (dato) => {
    try {
      // Validación: Si no hay pedidos, salir temprano
      if (!pedidos || pedidos.length === 0) {
        toast.info('No hay pedidos para procesar.')
        return
      }

      // Enviar el formato correcto al servidor
      const response = await fetch(`${urlEndpoint}/recibir-pedido-unico`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: dato.id, id_mercaderia: dato.Articulo }), // Enviar el formato correcto
        credentials: 'include' // Solo si es necesario para tu autenticación
      })

      // Verificar la respuesta
      const result = await response.json()
      if (!response.ok) {
        toast.error(`Error al recibir el pedido: ${result.message}`)
        return
      }

      toast.success('Pedido recibido con éxito.')

      // Actualizar la lista de pedidos filtrando solo el pedido específico
      setPedidos((prevPedidos) =>
        prevPedidos.filter(
          (pedido) => !(pedido.id === dato.id && pedido.Articulo === dato.Articulo)
        )
      )
    } catch (error) {
      toast.error(`Error al enviar el pedido: ${error.message}`)
      console.error('Error al enviar el pedido:', error.message)
    }
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
          {user.rol === 'admin' ? <BtnVolver donde="/pedidos" /> : <BtnVolver donde="/inicio" />}
          <article className="table__container">
            <FiltroProductos
              columns={Object.keys(pedidos[0] || {})}
              onFilterChange={handleFilterChange}
            />
            <div className="table-wrapper">
              <TablesProductos
                ventas={true}
                analisis={true}
                onRowClick={handleRecibirPedidoUnico}
                data={pedidos}
                filters={filters}
              />
            </div>
          </article>
          {pedidos.length > 0 && (
            <BtnGeneral claseBtn="btn__recibir" tocar={handleRecibirPedidos}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M5 17h-2v-11a1 1 0 0 1 1 -1h9v6h-5l2 2m0 -4l-2 2" />
                <path d="M9 17l6 0" />
                <path d="M13 6h5l3 5v6h-2" />
              </svg>
              Recibir todos los pedidos
            </BtnGeneral>
          )}
          <article className="contenedor__sigpestanas">
            <Link className="btn__pestanas__siguiente" to="/ver-pedidos">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M11 14l4 -4l-4 -4" />
                <path d="M16 14l4 -4l-4 -4" />
                <path d="M15 10h-7a4 4 0 1 0 0 8h1" />
              </svg>
              Ver Recibidos
            </Link>
            <Link className="btn__pestanas__siguiente" to="/fallas">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M11 14l4 -4l-4 -4" />
                <path d="M16 14l4 -4l-4 -4" />
                <path d="M15 10h-7a4 4 0 1 0 0 8h1" />
              </svg>
              Fallas
            </Link>
          </article>
        </>
      )}
    </section>
  )
}

export default RecibirPedidos
