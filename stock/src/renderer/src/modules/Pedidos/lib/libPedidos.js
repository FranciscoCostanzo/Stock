export const obtenerArticuloPedidos = async (idMercadeia) => {
  try {
    const response = await fetch(`http://localhost:3000/articulo-pedidos`, {
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
    const response = await fetch(`http://localhost:3000/ver-pedidos-admin`, {
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
    const response = await fetch(`http://localhost:3000/ver-pedidos-empleado/${idSucursal}`, {
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
    const response = await fetch(`http://localhost:3000/ver-pedidos-empleado-pendientes/${idSucursal}`, {
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