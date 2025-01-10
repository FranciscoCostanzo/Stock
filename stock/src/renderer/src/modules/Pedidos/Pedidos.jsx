import { useState, useEffect, useContext } from 'react'
import BtnGeneral from '../Components/Btns/BtnGeneral'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import { obtenerArticuloPedidos } from './lib/libPedidos'
import { toast } from 'react-toastify'
import { AuthContext } from '../Auth/context/AuthContext'
import { obtenerMercaderiaAdmin } from '../Mercaderia/lib/libMercaderia'
import TablesProductos from '../Components/Table/TablesProductos'
import SelectSucursales from '../Components/Inputs/SelectSucursales'
import ContenedorPages from '../Components/Contenedor/ContenedorPages'
import EtiquetaImpresion from './components/EtiquetaImpresion'
import { Link } from 'react-router-dom'
import { urlEndpoint } from '../lib'

const Pedidos = () => {
  const { user } = useContext(AuthContext)
  const [mercaderia, setMercaderia] = useState([])
  const [filters, setFilters] = useState({})
  const [loading, setLoading] = useState(true)
  const [dataArticulo, setDataArticulo] = useState(null) // Datos del artículo temporalmente
  const [articuloAComprar, setArticuloAComprar] = useState('')
  const [etiquetas, setEtiquetas] = useState([])
  const [etiquetaActual, setEtiquetaActual] = useState(0)
  const [imprimiendo, setImprimiendo] = useState(false)
  const [imprimir, setImprimir] = useState(false)
  const [cantidad, setCantidad] = useState('') // Estado para la cantidad

  const [selectedSucursalId, setSelectedSucursalId] = useState(null)
  const [selectedSucursalText, setSelectedSucursalText] = useState('')

  const handleSucursalChange = (id, text) => {
    setSelectedSucursalId(id)
    setSelectedSucursalText(text)
  }

  useEffect(() => {
    const loadMercaderia = async () => {
      try {
        if (user) {
          let data
          if (user.rol === 'admin') {
            data = await obtenerMercaderiaAdmin()
          }
          setMercaderia(data)
        }
      } catch (error) {
        console.log('Error al cargar mercadería:', error.message)
      } finally {
        setLoading(false)
      }
    }

    loadMercaderia()
  }, [user])

  const handleArticuloPedidos = async () => {
    const articuloTrimmed = articuloAComprar.trim()

    if (!articuloTrimmed) {
      toast.warn('El campo de artículo está vacío')
      return
    }

    try {
      const data = await obtenerArticuloPedidos(articuloTrimmed)
      setDataArticulo(data)
    } catch (error) {
      console.error(error)

      if (error.response) {
        const { error: errorCode, message } = error.response.data

        switch (errorCode) {
          case 'NoStock':
            toast.warn(message)
            break
          case 'NoArticulo':
            toast.warn(message)
            break
          case 'ServerError':
            toast.error(message)
            break
          default:
            toast.error('Ocurrió un error inesperado.')
            break
        }
      } else {
        toast.error('No hay stock disponible o el artículo no existe.')
      }
    }
  }

  const handleChangeArticuloPedidos = (e) => {
    setArticuloAComprar(e.target.value)
  }

  const handleChangeCantidad = (e) => {
    setCantidad(e.target.value)
  }

  const cargarEtiqueta = () => {
    if (cantidad <= 0) {
      toast.error('La cantidad debe ser mayor que 0.')
      return
    }

    if (!selectedSucursalText) {
      toast.error('Debe seleccionar una sucursal antes de cargar el pedido.')
      return
    }

    if (dataArticulo) {
      // Verificar si el artículo con la misma sucursal ya está en el array de etiquetas
      const existingEtiquetaIndex = etiquetas.findIndex(
        (etiqueta) =>
          etiqueta.Articulo === articuloAComprar && etiqueta.Sucursal === selectedSucursalText
      )

      if (existingEtiquetaIndex >= 0) {
        // Si ya existe, sumar la cantidad
        setEtiquetas((prevEtiquetas) =>
          prevEtiquetas.map((etiqueta, index) =>
            index === existingEtiquetaIndex
              ? { ...etiqueta, Cantidad: etiqueta.Cantidad + parseInt(cantidad) }
              : etiqueta
          )
        )
      } else {
        // Si no existe, agregar una nueva entrada
        setEtiquetas((prevEtiquetas) => [
          ...prevEtiquetas,
          {
            Articulo: articuloAComprar,
            Descripcion: dataArticulo.Descripcion,
            Precio: dataArticulo.Precio,
            Cantidad: parseInt(cantidad),
            Sucursal: selectedSucursalText,
            selectedSucursalId: selectedSucursalId
          }
        ])
      }

      setDataArticulo(null) // Limpia los datos del artículo
      setCantidad('') // Limpia el campo de cantidad
    }
  }

  const etiquetasParaTabla = etiquetas.map(({ selectedSucursalId, ...rest }) => rest)

  const HandleImprimirEtiqueta = async () => {
    if (etiquetas.length === 0) {
      toast.warn('No hay etiquetas para imprimir.')
      return
    }
    setImprimiendo(true)
    try {
      await window.print()
      toast.success('Todas las etiquetas han sido impresas.')
      setEtiquetaActual(0)
      setEtiquetas([])
    } catch (error) {
      toast.error('Error al imprimir las etiquetas.')
    } finally {
      setImprimiendo(false)
      setImprimir(false)
    }
  }

  const cantidadesDeEti = etiquetas.map((eti) => eti.Cantidad)
  const sumaTotalCantidades = cantidadesDeEti.reduce(
    (acumulador, cantidad) => acumulador + cantidad,
    0
  )

  // Función para eliminar todas las etiquetas
  const handleEliminarTodasLasEtiquetas = () => {
    setEtiquetas([])
    setCantidad('')
    setArticuloAComprar('')
  }

  const construirFormDataDinamico = () => {
    return etiquetas.map((etiq) => {
      return {
        id_usuario: parseInt(user.id, 10), // Asegura que el ID del usuario sea un número entero
        id_sucursal: parseInt(etiq.selectedSucursalId, 10), // Usa el campo temporal
        id_mercaderia: parseInt(etiq.Articulo, 10), // Asegura que el ID de la mercadería sea un número entero
        cantidad: parseInt(etiq.Cantidad, 10) // Asegura que la cantidad sea un número entero
      }
    })
  }

  const handleIrAImprimir = async () => {
    setImprimir(true)

    // Construir los datos de FormData dinámicamente
    const data = construirFormDataDinamico()
    try {
      const response = await fetch(`${urlEndpoint}/pedidos`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Error al enviar los datos')
      }

      const result = await response.json()
      toast.success('Datos enviados con éxito.')
    } catch (error) {
      console.error('Error en el envío de datos:', error)
      toast.error('Hubo un error al enviar los datos.')
    }
  }

  const handleDescargarEspecifico = (articuloParaEliminar) => {
    setEtiquetas((prevCargas) => {
      // Filtrar los artículos que no coincidan con el artículo y sucursal que se quiere eliminar
      const filteredCargas = prevCargas.filter(
        (articulo) =>
          !(
            articulo.Articulo === articuloParaEliminar.Articulo &&
            articulo.Sucursal === articuloParaEliminar.Sucursal
          )
      )

      return filteredCargas
    })
  }

  return (
    <>
      {imprimir ? (
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
      ) : (
        <section className="mercaderia">
          {loading ? (
            <div loader="interno" className="contenedor__loader">
              <span className="loader"></span>
              <span className="text__loader">Cargando</span>
            </div>
          ) : (
            <>
              <section className="ventas">
                <BtnVolver donde="/inicio" />

                <ContenedorPages>
                  <article className="buscar__pedidos">
                    <article className="buscar__articulos">
                      <div className="btns__inputs__pedidos">
                        <div className="flex selector__articulo">
                          <label>
                            <input
                              value={articuloAComprar}
                              onChange={handleChangeArticuloPedidos}
                              type="text" // Cambiar a texto para los códigos de artículo
                              name="id_mercaderia"
                              className="input"
                            />
                            <span>Artículo</span>
                          </label>
                          <SelectSucursales onChange={handleSucursalChange} />
                          <BtnGeneral tocar={handleArticuloPedidos}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                              <path d="M21 21l-6 -6" />
                            </svg>
                            Buscar Artículo
                          </BtnGeneral>
                        </div>
                        {dataArticulo && (
                          <div className="flex selector__articulo">
                            <label>
                              <input
                                value={cantidad}
                                onChange={handleChangeCantidad}
                                type="number"
                                name="cantidad"
                                className="input"
                              />
                              <span>Cantidad</span>
                            </label>
                            <BtnGeneral
                              tocar={cargarEtiqueta}
                              disabled={!selectedSucursalId} // Deshabilitar el botón si no hay una sucursal seleccionada
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M18 4h-6a3 3 0 0 0 -3 3v7" />
                                <path d="M13 10l-4 4l-4 -4m8 5l-4 4l-4 -4" />
                              </svg>
                              Cargar Pedido
                            </BtnGeneral>
                          </div>
                        )}
                      </div>

                      {dataArticulo && (
                        <div>
                          <h3>Información del Artículo:</h3>
                          <p>
                            Descripción: <strong>{dataArticulo.Descripcion}</strong>
                          </p>
                          <p>
                            Precio: <strong>{dataArticulo.Precio}</strong>
                          </p>
                          <p>
                            Artículo: <strong>{articuloAComprar}</strong>
                          </p>
                          <p>
                            Sucursal: <strong>{selectedSucursalText}</strong>
                          </p>
                        </div>
                      )}
                      {etiquetas.length > 0 && (
                        <>
                          <BtnGeneral claseBtn="btn__ir__imprimir" tocar={handleIrAImprimir}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                              <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                              <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
                            </svg>
                            Enviar Pedido e Imprimir
                          </BtnGeneral>
                          <BtnGeneral
                            claseBtn="btn__eliminar"
                            tocar={handleEliminarTodasLasEtiquetas}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M4 7l16 0" />
                              <path d="M10 11l0 6" />
                              <path d="M14 11l0 6" />
                              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                            </svg>
                            Anular Todo
                          </BtnGeneral>
                        </>
                      )}
                    </article>
                  </article>

                  <article className="table__container">
                    <div className="table-wrapper table__pedidos">
                      <TablesProductos data={mercaderia} filters={filters} />
                    </div>
                    <br />
                    <div>
                      <strong>Total Etiquetas: {sumaTotalCantidades}</strong>
                    </div>
                    <div className="table-wrapper table__pedidos">
                      <TablesProductos
                        onRowClick={handleDescargarEspecifico}
                        ventas={true}
                        data={etiquetasParaTabla}
                        filters={filters}
                      />
                    </div>
                  </article>
                </ContenedorPages>

                <article className="contenedor__btns__sigpestanas">
                  <Link className="btn__pestanas__siguiente" to="/ver-pedidos">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M11 14l4 -4l-4 -4" />
                      <path d="M16 14l4 -4l-4 -4" />
                      <path d="M15 10h-7a4 4 0 1 0 0 8h1" />
                    </svg>
                    Ver Pedidos
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
              </section>
            </>
          )}
        </section>
      )}
    </>
  )
}

export default Pedidos
