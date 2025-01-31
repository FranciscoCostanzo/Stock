import { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import Table from '../Components/Table/TablesProductos'
import { obtenerFallasAdmin, obtenerFallasEmpelado } from '../Mercaderia/lib/libMercaderia'
import { AuthContext } from '../Auth/context/AuthContext'
import FiltroProductos from '../Mercaderia/components/Filtros/FiltroProductos'
import ToolsFallas from './components/ToolsFallas'
import BtnGeneral from '../Components/Btns/BtnGeneral'
import FormModal from '../Components/Forms/FormModal'
import { urlEndpoint } from '../lib'

const Fallas = () => {
  const { user } = useContext(AuthContext)
  const [mercaderia, setMercaderia] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [formFalla, setFormFalla] = useState(false)

  useEffect(() => {
    const loadMercaderia = async () => {
      try {
        if (user) {
          let data = []
          if (user.rol === 'admin') {
            data = await obtenerFallasAdmin()
          } else {
            data = await obtenerFallasEmpelado(user.sucursal.id)
          }
          setMercaderia(Array.isArray(data) ? data : [])
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

  const fieldsFallas = [
    { name: 'id_mercaderia', label: 'Articulo', type: 'number' },
    { name: 'cantidad', label: 'Cantidad', type: 'number' }
  ]

  const handleCloseFormFallas = () => {
    setFormFalla(false)
  }

  const handleOpenFormFallas = () => {
    setFormFalla(true)
  }

  if (user.rol === 'empleado') {
    var additionalData = {
      id_sucursal: user.sucursal.id,
      id_usuario: user.id
    }
  }

  return (
    <section className="mercaderia">
      {user.rol === 'admin' ? (
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
          {user.rol === 'admin' ? (
            <>
              <ToolsFallas />
            </>
          ) : (
            <BtnGeneral claseBtn="btn__recibir" tocar={handleOpenFormFallas}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8.243 4.252l.757 -.252c0 .43 .09 .837 .252 1.206m1.395 1.472a3 3 0 0 0 4.353 -2.678l6 2v5h-3v3m0 4v1a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-8h-3v-5l2.26 -.753" />
                <path d="M3 3l18 18" />
              </svg>
              Enviar Falla
            </BtnGeneral>
          )}
          {formFalla && (
            <FormModal
              fieldsForm={fieldsFallas}
              endpoint={`${urlEndpoint}/enviar-falla`}
              onClose={handleCloseFormFallas}
              tituloForm="Enviar Falla"
              messageForm={`Formulario para enviar fallas de la sucursal ${user.sucursal.ciudad}`}
              additionalData={additionalData}
            />
          )}
        </>
      )}
    </section>
  )
}

export default Fallas
