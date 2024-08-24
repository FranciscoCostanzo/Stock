import { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import TablesProductos from '../Components/Table/TablesProductos'
import { AuthContext } from '../Auth/context/AuthContext'
import FiltroProductos from '../Mercaderia/components/Filtros/FiltroProductos'
import { obtenerVentasSemana } from './lib/libVentas'

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
          data = await obtenerVentasSemana()
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

  // const ventasUnificadas = ventasSemana.reduce((acumulador, ventaActual) => {
  //   // Buscar si ya existe una venta con el mismo id_venta y metodo_de_pago en el acumulador
  //   const ventaExistente = acumulador.find(
  //     (venta) =>
  //       venta.id_venta === ventaActual.id_venta &&
  //       venta.metodo_de_pago === ventaActual.metodo_de_pago
  //   );
  //   // if (ventaExistente) {
  //   //   // Si existe, sumar adelanto, total_venta y total con conversión a float
  //   //   ventaExistente.adelanto = parseFloat(
  //   //     (parseFloat(ventaExistente.adelanto) + parseFloat(ventaActual.adelanto)).toFixed(2)
  //   //   );
  //   //   ventaExistente.total_venta = parseFloat(
  //   //     (parseFloat(ventaExistente.total_venta) + parseFloat(ventaActual.total_venta)).toFixed(2)
  //   //   );
  //   //   ventaExistente.total = parseFloat(
  //   //     (parseFloat(ventaExistente.total) + parseFloat(ventaActual.total)).toFixed(2)
  //   //   );
  //   // } else {
  //   //   // Si no existe, agregar la venta actual al acumulador
  //   // }

  //     acumulador.push({ ...ventaActual });
  //   return acumulador;
  // }, []);

  const ventasUnificadas = ventasSemana.map(({
    id_venta,
    Fecha,
    Hora,
    Usuario,
    Sucursal,
    Metodo,
    Tarjeta,
    NombreCliente,
    ApellidoCliente,
    DNICliente,
    Descripcion,
    Adelanto,
    total_venta,
    Total
  }) => ({
    id_venta,
    Fecha,
    Hora,
    Usuario,
    Sucursal,
    Metodo,
    Tarjeta,
    NombreCliente,
    ApellidoCliente,
    DNICliente,
    Descripcion,
    Adelanto: parseFloat(Adelanto),
    total_venta: parseFloat(total_venta),
    Total: parseFloat(Total)
  }));

  const filtros = ventasSemana.map(({
    Fecha,
    Usuario,
    Sucursal,
    Metodo,
    Tarjeta,
    NombreCliente,
    ApellidoCliente,
    DNICliente,
    Descripcion,
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
    Descripcion,
    Total: parseFloat(Total)
  }));
  

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
              <TablesProductos data={ventasUnificadas} filters={filters} />
            </div>
          </article>
        </>
      )}
    </section>
  )
}

export default VerVentas
