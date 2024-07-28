import Form from './components/Form'

const Register = () => {
  const camposRegistro = [
    {
      label: 'Rol',
      name: 'rol',
      type: 'select',
      options: ['admin', 'empleado']
    },
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
  ]

  return (
    <Form fields={camposRegistro} tipoDeForm={true} endpoint="http://localhost:3000/register" />
  )
}

export default Register
