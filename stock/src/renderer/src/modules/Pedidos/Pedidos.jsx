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
      // Agrega el artículo al array de etiquetas solo cuando se cargue la cantidad
      setEtiquetas((prevEtiquetas) => [
        ...prevEtiquetas,
        {
          Articulo: articuloAComprar,
          Descripcion: dataArticulo.Descripcion,
          Precio: dataArticulo.Precio,
          Cantidad: parseInt(cantidad),
          Sucursal: selectedSucursalText
        }
      ])
      setDataArticulo(null) // Limpia los datos del artículo
      setCantidad('') // Limpia el campo de cantidad
    }
  }

  const imprimirEtiqueta = async () => {
    if (etiquetas.length === 0) {
      toast.warn('No hay etiquetas para imprimir.')
      return
    }

    setImprimiendo(true)
    try {
      await window.print()

      if (etiquetaActual < etiquetas.length - 1) {
        setEtiquetaActual(etiquetaActual + 1)
      } else {
        toast.success('Todas las etiquetas han sido impresas.')
        setEtiquetaActual(0)
        setEtiquetas([])
      }
    } catch (error) {
      toast.error('Error al imprimir la etiqueta.')
    } finally {
      setImprimiendo(false)
    }
  }

  console.log(dataArticulo)

  return (
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
                    <>
                      <div className="flex">
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
                      <div className="articulo__info">
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
                      </div>
                    </>
                  )}

                </article>
              </article>

              <article className="table__container">

                <div className="table-wrapper table__pedidos">
                  <TablesProductos data={mercaderia} filters={filters} />
                </div>
                <br />
                <div className="total__eti">
                    <strong>Total Etiquetas: {etiquetas.length}</strong>
                  </div>
                <div className="table-wrapper table__pedidos">
                  <TablesProductos data={etiquetas} filters={filters} />
                </div>
              </article>

              <BtnGeneral claseBtn="btn__imprimir" tocar={imprimirEtiqueta}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                  <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                  <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
                </svg>
                Imprimir
              </BtnGeneral>
            </ContenedorPages>
          </section>
        </>
      )}
    </section>
  )
}

export default Pedidos