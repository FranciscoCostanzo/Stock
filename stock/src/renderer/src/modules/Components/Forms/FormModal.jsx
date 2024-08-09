import { useState, useRef, useEffect } from "react";
import { toast } from 'react-toastify';


const FormModal = ({ fieldsForm, endpoint, onClose, tituloForm, messageForm }) => {
  const initialState = fieldsForm.reduce((acc, field) => {
    return { ...acc, [field.name]: "" };
  }, {});
  const [formData, setFormData] = useState(initialState);
  const inputsRef = useRef([]);

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
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Error en la solicitud");
      }

      const data = await response.json();
      console.log("Respuesta del servidor:", data);

      // Mostrar notificación de éxito
      toast.success('¡Producto agregado con éxito!', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });

      // Cerrar el modal después de éxito
      onClose();
    } catch (error) {
      console.error("Error al enviar el formulario:", error);

      // Mostrar notificación de error
      toast.error('Error al agregar el producto. Intenta de nuevo.', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light'
      });
    }
  };

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault();
    };

    inputsRef.current.forEach((input) => {
      if (input) {
        input.addEventListener("wheel", handleWheel, { passive: false });
      }
    });

    return () => {
      inputsRef.current.forEach((input) => {
        if (input) {
          input.removeEventListener("wheel", handleWheel);
        }
      });
    };
  }, []);

  return (
    <div className="overlay">
      <form className="form" onSubmit={handleSubmit}>
        <p className="title">{tituloForm}</p>
        <p className="message">{messageForm}</p>

        {fieldsForm.map((field, index) => (
          <div className="flex" key={index}>
            <label>
              <input
                ref={(el) => (inputsRef.current[index] = el)}
                value={formData[field.name]}
                onChange={handleChange}
                type={field.type}
                name={field.name}
                className="input"
                required
              />
              <span>{field.label}</span>
            </label>
          </div>
        ))}
        <button className="submit" type="submit">
          Enviar
        </button>
        <div className="close__btn" onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </div>
      </form>
    </div>
  );
};

export default FormModal;
