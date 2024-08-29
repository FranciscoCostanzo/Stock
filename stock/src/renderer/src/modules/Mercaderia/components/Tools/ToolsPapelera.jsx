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
      case 'vaciarPapelera':
        fields = [{ name: 'OKV', type: 'text', label: 'Confirmación' }]
        apiEndpoint = 'http://localhost:3000/vaciar-papelera'
        tituloFormulario = 'Vaciar Papelera'
        messageFormulario =
          'Confirmar escribiendo "OKV" para poder vaciar la papelera, todos los artículo se eliminaran definitivamente'
        break
      case 'borrarArticuloEspecifico':
        fields = [
          { name: 'id', type: 'text', label: 'Artículo' },
          { name: 'OKVE', type: 'text', label: 'Confirmación' }
        ]
        apiEndpoint = 'http://localhost:3000/eliminar-especifico-papelera'
        tituloFormulario = 'Borrar Artículo Específico'
        messageFormulario =
          'Escribe el artículo en específico que quieras eliminar definitivamente y luego escribe "OKVE" en el campo de confirmación'
        break
      case 'restablecerTodo':
        fields = [{ name: 'OKR', type: 'text', label: 'Confirmación' }]
        apiEndpoint = 'http://localhost:3000/restablecer-todos-articulos-papelera'
        tituloFormulario = 'Restablecer Todos los Artículos'
        messageFormulario = 'Confirmar escribiendo "OKR" para restablecer todos los artículos'
        break
      case 'restablecerArticulo':
        fields = [
          { name: 'id', type: 'text', label: 'Artículo' },
          { name: 'OKRE', type: 'text', label: 'Confirmación' }
        ]
        apiEndpoint = 'http://localhost:3000/restablecer-especifico-papelera'
        tituloFormulario = 'Restablecer Artículo'
        messageFormulario =
          'Escribe el artículo en específico que quieras restablecer y luego escribe "OKRE" en el campo de confirmación'
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
        <p onClick={() => handleAbrirFormModal('vaciarPapelera')}>Vaciar Papelera</p>
        <p onClick={() => handleAbrirFormModal('borrarArticuloEspecifico')}>
          Borrar Artículo Especifico
        </p>
        <p onClick={() => handleAbrirFormModal('restablecerTodo')}>Restablecer Papelera</p>
        <p onClick={() => handleAbrirFormModal('restablecerArticulo')}>
          Restablecer Artículo Especifico
        </p>
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
