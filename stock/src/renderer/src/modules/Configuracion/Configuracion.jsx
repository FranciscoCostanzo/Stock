import React, { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import BtnGeneral from '../Components/Btns/BtnGeneral'
import { AuthContext } from '../Auth/context/AuthContext'
import {
  obtenerSucursalesAdmin,
  obtenerTarjetasAdmin,
  obtenerUsuariosAdmin
} from './lib/libConfiguracion'
import TablesProductos from '../Components/Table/TablesProductos'
import FiltroProductos from '../Mercaderia/components/Filtros/FiltroProductos'
import { Link } from 'react-router-dom'

const Configuracion = () => {
  const { user } = useContext(AuthContext) // obtener el usuario desde el contexto
  const [tarjetasAdmin, setTarjetasAdmin] = useState([])
  const [usuariosAdmin, setUsuariosAdmin] = useState([])
  const [sucursalesAdmin, setSucursalesAdmin] = useState([])
  const [loading, setLoading] = useState(true)
  const [indice, setIndice] = useState(null)

  const btnsConfiguracion = [
    {
      btn: 'Tarjetas',
      muestra: tarjetasAdmin,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
          <path d="M3 10l18 0" />
          <path d="M7 15l.01 0" />
          <path d="M11 15l2 0" />
        </svg>
      )
    },
    {
      btn: 'Registrar Usuarios',
      muestra: usuariosAdmin,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
          <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
          <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
        </svg>
      )
    },
    {
      btn: 'Sucursales',
      muestra: sucursalesAdmin,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M3 21l18 0" />
          <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
          <path d="M5 21l0 -10.15" />
          <path d="M19 21l0 -10.15" />
          <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
        </svg>
      )
    }
  ]
  const [activeIndex, setActiveIndex] = useState(null) // Maneja el índice activo

  const handleAbrirSeccion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index)) // Si es el mismo índice, ciérralo; de lo contrario, ábrelo.
    setIndice(index)
  }
  console.log(indice)

  useEffect(() => {
    const loadMercaderia = async () => {
      try {
        if (user) {
          let dataTarjetas
          let dataUsuarios
          let dataSucursales
          if (user.rol === 'admin') {
            dataTarjetas = await obtenerTarjetasAdmin()
            dataUsuarios = await obtenerUsuariosAdmin()
            dataSucursales = await obtenerSucursalesAdmin()
          }
          setTarjetasAdmin(dataTarjetas)
          setUsuariosAdmin(dataUsuarios)
          setSucursalesAdmin(dataSucursales)
        }
      } catch (error) {
        console.log('Error al cargar mercadería:', error.message)
      } finally {
        setLoading(false)
      }
    }

    loadMercaderia()
  }, [user])

  const [filters, setFilters] = useState({})

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
  }
  return (
    <>
      {user.rol === 'admin' && (
        <>
          <section className="configuracion">
            <BtnVolver donde="/inicio" />
            <article className="contenedor__btns__configuracion">
              {btnsConfiguracion.map((btn, index) => (
                <React.Fragment key={index}>
                  <BtnGeneral tocar={() => handleAbrirSeccion(index)}>
                    {btn.icon}
                    <p>{btn.btn}</p>
                  </BtnGeneral>
                  <></>
                </React.Fragment>
              ))}
            </article>
            <div>
              {btnsConfiguracion.map((btn, index) => (
                <React.Fragment key={index}>
                  {activeIndex === index && (
                    <>
                      {loading ? (
                        <div loader="interno" className="contenedor__loader">
                          <span className="loader"></span>
                          <span className="text__loader">Cargando</span>
                        </div>
                      ) : (
                        <article className="table__container">
                          <FiltroProductos
                            columns={Object.keys(btn.muestra[0] || {})}
                            onFilterChange={handleFilterChange}
                          />
                          <div className="table-wrapper">
                            <TablesProductos data={btn.muestra} filters={filters} />
                          </div>
                        </article>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
            <Link to="/register">Registar</Link>

          </section>
        </>
      )}
    </>
  )
}

export default Configuracion
