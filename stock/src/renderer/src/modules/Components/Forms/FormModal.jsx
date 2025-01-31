import { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../Auth/context/AuthContext'
import { toast } from 'react-toastify'

const FormModal = ({ fieldsForm, endpoint, onClose, tituloForm, messageForm, additionalData }) => {
  const { user } = useContext(AuthContext) // obtener el usuario desde el contexto

  const initialState = fieldsForm.reduce((acc, field) => {
    return { ...acc, [field.name]: field.name === 'id_usuario' ? user.id : '' } // Setea id_usuario desde el contexto
  }, {})

  const [formData, setFormData] = useState(initialState)
  const inputsRef = useRef([])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const dataToSend = { ...formData, ...additionalData }
    console.log(JSON.stringify(dataToSend))
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(dataToSend)
      })

      if (!response.ok) {
        // Obtener el mensaje y código del error desde el backend
        const errorData = await response.json()
        throw errorData // Lanzamos el error con su código y mensaje
      }

      const data = await response.json()
      console.log('Respuesta del servidor:', data)

      // Notificación de éxito
      toast.success('¡Enviado con éxito!', { autoClose: 5000 })

      onClose() // Cerrar el modal
      window.location.reload()
    } catch (error) {
      // Si el error tiene un código y mensaje, lo mostramos
      console.error('Error:', error.code)
      toast.error(`Error al enviar: ${error.code} - ${error.message}`, { autoClose: 5000 })
    }
  }

  return (
    <div className="overlay">
      <form className="formModal" onSubmit={handleSubmit}>
        <p className="title">{tituloForm}</p>
        <p className="message">{messageForm}</p>

        {fieldsForm.map((field, index) => (
          <div className="flex" key={index}>
            <label>
              {field.type === 'select' ? (
                <select
                  ref={(el) => (inputsRef.current[index] = el)}
                  value={formData[field.name]}
                  onChange={handleChange}
                  name={field.name}
                  className="input"
                >
                  <option value="">Seleccionar {field.label}</option>
                  {field.options.map((option, idx) => (
                    <option key={idx} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.name === 'id_usuario' ? (
                <input
                  ref={(el) => (inputsRef.current[index] = el)}
                  value={user.id}
                  type={field.type}
                  name={field.name}
                  className="input invisible"
                  readOnly
                />
              ) : (
                <input
                  ref={(el) => (inputsRef.current[index] = el)}
                  value={formData[field.name]}
                  onChange={handleChange}
                  type={field.type}
                  name={field.name}
                  className="input"
                />
              )}
              <span>{field.label}</span>
            </label>
          </div>
        ))}
        <button className="submit" type="submit">
          Enviar
        </button>
        <div className="close__btn" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </div>
      </form>
    </div>
  )
}

export default FormModal
