// Función para obtener sucursales
export const fetchSucursales = async () => {
  try {
    const response = await fetch('http://localhost:3000/sucursales', {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al obtener las sucursales')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error obteniendo las sucursales:', error)
    throw error // Propagar el error para que pueda ser manejado por el consumidor
  }
}
