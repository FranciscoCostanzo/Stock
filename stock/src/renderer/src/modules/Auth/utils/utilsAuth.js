export const userDataSession = () => {
    const userDataString = localStorage.getItem("userData");
    return JSON.parse(userDataString);
  };

  export const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }

// http fetching para toda la app
export const fetchData = async (url, method, data = null) => {
  try {
      const options = {
          method,
          headers: {
              'Content-Type': 'application/json'
          }
      };

      if (data) {
          options.body = JSON.stringify(data);
      }

      const response = await fetch(url, options);
      if (!response.ok) {
          throw new Error('Error al realizar la solicitud');
      }
      return await response.json();
  } catch (error) {
      console.error('Error de red:', error);
      throw error;
  }
};

export const handleMeterEnCarrito = async (actualizarCart, productoID) => {
  const userData = userDataSession();
  const clienteID = userData.user.id_cliente
    try {
        const data = { cantidad: 1, cliente_id: clienteID, producto_id: productoID};
        const response = await fetchData(
            "http://localhost:4000/agregar_carrito",
            "POST",
            data
        );
        actualizarCart()
    } catch (error) {
        console.error("Error al enviar datos:", error);
    }
};




