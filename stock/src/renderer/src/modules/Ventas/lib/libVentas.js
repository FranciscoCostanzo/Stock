import { urlEndpoint } from "../../lib"


export const obtenerArticuloEmpleado = async (idMercadeia, idSucursal) => {
  try {
    const response = await fetch(`${urlEndpoint}/articulo-empleado`, {
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
    const response = await fetch(`${urlEndpoint}/tarjetas`, {
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

export const obtenerVentasAdmin = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/ventas-admin`, {
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

export const obtenerVentasSucursal = async (idSucursal) => {
  try {
    const response = await fetch(`${urlEndpoint}/ventas-sucursal/${idSucursal}`, {
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
