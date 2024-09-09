import { useEffect, useState } from 'react';
import { obtenerMotivosCaja } from '../lib/libCaja';

const SelectMotivosCaja = ({ onChange }) => {
  const [motivos, setMotivos] = useState([]);

  useEffect(() => {
    // Cargar motivos de la caja del servidor
    const loadMotivosCaja = async () => {
      try {
        const data = await obtenerMotivosCaja();
        setMotivos(data); // Guardar los motivos obtenidos del servidor
      } catch (error) {
        console.log('Error al cargar los motivos de la caja:', error.message);
      }
    };

    loadMotivosCaja();
  }, []);

  const handleSelectChange = (event) => {
    const selectedMotivoId = Number(event.target.value); // Convertir a número
    const selectedOption = motivos.find(option => option.id === selectedMotivoId);

    if (selectedOption) {
      onChange(selectedMotivoId, selectedOption.motivo); // Enviar ambos valores al componente padre
    } else {
      onChange(null, null); // Enviar null si no hay selección válida
    }
  };

  function capitalizeFirstLetter(string) {
    if (!string) return '' // Manejar cadenas vacías o nulas
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  return (
    <div className="flex">
      <label>
        <select
          name="motivo"
          className="input"
          required
          onChange={handleSelectChange} // Manejar el cambio de selección
        >
          <option value="">Seleccione un motivo</option>
          {motivos.map((option, optIndex) => (
            <option key={optIndex} value={option.id}>
              {capitalizeFirstLetter(option.motivo)}
            </option>
          ))}
        </select>
        <span>Motivo de la caja</span>
      </label>
    </div>
  );
};

export default SelectMotivosCaja;
