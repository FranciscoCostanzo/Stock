export const obtenerTarjetasAdmin = async () => {
    try {
      const response = await fetch(`http://localhost:3000/tarjetas-admin`, {
        method: 'GET',
        credentials: 'include',
      })
  
      if (!response.ok) {
        throw new Error('Error al obtener las tarjetas.')
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error en la solicitud:', error)
      throw error
    }
  }

  export const obtenerUsuariosAdmin = async () => {
    try {
      const response = await fetch(`http://localhost:3000/usuarios-admin`, {
        method: 'GET',
        credentials: 'include',
      })
  
      if (!response.ok) {
        throw new Error('Error al obtener las tarjetas.')
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error en la solicitud:', error)
      throw error
    }
  }

  export const obtenerSucursalesAdmin = async () => {
    try {
      const response = await fetch(`http://localhost:3000/sucursales-admin`, {
        method: 'GET',
        credentials: 'include',
      })
  
      if (!response.ok) {
        throw new Error('Error al obtener las tarjetas.')
      }
  
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error en la solicitud:', error)
      throw error
    }
  }