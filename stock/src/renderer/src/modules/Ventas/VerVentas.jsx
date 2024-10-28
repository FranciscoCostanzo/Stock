import { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import TablesProductos from '../Components/Table/TablesProductos'
import { AuthContext } from '../Auth/context/AuthContext'
import FiltroProductos from '../Mercaderia/components/Filtros/FiltroProductos'
import { obtenerVentasAdmin, obtenerVentasSucursal } from './lib/libVentas'
import BtnGeneral from '../Components/Btns/BtnGeneral'

const VerVentas = () => {
  const { user } = useContext(AuthContext)
  const [ventasSemana, setVentasSemana] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadVentas = async () => {
      try {
        if (user) {
          let data
          if (user.rol === 'admin') {
            data = await obtenerVentasAdmin()
          } else {
            data = await obtenerVentasSucursal(user.sucursal.id)
          }
          setVentasSemana(data)
        }
      } catch (error) {
        console.log('Error al cargar mercadería:', error.message)
      } finally {
        setLoading(false)
      }
    }

    loadVentas()
  }, [user])

  // Agrupación y suma de valores
  const ventasUnificadas = ventasSemana.reduce((acc, venta) => {
    const { id_venta, Fecha, Usuario, Sucursal, Metodo, Tarjeta, Adelanto, Total } = venta

    if (!acc[id_venta]) {
      acc[id_venta] = {
        id_venta,
        Fecha,
        Productos: 1,
        Usuario,
        Sucursal,
        Metodo,
        Tarjeta,
        // Cliente: `${NombreCliente} ${ApellidoCliente}`,
        Adelanto: Adelanto === 'No tiene' ? Adelanto : parseFloat(Adelanto),
        Total: parseFloat(Total)
      }
    } else {
      acc[id_venta].Adelanto =
        Adelanto === 'No tiene' ? Adelanto : acc[id_venta].Adelanto + parseFloat(Adelanto)
      acc[id_venta].Total += parseFloat(Total)
      acc[id_venta].Productos += 1
    }

    return acc
  }, {})

  // Convertir el objeto agrupado en un array
  const ventasUnificadasArray = Object.values(ventasUnificadas)

  // Filtros
  const filtros = ventasSemana.map(
    ({ Fecha, Usuario, Sucursal, Metodo, Tarjeta, DNICliente, Total }) => ({
      Fecha,
      Usuario,
      Sucursal,
      Metodo,
      Tarjeta,
      DNICliente,
      Total: parseFloat(Total)
    })
  )

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }

  const [ventasEspecificas, setVentasEspecificas] = useState([])

  const handleVerVentasEspecifica = (ventaEspecifica) => {
    const resultado = ventasSemana.filter(
      (especifica) => especifica.id_venta === ventaEspecifica.id_venta
    )

    // const ventasUnificadas = resultado.reduce((acc, venta) => {
    //   const { id_venta, Fecha, Hora, Usuario, Sucursal,Descripcion, NombreCliente, ApellidoCliente,  Metodo, Tarjeta, Adelanto, total_venta, Total } = venta

    //   if (!acc[id_venta]) {
    //     acc[id_venta] = {
    //       Fecha,
    //       Hora,
    //       Usuario,
    //       Sucursal,
    //       Descripcion,
    //       Metodo,
    //       Tarjeta,
    //       // Cliente: `${NombreCliente} ${ApellidoCliente}`,
    //       Adelanto: Adelanto === 'No tiene' ? Adelanto : parseFloat(Adelanto),
    //       total_venta,
    //       Total: parseFloat(Total)
    //     }
    //   } else {
    //     acc[id_venta].Adelanto =
    //       Adelanto === 'No tiene' ? Adelanto : acc[id_venta].Adelanto + parseFloat(Adelanto)
    //     acc[id_venta].Total += parseFloat(Total)
    //   }

    //   return acc
    // }, {})
    setVentasEspecificas(resultado)
  }


  const handleVolverAtrasAnalisis = () => {
    setVentasEspecificas([])
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
          <BtnVolver donde="/ventas" />
          <article className="table__container">
            <FiltroProductos
              columns={Object.keys(filtros[0] || {})}
              onFilterChange={handleFilterChange}
              dateColumns={['Fecha']}
            />
            {ventasEspecificas.length === 0 ? (
              <div className="table-wrapper">
                <TablesProductos
                  ventas={true}
                  analisis={true}
                  onRowClick={handleVerVentasEspecifica}
                  data={ventasUnificadasArray}
                  filters={filters}
                />
              </div>
            ) : (
              <>
                <BtnGeneral tocar={handleVolverAtrasAnalisis} claseBtn="btn__atras__analisis">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M13 14l-4 -4l4 -4" />
                    <path d="M8 14l-4 -4l4 -4" />
                    <path d="M9 10h7a4 4 0 1 1 0 8h-1" />
                  </svg>
                  Atras
                </BtnGeneral>
                <div className="table-wrapper">
                  <TablesProductos data={ventasEspecificas} filters={filters} />
                </div>
              </>
            )}
          </article>
        </>
      )}
    </section>
  )
}

export default VerVentas
