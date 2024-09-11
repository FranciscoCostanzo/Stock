import { useContext, useEffect, useState } from 'react';
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver';
import TablesProductos from '../Components/Table/TablesProductos';
import { AuthContext } from '../Auth/context/AuthContext';
import FiltroProductos from '../Mercaderia/components/Filtros/FiltroProductos';
import { obtenerCajaAdmin, obtenerCajaSucursal } from './lib/libCaja';

const VerCaja = () => {
  const { user } = useContext(AuthContext);
  const [cajaData, setCajaData] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCaja = async () => {
      try {
        let data;
        if (user) {
          if (user.rol === 'admin') {
            data = await obtenerCajaAdmin();
          } else {
            data = await obtenerCajaSucursal(user.sucursal.id);
          }
          setCajaData(data);
        }
      } catch (error) {
        console.log('Error al cargar caja:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadCaja();
  }, [user]);

  // Agrupación y suma de valores
  const cajaUnificada = cajaData.reduce((acc, entry) => {
    const {
      id,
      id_motivo,
      id_usuario,
      id_sucursal,
      fecha,
      monto,
      sobrante,
      fondo,
      cantidad_tarjeta,
      cantidad_efectivo,
      total_tarjeta,
      total_efectivo,
      total
    } = entry;

    if (!acc[id]) {
      acc[id] = {
        id_usuario,
        id_sucursal,
        fecha,
        monto: parseFloat(monto),
        sobrante: parseFloat(sobrante),
        fondo: parseFloat(fondo),
        cantidad_tarjeta: parseInt(cantidad_tarjeta, 10),
        cantidad_efectivo: parseInt(cantidad_efectivo, 10),
        total_tarjeta: parseFloat(total_tarjeta),
        total_efectivo: parseFloat(total_efectivo),
        total: parseFloat(total)
      };
    } else {
      acc[id].monto += parseFloat(monto);
      acc[id].sobrante += parseFloat(sobrante);
      acc[id].fondo += parseFloat(fondo);
      acc[id].cantidad_tarjeta += parseInt(cantidad_tarjeta, 10);
      acc[id].cantidad_efectivo += parseInt(cantidad_efectivo, 10);
      acc[id].total_tarjeta += parseFloat(total_tarjeta);
      acc[id].total_efectivo += parseFloat(total_efectivo);
      acc[id].total += parseFloat(total);
    }

    return acc;
  }, {});

  // Convertir el objeto agrupado en un array
  const cajaUnificadaArray = Object.values(cajaUnificada);

  // Filtros
  const filtros = cajaData.map(
    ({
      id_usuario,
      id_sucursal,
      fecha,
      monto,
      sobrante,
      fondo,
      cantidad_tarjeta,
      cantidad_efectivo,
      total_tarjeta,
      total_efectivo,
      total
    }) => ({
      id_usuario,
      id_sucursal,
      fecha,
      monto: parseFloat(monto),
      sobrante: parseFloat(sobrante),
      fondo: parseFloat(fondo),
      cantidad_tarjeta: parseInt(cantidad_tarjeta, 10),
      cantidad_efectivo: parseInt(cantidad_efectivo, 10),
      total_tarjeta: parseFloat(total_tarjeta),
      total_efectivo: parseFloat(total_efectivo),
      total: parseFloat(total)
    })
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <section className="caja">
      {loading ? (
        <div loader="interno" className="contenedor__loader">
          <span className="loader"></span>
          <span className="text__loader">Cargando</span>
        </div>
      ) : (
        <>
          <BtnVolver donde="/inicio" />
          <article className="table__container">
            <FiltroProductos
              columns={Object.keys(filtros[0] || {})}
              onFilterChange={handleFilterChange}
            />
            <div className="table-wrapper">
              <TablesProductos data={cajaUnificadaArray} filters={filters} />
            </div>
          </article>
        </>
      )}
    </section>
  );
};

export default VerCaja;
