import { Link, Navigate, useNavigate } from "react-router-dom";
import useForm from "./components/Forms";
const Auth = () => {
    const camposInicioSesion = [
        {
            label: "Email o Usuario",
            name: "user",
            type: "text",
        },
        {
            label: "Contraseña",
            name: "password",
            type: "password",
        },
    ];

    const { formData, handleChange, handleSubmit } = useForm(camposInicioSesion, "http://localhost:4000/auth", false);


    const navigate = useNavigate()

    return (
        <>
            <form onSubmit={() => navigate("dashbord")} className="form__registro">
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

export default Auth;
