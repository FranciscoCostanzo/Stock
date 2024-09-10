import React, { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import BtnGeneral from '../Components/Btns/BtnGeneral'
import { AuthContext } from '../Auth/context/AuthContext'
import {
  obtenerMotivosAdmin,
  obtenerSucursalesAdmin,
  obtenerTarjetasAdmin,
  obtenerUsuariosAdmin
} from './lib/libConfiguracion'
import TablesProductos from '../Components/Table/TablesProductos'
import FiltroProductos from '../Mercaderia/components/Filtros/FiltroProductos'
import { Link } from 'react-router-dom'
import Tools from './Tools'

const Configuracion = () => {
  const { user } = useContext(AuthContext) // obtener el usuario desde el contexto
  const [tarjetasAdmin, setTarjetasAdmin] = useState([])
  const [usuariosAdmin, setUsuariosAdmin] = useState([])
  const [sucursalesAdmin, setSucursalesAdmin] = useState([])
  const [motivosAdmin, setMotivosAdmin] = useState([])
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
      ),
      formConfig: [
        {
          tituloFormulario: 'Eliminar Tarjeta',
          messageFormulario:
            'Escribe "OKT" para confirmar y eliminar la tarjeta especificada. Este proceso es irreversible, y se borrarán todos los datos asociados a la tarjeta.',
          fields: [
            { name: 'id', type: 'number', label: 'ID de la Tarjeta' },
            { name: 'OKT', type: 'text', label: 'Confirmación' }
          ],
          apiEndpoint: 'http://localhost:3000/eliminar-tarjeta'
        },
        {
          tituloFormulario: 'Editar Tarjeta',
          messageFormulario: 'Especifica el ID de la tarjeta y el porcentaje de aumento.',
          fields: [
            { name: 'id', type: 'number', label: 'ID de la Tarjeta' },
            { name: 'aumento', type: 'number', label: 'Porcentaje de Aumento' }
          ],
          apiEndpoint: 'http://localhost:3000/editar-tarjeta'
        },
        {
          tituloFormulario: 'Agregar Tarjeta',
          messageFormulario:
            'Rellena los detalles de la tarjeta que deseas agregar, Los campos son obligatorios.',
          fields: [
            { name: 'tipo_tarjeta', type: 'text', label: 'Nombre de la Tarjeta' },
            { name: 'aumento', type: 'text', label: 'Porcentaje de Aumento' }
          ],
          apiEndpoint: 'http://localhost:3000/agregar-tarjeta'
        }
      ]
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
      ),
      formConfig: [
        {
          tituloFormulario: 'Eliminar Usuario',
          messageFormulario:
            'Escribe "OKU" para confirmar y eliminar al usuario especificado. Esta acción es irreversible, y se eliminarán todos los datos del usuario.',
          fields: [
            { name: 'id', type: 'text', label: 'ID del Usuario' },
            { name: 'OKU', type: 'text', label: 'Confirmación' }
          ],
          apiEndpoint: 'http://localhost:3000/eliminar-usuario'
        },
        {
          tituloFormulario: 'Editar Usuario',
          messageFormulario:
            'Especifica el ID del usuario y los campos que desees actualizar. No es necesario completar todos los campos.',
          fields: [
            { name: 'id', type: 'number', label: 'ID del Usuario' },
            { name: 'nombre', type: 'text', label: 'Nombre del Usuario' },
            { name: 'password', type: 'text', label: 'Contraseña' },
            { name: 'rol', type: 'text', label: 'Rol del Usuario' }
          ],
          apiEndpoint: 'http://localhost:3000/editar-usuario'
        },
        { tituloFormulario: 'Agregar Usuario' }
      ]
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
      ),
      formConfig: [
        {
          tituloFormulario: 'Eliminar Sucursal',
          messageFormulario:
            'Escribe "OKS" para confirmar la eliminación de la sucursal. Esta acción es irreversible y se eliminarán todos los datos de la sucursal.',
          fields: [
            { name: 'id', type: 'number', label: 'ID de la Sucursal' },
            { name: 'OKS', type: 'text', label: 'Confirmación' }
          ],
          apiEndpoint: 'http://localhost:3000/eliminar-sucursal'
        },
        {
          tituloFormulario: 'Editar Sucursal',
          messageFormulario:
            'Especifica el ID de la sucursal y los campos que desees actualizar. No es necesario completar todos los campos.',
          fields: [
            { name: 'id', type: 'number', label: 'ID de la Sucursal' },
            { name: 'nombre', type: 'text', label: 'Nombre de la Sucursal' },
            { name: 'direccion', type: 'text', label: 'Dirección de la Sucursal' },
            { name: 'ciudad', type: 'text', label: 'Ciudad de la Sucursal' }
          ],
          apiEndpoint: 'http://localhost:3000/editar-sucursal'
        },
        {
          tituloFormulario: 'Agregar Sucursal',
          messageFormulario:
            'Rellena los detalles de la sucursal que deseas agregar, Los campos son obligatorios.',
          fields: [
            { name: 'nombre', type: 'text', label: 'Nombre de la Sucursal' },
            { name: 'direccion', type: 'text', label: 'Dirección de la Sucursal' },
            { name: 'ciudad', type: 'text', label: 'Ciudad de la Sucursal' }
          ],
          apiEndpoint: 'http://localhost:3000/agregar-sucursal'
        }
      ]
    },
    {
      btn: 'Cierres de caja',
      muestra: motivosAdmin,
      icon: (
        <svg viewBox="0 0 24 24">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M7 9m0 2a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" />
          <path d="M14 14m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
          <path d="M17 9v-2a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h2" />
        </svg>
      ),
      formConfig: [
        {
          tituloFormulario: 'Eliminar Motivo',
          messageFormulario:
            'Escribe "OKM" para confirmar la eliminación de la sucursal. Esta acción es irreversible y se eliminarán todos los datos de la sucursal.',
          fields: [
            { name: 'id', type: 'number', label: 'ID del Motivo' },
            { name: 'OKM', type: 'text', label: 'Confirmación' }
          ],
          apiEndpoint: 'http://localhost:3000/eliminar-sucursal'
        },
        {
          tituloFormulario: 'Editar Motivo',
          messageFormulario:
            'Especifica el ID de la sucursal y los campos que desees actualizar. No es necesario completar todos los campos.',
          fields: [
            { name: 'id', type: 'number', label: 'ID de la Sucursal' },
            { name: 'nombre', type: 'text', label: 'Nombre de la Sucursal' },
            { name: 'direccion', type: 'text', label: 'Dirección de la Sucursal' },
            { name: 'ciudad', type: 'text', label: 'Ciudad de la Sucursal' }
          ],
          apiEndpoint: 'http://localhost:3000/editar-sucursal'
        },
        {
          tituloFormulario: 'Agregar Motivo',
          messageFormulario:
            'Rellena los detalles de la sucursal que deseas agregar, Los campos son obligatorios.',
          fields: [
            { name: 'nombre', type: 'text', label: 'Nombre de la Sucursal' },
            { name: 'direccion', type: 'text', label: 'Dirección de la Sucursal' },
            { name: 'ciudad', type: 'text', label: 'Ciudad de la Sucursal' }
          ],
          apiEndpoint: 'http://localhost:3000/agregar-sucursal'
        }
      ]
    }
  ]

  const [activeIndex, setActiveIndex] = useState(null) // Maneja el índice activo

  const handleAbrirSeccion = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index)) // Si es el mismo índice, ciérralo; de lo contrario, ábrelo.
    setIndice(index)
  }

  useEffect(() => {
    const loadMercaderia = async () => {
      try {
        if (user) {
          let dataTarjetas, dataUsuarios, dataSucursales, dataMotivos
          if (user.rol === 'admin') {
            dataTarjetas = await obtenerTarjetasAdmin()
            dataUsuarios = await obtenerUsuariosAdmin()
            dataSucursales = await obtenerSucursalesAdmin()
            dataMotivos = await obtenerMotivosAdmin()
          }
          setTarjetasAdmin(dataTarjetas)
          setUsuariosAdmin(dataUsuarios)
          setSucursalesAdmin(dataSucursales)
          setMotivosAdmin(dataMotivos)
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
                        <>
                          <article className="table__container">
                            <FiltroProductos
                              columns={Object.keys(btn.muestra[0] || {})}
                              onFilterChange={handleFilterChange}
                            />
                            <div className="table-wrapper">
                              <TablesProductos data={btn.muestra} filters={filters} />
                            </div>
                          </article>
                          <Tools formConfigs={btn.formConfig} />
                        </>
                      )}
                    </>
                  )}
                </React.Fragment>
              ))}
            </div>
          </section>
        </>
      )}
    </>
  )
}

export default Configuracion
