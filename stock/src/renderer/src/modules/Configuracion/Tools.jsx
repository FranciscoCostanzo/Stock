import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FormModal from '../Components/Forms/FormModal'

const Tools = ({ formConfigs }) => {
  const [abrirFormModal, setAbrirFormModal] = useState(false)
  const [fieldsForm, setFieldsForm] = useState([])
  const [tituloForm, setTituloForm] = useState('')
  const [messageForm, setMessageForm] = useState('')
  const [endpoint, setEndpoint] = useState('')
  const navigate = useNavigate() // Hook para navegar

  const handleAbrirFormModal = (config) => {
    if (config.tituloFormulario === 'Agregar Usuario') {
      // Si el título del formulario es "Agregar Usuario", redirigimos a la página de registro
      navigate('/register')
    } else {
      // Para otros formularios, abrimos el modal
      setTituloForm(config.tituloFormulario)
      setMessageForm(config.messageFormulario)
      setFieldsForm(config.fields)
      setEndpoint(config.apiEndpoint)
      setAbrirFormModal(true)
    }
  }

  const handleCerrarFormModal = () => {
    setAbrirFormModal(false)
    setFieldsForm([])
    setEndpoint('')
  }

  return (
    <>
      <article className="tools__productos">
        {formConfigs.map((config, index) => (
          <p key={index} onClick={() => handleAbrirFormModal(config)}>
            {config.tituloFormulario}
          </p>
        ))}
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

export default Tools
