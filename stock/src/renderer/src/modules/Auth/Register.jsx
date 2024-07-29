import { useEffect, useState } from 'react';
import Form from './components/Form'
import { fetchSucursales } from './lib/libs'

const Register = () => {
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    const loadSucursales = async () => {
      try {
        const data = await fetchSucursales();
        // Suponiendo que `data` es un array de objetos con propiedades `nombre` y `ciudad`
        setSucursales(data.map(sucursal => `${sucursal.ciudad} - ${sucursal.nombre}`));
      } catch (error) {
        console.log(error.message);
      }
    };

    loadSucursales();
  }, []);

  const camposRegistro = [
    {
      label: 'Rol',
      name: 'rol',
      type: 'select',
      options: ['admin', 'empleado']
    },
    {
      label: 'Sucursal',
      name: 'sucursal',
      type: 'select',
      options: sucursales 
    },
    {
      label: 'Nombre',
      name: 'nombre',
      type: 'text'
    },
    {
      label: 'Contraseña',
      name: 'password',
      type: 'password'
    },
  ]

  

  return (
    <Form dataSucursales={sucursales} fields={camposRegistro} tipoDeForm={true} endpoint="http://localhost:3000/register" />
  )
}

export default Register
