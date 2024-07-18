import { useState } from "react";
import { toast } from "react-toastify";

const Form = (fields, endpoint, tipoDeForm) => {
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
                mode: "cors",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
              });

            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.errors ? errorData.errors.join(", ") : errorData.error;

                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            console.log(responseData);

            toast.success(
                `${tipoDeForm ? "Te has registrado con éxito" : "Te has logueado con éxito"}`,
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

        } catch (error) {
            console.error("Error al enviar datos:", error.message);
            toast.error(
                `${tipoDeForm ? "Error al intentar registrarse: " + error.message : `Error al intentar iniciar sesión: ` + error.message}`,
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

export default Form;
