import { useContext, useEffect, useState } from 'react';
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver';
import Table from '../Components/Table/TablesProductos';
import { obtenerFallasAdmin } from '../Mercaderia/lib/libMercaderia';
import { AuthContext } from '../Auth/context/AuthContext';
import FiltroProductos from '../Mercaderia/components/Filtros/FiltroProductos';
import ToolsFallas from './components/ToolsFallas';

const Fallas = () => {
  const { user } = useContext(AuthContext);
  const [mercaderia, setMercaderia] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMercaderia = async () => {
      try {
        if (user) {
          let data = [];
          if (user.rol === 'admin') {
            data = await obtenerFallasAdmin();
          }
          setMercaderia(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.log('Error al cargar mercadería:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadMercaderia();
  }, [user]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <section className="mercaderia">
      {user.rol === "admin" ? (
        <BtnVolver donde="/pedidos" />
      ) : (
        <BtnVolver donde="/recibir-pedidos" />
      )}
      {loading ? (
        <div loader="interno" className="contenedor__loader">
          <span className="loader"></span>
          <span className="text__loader">Cargando</span>
        </div>
      ) : (
        <>
          <article className="table__container">
            <FiltroProductos
              columns={mercaderia.length > 0 ? Object.keys(mercaderia[0]) : []}
              onFilterChange={handleFilterChange}
            />
            <div className="table-wrapper">
              <Table data={mercaderia} filters={filters} />
            </div>
          </article>
          {user.rol === 'admin' && (
            <>
              <ToolsFallas />
            </>
          )}
        </>
      )}
    </section>
  );
};

export default Fallas;
