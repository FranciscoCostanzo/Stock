import { useState } from 'react'

const FormModal = ({ fieldsForm, endpoint, onClose }) => {
    const initialState = fieldsForm.reduce((acc, field) => {
        return { ...acc, [field.name]: '' }
    }, {})
    const [formData, setFormData] = useState(initialState)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error('Error en la solicitud')
            }

            const data = await response.json()
            console.log('Respuesta del servidor:', data)
        } catch (error) {
            console.error('Error al enviar el formulario:', error)
        }
    }

    return (
        <div className="overlay">
            <form className="form" onSubmit={handleSubmit}>
                <div className="title">Formulario</div>
                {fieldsForm.map((field, index) => (
                    <div className="flex" key={index}>
                        <label>
                            <input
                                value={formData[field.name]}
                                onChange={handleChange}
                                type={field.type}
                                name={field.name}
                                className="input"
                                required
                            />
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
