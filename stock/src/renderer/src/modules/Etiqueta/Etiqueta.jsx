import SelectSucursales from '../Components/Inputs/SelectSucursales'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import BtnGeneral from '../Components/Btns/BtnGeneral'
import { toast } from 'react-toastify'
import { obtenerArticuloPedidos } from '../Pedidos/lib/libPedidos'
import { useState } from 'react'
import EtiquetaImpresion from '../Pedidos/components/EtiquetaImpresion'

const Etiquetas = () => {
  const [articuloAComprar, setArticuloAComprar] = useState('')
  const [etiquetaData, setEtiquetaData] = useState(null)
  const [selectedSucursalId, setSelectedSucursalId] = useState(null)
  const [selectedSucursalText, setSelectedSucursalText] = useState('')

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

  const handleSucursalChange = (id, text) => {
    setSelectedSucursalId(id)
    setSelectedSucursalText(text)
  }

  const handleChangeArticuloPedidos = (e) => {
    setArticuloAComprar(e.target.value)
  }

  console.log(etiquetaData.descripcion)
  return (
    <section className="ventas">
      <BtnVolver donde="/inicio" />
      {etiquetaData ? (
        <>
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
        <>
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
        </>
      )}
    </section>
  )
}

export default Etiquetas
