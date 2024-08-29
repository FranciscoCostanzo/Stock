import { useEffect, useState } from 'react'
import FormModal from '../../../Components/Forms/FormModal'
import { fetchSucursales } from '../../../Auth/lib/libAuth'

const ToolsFallas = () => {
  const [abrirFormModal, setAbrirFormModal] = useState(false)
  const [fieldsForm, setFieldsForm] = useState([])
  const [tituloForm, setTituloForm] = useState('')
  const [messageForm, setMessageForm] = useState('')
  const [endpoint, setEndpoint] = useState('')
  const [sucursales, setSucursales] = useState([])

  useEffect(() => {
    // Obtener sucursales del servidor
    const loadSucursales = async () => {
      try {
        const data = await fetchSucursales()
        setSucursales(data) // Guardar las sucursales completas
      } catch (error) {
        console.log(error.message)
      }
    }

    loadSucursales()
  }, [])

  const sucursal = sucursales.map(({ id, ciudad }) => ({
    value: id,
    label: ciudad
  }))
  const handleAbrirFormModal = (action) => {
    let fields = []
    let apiEndpoint = ''
    let tituloFormulario = ''
    let messageFormulario = ''

    switch (action) {
      case 'enviarFalla':
        fields = [
          { name: 'id_usuario', type: 'number', label: 'Articulo' },
          { name: 'id_mercaderia', type: 'number', label: 'Articulo' },
          {
            name: 'id_sucursal',
            type: 'select',
            label: 'Sucursal',
            options: sucursal
          },
          { name: 'cantidad', type: 'text', label: 'Cantidad' }
        ]
        apiEndpoint = 'http://localhost:3000/enviar-falla'
        tituloFormulario = 'Enviar Falla'
        messageFormulario =
          'Enviar falla de producto para sacarlo del stock de una sucursal en especifico'
        break
      case 'restablecerFalla':
        fields = [
          { name: 'id_usuario', type: 'number', label: 'Articulo' },
          { name: 'id_mercaderia', type: 'text', label: 'Artículo' },
          {
            name: 'id_sucursal',
            type: 'select',
            label: 'Sucursal',
            options: sucursal
          },
          { name: 'cantidad', type: 'text', label: 'Cantidad' },
          { name: 'OKRF', type: 'text', label: 'Confirmación' }
        ]
        apiEndpoint = 'http://localhost:3000/restablecer-falla'
        tituloFormulario = 'Restablecer Falla'
        messageFormulario =
          'Escribe el artículo en específico que quieras restablecer y luego escribe "OKRF" en el campo de confirmación'
        break
      default:
        break
    }

    setTituloForm(tituloFormulario)
    setMessageForm(messageFormulario)
    setFieldsForm(fields)
    setEndpoint(apiEndpoint)
    setAbrirFormModal(true)
  }

  const handleCerrarFormModal = () => {
    setAbrirFormModal(false)
    setFieldsForm([])
    setEndpoint('')
  }

  return (
    <>
      <article className="tools__productos">
        <p onClick={() => handleAbrirFormModal('enviarFalla')}>Enviar Falla</p>
        <p onClick={() => handleAbrirFormModal('restablecerFalla')}>Restablecer Falla</p>
      </article>
      {abrirFormModal && (
        <FormModal
          messageForm={messageForm}
          tituloForm={tituloForm}
          fieldsForm={fieldsForm}
          endpoint={endpoint}
          onClose={handleCerrarFormModal}
        />
      )}
    </>
  )
}

export default ToolsFallas
