import Form from './components/Form'
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
            endpoint="http://localhost:3000/login"
        />
    )
}

export default Login
