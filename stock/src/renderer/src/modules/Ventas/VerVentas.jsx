import { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import TablesProductos from '../Components/Table/TablesProductos'
import { AuthContext } from '../Auth/context/AuthContext'
import FiltroProductos from '../Mercaderia/components/Filtros/FiltroProductos'
import { obtenerVentasAdmin, obtenerVentasSucursal } from './lib/libVentas'

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
    const {
      id_venta,
      Fecha,
      Usuario,
      Sucursal,
      Metodo,
      Tarjeta,
      NombreCliente,
      ApellidoCliente,
      DNICliente,
      Adelanto,
      total_venta,
      Total
    } = venta

    if (!acc[id_venta]) {
      acc[id_venta] = {
        Fecha,
        Usuario,
        Sucursal,
        Metodo,
        Tarjeta,
        NombreCliente,
        ApellidoCliente,
        DNICliente,
        Adelanto: Adelanto === 'No tiene' ? Adelanto : parseFloat(Adelanto),
        Total_Venta: parseFloat(total_venta),
        Total: parseFloat(Total)
      }
    } else {
      acc[id_venta].Adelanto =
        Adelanto === 'No tiene' ? Adelanto : acc[id_venta].Adelanto + parseFloat(Adelanto)
      acc[id_venta].Total_Venta += parseFloat(total_venta)
      acc[id_venta].Total += parseFloat(Total)
    }

    return acc
  }, {})

  // Convertir el objeto agrupado en un array
  const ventasUnificadasArray = Object.values(ventasUnificadas)

  // Filtros
  const filtros = ventasSemana.map(
    ({
      Fecha,
      Usuario,
      Sucursal,
      Metodo,
      Tarjeta,
      NombreCliente,
      ApellidoCliente,
      DNICliente,
      Total
    }) => ({
      Fecha,
      Usuario,
      Sucursal,
      Metodo,
      Tarjeta,
      NombreCliente,
      ApellidoCliente,
      DNICliente,
      Total: parseFloat(Total)
    })
  )

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
          <BtnVolver donde="/ventas" />
          <article className="table__container">
            <FiltroProductos
              columns={Object.keys(filtros[0] || {})}
              onFilterChange={handleFilterChange}
            />
            <div className="table-wrapper">
              <TablesProductos data={ventasUnificadasArray} filters={filters} />
            </div>
          </article>
        </>
      )}
    </section>
  )
}

export default VerVentas
