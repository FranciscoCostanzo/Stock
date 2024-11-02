import { useEffect, useState } from 'react';
import { obtenerMotivosCaja } from '../lib/libCaja';

const SelectMotivosCaja = ({ onChange }) => {
  const [motivos, setMotivos] = useState([]); // Lista de motivos
  const [selectedMotivoId, setSelectedMotivoId] = useState(""); // ID del motivo seleccionado
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Estado de error

  useEffect(() => {
    // Cargar motivos de la caja desde el servidor
    const loadMotivosCaja = async () => {
      try {
        setLoading(true);
        const data = await obtenerMotivosCaja();
        setMotivos(data); // Guardar los motivos obtenidos del servidor
        setError(null); // Limpiar cualquier error anterior
      } catch (error) {
        setError("Error al cargar los motivos de la caja."); // Manejo de error
        console.log('Error:', error.message);
      } finally {
        setLoading(false); // Terminar la carga
      }
    };

    loadMotivosCaja();
  }, []);

  const handleSelectChange = (event) => {
    const selectedId = Number(event.target.value); // Convertir el valor a número
    setSelectedMotivoId(selectedId); // Actualizar el motivo seleccionado

    const selectedOption = motivos.find(option => option.id === selectedId);
    if (selectedOption) {
      // Enviar un objeto con `id` y `motivo` al componente padre
      onChange({ id: selectedId, motivo: selectedOption.motivo });
    } else {
      onChange(null); // Enviar null si no hay selección válida
    }
  };

  function capitalizeFirstLetter(string) {
    if (!string) return ''; // Manejar cadenas vacías o nulas
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return (
    <div className="flex">
      <label>
        {loading ? (
          <p>Cargando motivos...</p> // Mostrar mensaje de carga
        ) : (
          <select
            name="motivo"
            className="input"
            required
            onChange={handleSelectChange} // Manejar el cambio de selección
            value={selectedMotivoId || ""} // Asignar el valor seleccionado o vacío
            aria-label="Seleccionar motivo de la caja" // Mejorar accesibilidad
          >
            <option value="">Seleccione un motivo</option>
            {motivos.map((option, optIndex) => (
              <option key={optIndex} value={option.id}>
                {capitalizeFirstLetter(option.motivo)}
              </option>
            ))}
          </select>
        )}
        <span>Motivo de la caja</span>
        {error && <p className="error">{error}</p>} {/* Mostrar mensaje de error si existe */}
      </label>
    </div>
  );
};

export default SelectMotivosCaja;
