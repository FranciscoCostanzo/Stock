import { Link } from "react-router-dom";
import Form from "./components/Form";
const Login = () => {
    const camposInicioSesion = [
        {
            label: "Usuario",
            name: "nombre",
            type: "text",
        },
        {
            label: "Contraseña",
            name: "password",
            type: "password",
        },
    ];

    const { formData, handleChange, handleSubmit } = Form(camposInicioSesion, "http://localhost:3000/login", false);

    return (
        <>
            <form onSubmit={handleSubmit} className="form__registro">
                <p className="title">Iniciar sesión</p>
                <p className="message">Ingresa con tu cuenta para continuar</p>
                {camposInicioSesion.map((campoInicio, index) => (
                    <div className="flex" key={index}>
                        <label>
                            <input
                                onChange={handleChange}
                                value={formData[campoInicio.name]}
                                type={campoInicio.type}
                                name={campoInicio.name}
                                className="input"
                            />
                            <span>{campoInicio.label}</span>
                        </label>
                    </div>
                ))}
                <button className="submit">Iniciar sesión</button>
                <p className="signin">
                    ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
                </p>
            </form>

        </>

    );
};

export default Login;
