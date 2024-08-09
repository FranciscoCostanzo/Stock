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
          { name: 'costo', type: 'number', label: 'Precio Costo' },
          { name: 'publico', type: 'number', label: 'Precio Publico' }
        ]
        apiEndpoint = 'http://localhost:3000/agregar-articulo'
        tituloFormulario = 'Agregar Articulo'
        messageFormulario = 'Agregar un articulo para poder usarlo'
        break
      case 'edit':
        fields = [
          { name: 'id', type: 'text', label: 'Artículo' },
          { name: 'nombre', type: 'text', label: 'Nueva Descripción' },
          { name: 'precio', type: 'number', label: 'Nuevo Precio Costo' },
          { name: 'precio', type: 'number', label: 'Nuevo Precio Publico' }
        ]
        apiEndpoint = '/api/articulos/modificar'
        tituloFormulario = 'Modificar Artículo'
        messageFormulario = 'Modifica alguna parte del artículo'

        break
      case 'delete':
        fields = [
          { name: 'id', type: 'text', label: 'Artículo' }
          // Tal vez solo necesites el ID para eliminar
        ]
        apiEndpoint = 'http://localhost:3000/eliminar-articulo'
        tituloFormulario = 'Eliminar Artículo'
        messageFormulario = 'Elimina un artiuclo, tenes que poner el numero exacto'

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
