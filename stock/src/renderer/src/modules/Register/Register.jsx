import { Link } from "react-router-dom";
import useForm from "../Auth/components/Forms";

const Register = () => {
    const camposRegistro = [
        {
            label: "Nombre del Local",
            name: "nombre_local",
            type: "text",
        },
        {
            label: "Contraseña",
            name: "password",
            type: "password",
        },
    ];

    const { formData, handleChange, handleSubmit } = useForm(camposRegistro, "http://localhost:4000/register", true);

    return (
        <>
            <form className="form__registro" onSubmit={handleSubmit}>
                <p className="title">Formulario de registro</p>
                <p className="message">Crea una cuenta para poder comprar</p>
                {camposRegistro.map((campoReg, index) => (
                    <div className="flex" key={index}>
                        <label>
                            <input
                                onChange={handleChange}
                                value={formData[campoReg.name]}
                                type={campoReg.type}
                                name={campoReg.name}
                                className="input"
                            />
                            <span>{campoReg.label}</span>
                        </label>
                    </div>
                ))}
                <button type="submit" className="submit">Crear Local Nuevo</button>
                <p className="signin">
                    ¿Ya tienes una cuenta? <Link to="/auth">Iniciar Sesión</Link>
                </p>
            </form>
        </>
    );
};

export default Register;
