import SelectSucursales from '../Components/Inputs/SelectSucursales'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import BtnGeneral from '../Components/Btns/BtnGeneral'
import { toast } from 'react-toastify'
import { obtenerArticuloPedidos } from '../Pedidos/lib/libPedidos'
import { useState } from 'react'
import EtiquetaImpresion from '../Pedidos/components/EtiquetaImpresion'
import { useNavigate } from 'react-router-dom'

const Etiquetas = () => {
  const [articuloAComprar, setArticuloAComprar] = useState('')
  const [etiquetaData, setEtiquetaData] = useState(null)
  const [selectedSucursalId, setSelectedSucursalId] = useState(null)
  const [selectedSucursalText, setSelectedSucursalText] = useState('')
  const navigate = useNavigate();

  const handleAceptar = async () => {
    const articuloTrimmed = articuloAComprar.trim()

    if (!articuloTrimmed) {
      toast.warn('El campo de artículo está vacío')
      return
    }

    if (articuloAComprar && selectedSucursalId) {
      try {
        // Realizar una solicitud al servidor para buscar el artículo
        const data = await obtenerArticuloPedidos(articuloTrimmed)
        if (data) {
          // Crear el objeto con los datos necesarios para la etiqueta
          const newEtiquetaData = {
            articulo: data.Artículo,
            descripcion: data.Descripcion,
            precio: data.Precio,
            sucursal: selectedSucursalText // Usamos el texto seleccionado de la sucursal
          }
          setEtiquetaData(newEtiquetaData)
        } else {
          toast.error('No se encontró el artículo o no está disponible en la sucursal.')
        }
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
    } else {
      toast.error('No se ha seleccionado un artículo o sucursal.')
    }
  }

  const HandleImprimirEtiqueta = async () => {
    try {
      await window.print()
      toast.success('Todas las etiquetas han sido impresas.')
      navigate('/inicio');
    } catch (error) {
      toast.error('Error al imprimir las etiquetas.')
    } finally {
      console.log("finalizado")
    }
  }

  const handleSucursalChange = (id, text) => {
    setSelectedSucursalId(id)
    setSelectedSucursalText(text)
  }

  const handleChangeArticuloPedidos = (e) => {
    setArticuloAComprar(e.target.value)
  }

  return (
    <>
      {etiquetaData ? (
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
            <EtiquetaImpresion
              descripcion={etiquetaData.descripcion}
              precio={etiquetaData.precio}
              articulo={etiquetaData.articulo}
              sucursal={etiquetaData.sucursal}
            />
          </div>
        </>
      ) : (
        <section className='ventas'>

          <BtnVolver donde="/inicio" />
          <article className="contenedor__generar__etiqueta">
            <h2>Seleccionar Artículo y Sucursal</h2>
            <div className="flex">
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
            </div>
            <div></div>
            <BtnGeneral claseBtn="btn__aceptar__etiqueta" tocar={handleAceptar}>
              Aceptar
            </BtnGeneral>
          </article>
        </section>
      )}
    </>
  )
}

export default Etiquetas
