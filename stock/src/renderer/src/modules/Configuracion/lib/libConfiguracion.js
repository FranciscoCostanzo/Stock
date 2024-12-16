import { urlEndpoint } from "../../lib"

export const obtenerTarjetasAdmin = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/tarjetas-admin`, {
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

export const obtenerUsuariosAdmin = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/usuarios-admin`, {
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

export const obtenerSucursalesAdmin = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/sucursales-admin`, {
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
// ${urlEndpoint}/sucursales-admin
export const obtenerMotivosAdmin = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/motivos-caja`, {
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
