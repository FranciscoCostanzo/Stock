import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Link, useNavigate } from 'react-router-dom'
import { fetchSucursales } from '../lib/libAuth'

const Form = ({ fields, endpoint, tipoDeForm, dataSucursales }) => {
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
    const navigate = useNavigate()
    const initialState = fields.reduce((acc, campo) => {
        return { ...acc, [campo.name]: '' }
    }, {})

    // Añadir un campo de contraseña de confirmación si es un formulario de registro
    if (tipoDeForm) {
        initialState.confirmPassword = '' // Campo para la confirmación de contraseña
    }

    const [vistaPassword, setVistaPassword] = useState(false)

    const toggleVistaPassword = () => {
        setVistaPassword((prevVistaPassword) => !prevVistaPassword)
    }

    const [formData, setFormData] = useState(initialState)
    if (formData.rol === 'admin') {
        var fields = fields.filter((field) => field.label !== 'Sucursal')
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (tipoDeForm && formData.password !== formData.confirmPassword) {
            toast.error('Las contraseñas no coinciden.', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'light'
            })
            return
        }

        try {
            let formDataToSend = { ...formData }

            // Eliminar el campo 'Sucursal' si el rol es 'admin'
            if (formData.rol === 'admin') {
                const { sucursal, ...rest } = formDataToSend
                formDataToSend = rest
            } else {
                // Verificar que `dataSucursales` esté definido y sea un array
                if (Array.isArray(sucursales)) {
                    // Encontrar la sucursal seleccionada y obtener su ID
                    const selectedSucursal = sucursales.find(
                        (sucursal) => `${sucursal.ciudad} - ${sucursal.nombre}` === formData.sucursal
                    )
                    if (selectedSucursal) {
                        formDataToSend.sucursal = selectedSucursal.id
                    }
                } else {
                    console.error('Sucursales no están definidas o no son un array')
                }
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formDataToSend),
                credentials: 'include'
            })

            if (!response.ok) {
                const errorData = await response.json()
                const errorMessage = errorData.errors ? errorData.errors.join(', ') : errorData.error
                throw new Error(errorMessage)
            }

            const responseData = await response.json()
            console.log(responseData)
            if (!tipoDeForm) {
                navigate('/dashboard')
            }

            toast.success(`${tipoDeForm ? 'Te has registrado con éxito' : 'Te has logueado con éxito'}`, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
                progress: undefined,
                theme: 'light'
            })
        } catch (error) {
            console.error('Error al enviar datos:', error.message)
            toast.error(
                `${tipoDeForm
                    ? 'Error al intentar registrarse: ' + error.message
                    : `Error al intentar iniciar sesión: ` + error.message
                }`,
                {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: 'light'
                }
            )
        }
    }

    return (
        <>
            <form className="form" onSubmit={handleSubmit}>
                {tipoDeForm === true ? (
                    <>
                        <p className="title">Registrarse</p>
                        <p className="message">Crea una cuenta para agregar un usuario nuevo</p>
                    </>
                ) : (
                    <>
                        <p className="title">Iniciar sesión</p>
                        <p className="message">Ingresa con tu cuenta para continuar</p>
                    </>
                )}
                {fields.map((campo, index) => (
                    <div className="flex" key={index}>
                        <label>
                            {campo.type === 'select' ? (
                                <>
                                    <select
                                        onChange={handleChange}
                                        value={formData[campo.name]}
                                        name={campo.name}
                                        className="input"
                                        required
                                    >
                                        <option value="">Seleccione una opción</option>
                                        {campo.options.map((option, optIndex) => (
                                            <option key={optIndex} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            ) : campo.type === 'password' ? (
                                <>
                                    <div onClick={toggleVistaPassword} className="ojo__password">
                                        {vistaPassword ? (
                                            <svg viewBox="0 0 24 24">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                                            </svg>
                                        ) : (
                                            <svg viewBox="0 0 24 24">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                                                <path d="M13.048 17.942a9.298 9.298 0 0 1 -1.048 .058c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6a17.986 17.986 0 0 1 -1.362 1.975" />
                                                <path d="M22 22l-5 -5" />
                                                <path d="M17 22l5 -5" />
                                            </svg>
                                        )}
                                    </div>
                                    <input
                                        onChange={handleChange}
                                        value={formData[campo.name]}
                                        type={vistaPassword ? 'text' : campo.type}
                                        name={campo.name}
                                        className="input"
                                        required
                                    />
                                </>
                            ) : (
                                <input
                                    onChange={handleChange}
                                    value={formData[campo.name]}
                                    type={campo.type}
                                    name={campo.name}
                                    className="input"
                                    required
                                />
                            )}
                            <span>{campo.label}</span>
                        </label>
                    </div>
                ))}
                {tipoDeForm && (
                    <div className="flex">
                        <label>
                            <input
                                onChange={handleChange}
                                value={formData.confirmPassword}
                                type={vistaPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                className="input"
                            />
                            <span>Confirmar Contraseña</span>
                        </label>
                    </div>
                )}
                {tipoDeForm === true ? (
                    <>
                        <button type="submit" className="submit">
                            Crear Cuenta
                        </button>
                        <p className="signin">
                            ¿Ya tienes una cuenta? <Link to="/">Iniciar Sesión</Link>
                        </p>
                    </>
                ) : (
                    <>
                        <button className="submit">Iniciar sesión</button>
                        <p className="signin">
                            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                        </p>
                    </>
                )}
            </form>
        </>
    )
}

export default Form
