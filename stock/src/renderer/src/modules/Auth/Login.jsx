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
      endpoint="https://servidor.asessaludsrl.com/login"
    />
  )
}

export default Login
