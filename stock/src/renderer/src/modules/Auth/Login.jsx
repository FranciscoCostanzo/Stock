import { urlEndpoint } from '../lib'
import Form from './components/FormAuth'

const Login = () => {
  const camposInicioSesion = [
    {
      label: 'Usuario',
      name: 'nombre',
      type: 'text'
    },
    {
      label: 'Contraseña',
      name: 'password',
      type: 'password'
    }
  ]

  return (
    <Form
      dataSucursales={undefined}
      fields={camposInicioSesion}
      tipoDeForm={false}
      endpoint={`${urlEndpoint}/login`}
    />
  )
}

export default Login
