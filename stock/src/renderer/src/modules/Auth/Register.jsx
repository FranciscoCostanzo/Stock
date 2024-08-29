import { useEffect, useState } from 'react'
import Form from './components/FormAuth'
import { fetchSucursales } from './lib/libAuth.js'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver.jsx'

const Register = () => {
  const [sucursales, setSucursales] = useState([])

  useEffect(() => {
    const loadSucursales = async () => {
      try {
        const data = await fetchSucursales()
        // Suponiendo que `data` es un array de objetos con propiedades `nombre` y `ciudad`
        setSucursales(data.map((sucursal) => `${sucursal.ciudad} - ${sucursal.nombre}`))
      } catch (error) {
        console.log(error.message)
      }
    }

    loadSucursales()
  }, [])

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
    }
  ]

  return (
    <section style={{ position: 'relative' }}>
      <BtnVolver donde="/configuracion" />
      <Form fields={camposRegistro} tipoDeForm={true} endpoint="http://localhost:3000/register" />
    </section>
  )
}

export default Register
