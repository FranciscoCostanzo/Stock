import { urlEndpoint } from '../../lib'

// Función para obtener la caja por sucursal
export const obtenerCajaPorSucursal = async (idSucursal) => {
  try {
    const response = await fetch(`${urlEndpoint}/caja/${idSucursal}`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al obtener la caja.')
    }

    const data = await response.json()
    return data // Retornar los datos
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error // Propagar el error para que sea manejado más arriba
  }
}

export const obtenerMotivosCaja = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/motivos-caja`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al obtener la caja.')
    }

    const data = await response.json()
    return data // Retornar los datos
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error // Propagar el error para que sea manejado más arriba
  }
}
export const obtenerCajaAdmin = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/caja-admin`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al obtener la caja para el admin.')
    }

    const data = await response.json()
    return data // Retornar los datos
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error // Propagar el error para que sea manejado más arriba
  }
}
