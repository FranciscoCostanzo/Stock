import { urlEndpoint } from "../../lib"

export const obtenerArticuloPedidos = async (idMercadeia) => {
  try {
    const response = await fetch(`${urlEndpoint}/articulo-pedidos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        id_mercaderia: idMercadeia
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
export const obtenerPedidosAdmin = async () => {
  try {
    const response = await fetch(`${urlEndpoint}/ver-pedidos-admin`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
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

export const obtenerPedidosEmpleado = async (idSucursal) => {
  try {
    const response = await fetch(`${urlEndpoint}/ver-pedidos-empleado/${idSucursal}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
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

export const obtenerPedidosEmpleadoPendientes = async (idSucursal) => {
  try {
    const response = await fetch(`${urlEndpoint}/ver-pedidos-empleado-pendientes/${idSucursal}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
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

export const obtenerPedidosEmpleadoRecibidos = async (idSucursal) => {
  try {
    const response = await fetch(`${urlEndpoint}/ver-pedidos-empleado-recibidos/${idSucursal}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
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