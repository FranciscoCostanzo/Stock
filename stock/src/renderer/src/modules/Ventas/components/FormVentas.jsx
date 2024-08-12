import { useContext, useState } from 'react'
import { obtenerArticuloEmpleado } from '../lib/libVentas'
import { AuthContext } from '../../Auth/context/AuthContext'
import TablesProductos from '../../Components/Table/TablesProductos'

const FormVentas = ({ fields }) => {
  const [cargasVentas, setCargasVentas] = useState([])

  const initialState = fields.reduce((acc, campo) => {
    return { ...acc, [campo.name]: '' }
  }, {})
  const [formData, setFormData] = useState(initialState)
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      let formDataToSend = { ...formData }

      const response = await fetch(endpoint, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataToSend),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.errors ? errorData.errors.join(', ') : errorData.error
        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      console.log(responseData)

      toast.success('Haz relizado una venta', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light'
      })
    } catch (error) {
      console.error('Error al enviar datos:', error.message)
      toast.error('Error al intentar iniciar sesión:' + error.message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light'
      })
    }
  }

  const [articuloAComprar, setArticuloAComprar] = useState('') // Inicializado como string vacío
  const { user } = useContext(AuthContext)
  const [dataArticulo, setDataArticulo] = useState(null) // Inicializa como null para indicar que no hay datos

  const handlePedirPrecioArticulo = async () => {
    const articuloTrimmed = articuloAComprar.trim() // Elimina los espacios en blanco al principio y al final

    if (!articuloTrimmed) {
      console.error('El campo de artículo está vacío')
      return // Salir de la función si el campo está vacío
    }

    try {
      const data = await obtenerArticuloEmpleado(articuloTrimmed, user.sucursal.id)
      setDataArticulo(data) // Actualiza con los datos obtenidos
      console.log(data)
    } catch (error) {
      console.error(error)
      setDataArticulo(null) // Restablece a null si hay un error
    }
  }

  const handleChangeArticuloAComprar = (e) => {
    setArticuloAComprar(e.target.value) // Actualiza el estado con el valor del input
  }

  const handleCargarArticulo = () => {
    if (dataArticulo) {
      console.log(dataArticulo)
      setCargasVentas((prevCargas) => {
        // Verificar si ya existe un artículo con el mismo id_mercaderia y Descripcion
        const articuloExistente = prevCargas.find(
          (articulo) =>
            articulo.id_mercaderia === dataArticulo.id_mercaderia &&
            articulo.Descripcion === dataArticulo.Descripcion
        )

        if (articuloExistente) {
          // Si existe, incrementa la cantidad
          return prevCargas.map((articulo) =>
            articulo.id_mercaderia === dataArticulo.id_mercaderia &&
            articulo.Descripcion === dataArticulo.Descripcion
              ? { ...articulo, Cantidad: articulo.Cantidad + 1 }
              : articulo
          )
        } else {
          // Si no existe, agrega un nuevo artículo a la lista
          return [...prevCargas, { ...dataArticulo, Cantidad: 1 }]
        }
      })
      setDataArticulo(null) // Resetea el dataArticulo después de cargarlo
    } else {
      console.error('No hay datos de artículo para cargar.')
    }
  }

  console.log(cargasVentas.length)
  return (
    <>
      <div className="contenedor__busqueda">
        <section className="busqueda">
          <div className="flex">
            <label>
              <input
                value={articuloAComprar}
                onChange={handleChangeArticuloAComprar} // Asocia el manejador de cambio
                type="number"
                name="id_mercaderia"
                className="input"
              />
              <span>Artículo</span>
            </label>
          </div>
          <p className="btn__consultar__precio" onClick={handlePedirPrecioArticulo}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
            Consultar Precio
          </p>
        </section>
        <section className="resultado">
          <p>
            Descripción: <strong>{dataArticulo && <>{dataArticulo.Descripcion}</>}</strong>{' '}
          </p>
          <p>
            Precio de venta: <strong>${dataArticulo && <>{dataArticulo.Precio}</>}</strong>{' '}
          </p>
        </section>
        <p onClick={handleCargarArticulo} className="btn__cargar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 4h-6a3 3 0 0 0 -3 3v7" />
            <path d="M13 10l-4 4l-4 -4m8 5l-4 4l-4 -4" />
          </svg>
          Cargar Artículo
        </p>
        <p onClick={handleCargarArticulo} className="btn__descargar">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
            <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
            <path d="M12 9l0 3" />
            <path d="M12 15l.01 0" />
          </svg>
          Anular Ultimo Artículo
        </p>
      </div>
      <TablesProductos data={cargasVentas} />
    </>
  )
}

export default FormVentas
