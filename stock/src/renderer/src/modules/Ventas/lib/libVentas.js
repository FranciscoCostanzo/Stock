export const obtenerArticuloEmpleado = async (idMercadeia, idSucursal) => {
  try {
    const response = await fetch(`http://localhost:3000/articulo-empleado`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        id_mercaderia: idMercadeia,
        id_sucursal: idSucursal
      })
    })

    if (!response.ok) {
      throw new Error('Error al obtener el Articulo.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error
  }
}

export const obtenerTarjetas = async () => {
  try {
    const response = await fetch(`http://localhost:3000/tarjetas`, {
      method: 'GET',
      credentials: 'include'
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

export const obtenerVentasSemana = async () => {
  try {
    const response = await fetch(`http://localhost:3000/ventas-semana`, {
      method: 'GET',
      credentials: 'include'
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
