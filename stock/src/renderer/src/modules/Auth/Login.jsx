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
        <>
        <Form dataSucursales={undefined} endpoint="http://localhost:3000/login" fields={camposInicioSesion} tipoDeForm={false} />
        </>
    )
}

export default Login
