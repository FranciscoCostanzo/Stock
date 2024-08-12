import { useState } from 'react'
import FormModal from '../../../Components/Forms/FormModal'

const ToolsMercaderia = () => {
  const [abrirFormModal, setAbrirFormModal] = useState(false)
  const [fieldsForm, setFieldsForm] = useState([])
  const [tituloForm, setTituloForm] = useState('')
  const [messageForm, setMessageForm] = useState('')
  const [endpoint, setEndpoint] = useState('')

  const handleAbrirFormModal = (action) => {
    let fields = []
    let apiEndpoint = ''
    let tituloFormulario = ''
    let messageFormulario = ''

    switch (action) {
      case 'add':
        fields = [
          { name: 'descripcion', type: 'text', label: 'Descripción' },
          { name: 'costo', type: 'number', label: 'Precio de Costo' },
          { name: 'publico', type: 'number', label: 'Precio Público' }
        ]
        apiEndpoint = 'http://localhost:3000/agregar-articulo'
        tituloFormulario = 'Agregar Artículo'
        messageFormulario = 'Agrega un artículo para poder usarlo'
        break

      case 'edit':
        fields = [
          { name: 'id', type: 'text', label: 'ID del artículo que quieres modificar' },
          { name: 'descripcion', type: 'text', label: 'Nueva Descripción' },
          { name: 'costo', type: 'number', label: 'Nuevo Precio de Costo' },
          { name: 'publico', type: 'number', label: 'Nuevo Precio Público' }
        ]
        apiEndpoint = 'http://localhost:3000/modificar-articulo'
        tituloFormulario = 'Modificar Artículo'
        messageFormulario =
          'Modifica una parte del artículo. Debes especificar el artículo que deseas modificar.'

        break

      case 'delete':
        fields = [{ name: 'id', type: 'text', label: 'ID del Artículo' }]
        apiEndpoint = 'http://localhost:3000/eliminar-articulo'
        tituloFormulario = 'Eliminar Artículo'
        messageFormulario = 'Elimina un artículo, debes ingresar el ID exacto'

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
        <p onClick={() => handleAbrirFormModal('add')}>Agregar Artículo</p>
        <p onClick={() => handleAbrirFormModal('edit')}>Modificar Artículo</p>
        <p onClick={() => handleAbrirFormModal('delete')}>Eliminar Artículo</p>
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

export default ToolsMercaderia
