import { useEffect, useState } from 'react'
import { obtenerMotivosCaja } from '../lib/libCaja'

const SelectMotivosCaja = ({ onChange }) => {
  const [motivos, setMotivos] = useState([]) // Lista de motivos
  const [selectedMotivoId, setSelectedMotivoId] = useState('') // ID del motivo seleccionado

  useEffect(() => {
    // Cargar motivos de la caja desde el servidor
    const loadMotivosCaja = async () => {
      try {
        const data = await obtenerMotivosCaja()
        setMotivos(data) // Guardar los motivos obtenidos del servidor
      } catch (error) {
        console.log('Error:', error.message)
      } finally {
      }
    }

    loadMotivosCaja()
  }, [])

  const handleSelectChange = (event) => {
    const selectedId = Number(event.target.value) // Convertir el valor a número
    setSelectedMotivoId(selectedId) // Actualizar el motivo seleccionado

    const selectedOption = motivos.find((option) => option.id === selectedId)
    if (selectedOption) {
      // Enviar un objeto con `id` y `motivo` al componente padre
      onChange({ id: selectedId, motivo: selectedOption.motivo })
    } else {
      onChange({}) // Enviar null si no hay selección válida
    }
  }

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
          value={selectedMotivoId || ''} // Asignar el valor seleccionado o vacío
          aria-label="Seleccionar motivo de la caja" // Mejorar accesibilidad
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
  )
}

export default SelectMotivosCaja
