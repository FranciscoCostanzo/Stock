import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Forms = (fields, endpoint, tipoDeForm) => {
    const navigate = useNavigate();

    // Generar el estado inicial del formulario a partir de los campos de registro
    const initialState = fields.reduce((acc, campo) => {
        return { ...acc, [campo.name]: "" };
    }, {});

    const [formData, setFormData] = useState(initialState);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                mode: "cors", // Modo CORS
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            // Verificar el status de la respuesta
            if (!response.ok) {
                // Si el status es 401 (Unauthorized), muestra un mensaje de error específico
                if (response.status === 401) {
                    throw new Error("Credenciales incorrectas");
                }
                // Si el status es 409 (Conflict), muestra un mensaje de error específico
                if (response.status === 409) {
                    throw new Error("El usuario ya existe");
                }
                // Si el status es otro, muestra un mensaje de error genérico
                throw new Error("Error al enviar datos");
            }
            const responseData = await response.json(); // Convierte la respuesta en un objeto JSON
            console.log(responseData); // Imprime los datos de la respuesta en la consola

            // Guardar todos los datos de la respuesta en el sessionStorage

            toast.success(
                `${tipoDeForm
                    ? "Te has registrado con éxito"
                    : "Te has logueado con éxito"
                }`,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                }
            );

            navigate("/dashbord");
            window.location.reload();
            localStorage.setItem("userData", JSON.stringify(responseData));
        } catch (error) {
            console.error("Error al enviar datos:", error.message);
            toast.error(
                `${tipoDeForm
                    ? "Error al intentar registrarse"
                    : `Error al intentar iniciar sesión`
                }`,
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: false,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                }
            );
        }
    };

    return { formData, handleChange, handleSubmit };
};

export default Forms;
