import { Link } from 'react-router-dom'
import Form from './components/Form'

const Register = () => {
  const camposRegistro = [
    {
      label: 'Nombre',
      name: 'nombre',
      type: 'text'
    },
    {
      label: 'Contraseña',
      name: 'password',
      type: 'password'
    },
    {
      label: 'Rol',
      name: 'rol',
      type: 'select',
      options: ['admin', 'empleado']
    }
  ]

  const { formData, handleChange, handleSubmit } = Form(
    camposRegistro,
    'http://localhost:3000/register',
    true
  )

  return (
    <>
      <form className="form__registro" onSubmit={handleSubmit}>
        <p className="title">Formulario de registro</p>
        <p className="message">Crea una cuenta para poder comprar</p>
        {camposRegistro.map((campoReg, index) => (
          <div className="flex" key={index}>
            <label>
              {campoReg.type === 'select' ? (
                <>
                  <select
                    onChange={handleChange}
                    value={formData[campoReg.name]}
                    name={campoReg.name}
                    className="input"
                  >
                    <option value="">Seleccione una opción</option>
                    {campoReg.options.map((option, optIndex) => (
                      <option key={optIndex} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </>
              ) : (
                <input
                  onChange={handleChange}
                  value={formData[campoReg.name]}
                  type={campoReg.type}
                  name={campoReg.name}
                  className="input"
                />
              )}
              <span>{campoReg.label}</span>
            </label>
          </div>
        ))}
        <button type="submit" className="submit">
          Crear Cuenta
        </button>
        <p className="signin">
          ¿Ya tienes una cuenta? <Link to="/login">Iniciar Sesión</Link>
        </p>
      </form>
    </>
  )
}

export default Register
