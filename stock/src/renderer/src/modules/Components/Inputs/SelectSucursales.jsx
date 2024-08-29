import { useEffect, useState } from 'react';
import { fetchSucursales } from '../../Auth/lib/libAuth';

const SelectSucursales = ({ onChange }) => {
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    // Obtener sucursales del servidor
    const loadSucursales = async () => {
      try {
        const data = await fetchSucursales();
        setSucursales(data); // Guardar las sucursales completas
      } catch (error) {
        console.log(error.message);
      }
    };

    loadSucursales();
  }, []);

  const sucursalSelect = [
    {
      label: 'Sucursal',
      name: 'sucursal',
      type: 'select',
      options: sucursales,
    },
  ];

  const handleSelectChange = (event) => {
    const selectedSucursalId = Number(event.target.value); // Convertir a número
    const selectedOption = sucursales.find(option => option.id === selectedSucursalId);

    if (selectedOption) {
      const concatenatedText = `${selectedOption.ciudad} - ${selectedOption.nombre}`;
      onChange(selectedSucursalId, concatenatedText); // Enviar ambos valores al componente padre
    } else {
      onChange(null, null); // Enviar null si no hay selección válida
    }
  };

  return (
    <div className="flex">
      <label>
        {sucursalSelect.map((sucursal, i) => (
          <select
            key={i}
            name={sucursal.name}
            className="input"
            required
            onChange={handleSelectChange} // Manejar el cambio de selección
          >
            <option value="">Seleccione una opción</option>
            {sucursal.options.map((option, optIndex) => (
              <option key={optIndex} value={option.id}>
                {`${option.ciudad} - ${option.nombre}`}
              </option>
            ))}
          </select>
        ))}
        <span>Sucursal</span>
      </label>
    </div>
  );
};

export default SelectSucursales;
