// Función para obtener el stock por sucursal
export const obtenerStockPorSucursal = async (idSucursal) => {
  try {
    const response = await fetch(`http://localhost:3000/mercaderia/${idSucursal}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Error al obtener el stock.');
    }

    const data = await response.json();
    return data; // Retornar los datos
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error; // Propagar el error para que sea manejado más arriba
  }
};