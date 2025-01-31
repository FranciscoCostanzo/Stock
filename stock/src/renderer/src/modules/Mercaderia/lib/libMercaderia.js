import { urlEndpoint } from '../../lib'

// Función para obtener el stock por sucursal

export const obtenerStockPorSucursal = async (idSucursal) => {
  try {
    const response = await fetch(`${urlEndpoint}/stock/${idSucursal}`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al obtener el stock.')
    }

    const data = await response.json()
    return data // Retornar los datos
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error // Propagar el error para que sea manejado más arriba
  }
}

// Función para obtener el stock para el admin
export const obtenerStockAdmin = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/stock`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al obtener el stock.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error
  }
}

// Función para obtener el stock para el admin
export const obtenerMercaderiaAdmin = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/mercaderia`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al obtener el stock.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error
  }
}

export const obtenerPapeleraAdmin = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/papelera`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al obtener el stock.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error
  }
}

export const obtenerFallasAdmin = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/fallas`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al obtener el stock.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error
  }
}

export const obtenerFallasEmpelado = async (idSucursal) => {
  try {
    const response = await fetch(`${urlEndpoint}/fallas/${idSucursal}`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al obtener el stock.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error
  }
}

export const obtenerInversionAdmin = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/inversion`, {
      method: 'GET',
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Error al obtener el stock.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error en la solicitud:', error)
    throw error
  }
}
