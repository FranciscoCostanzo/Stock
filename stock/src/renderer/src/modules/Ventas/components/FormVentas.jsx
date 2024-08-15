import { useContext, useEffect, useState } from 'react'
import { obtenerArticuloEmpleado } from '../lib/libVentas'
import { AuthContext } from '../../Auth/context/AuthContext'
import TablesProductos from '../../Components/Table/TablesProductos'
import BtnGeneral from '../../Components/Btns/BtnGeneral'

const FormVentas = ({ fields }) => {
  const [tipoDeTarjeta, setTipoDeTarjeta] = useState('')
  const [entrega, setEntrega] = useState(0)
  const [cambio, setCambio] = useState(0)
  const [adelanto, setAdelanto] = useState(0)
  const [resto, setResto] = useState(0)
  const [interes, setInteres] = useState(0)
  const [cuotas, setCuotas] = useState(0)
  const [totalFinal, setTotalFinal] = useState(0)
  const [articuloAComprar, setArticuloAComprar] = useState('') // Inicializado como string vacío
  const { user } = useContext(AuthContext)
  const [dataArticulo, setDataArticulo] = useState(null) // Inicializa como null para indicar que no hay datos
  const [cargasVentas, setCargasVentas] = useState([])
  const [totalVenta, useTotalVenta] = useState(0)
  const [finalizado, setFinalizado] = useState(false)


  const handleResetChange = () => {
    setAdelanto(0)
    setResto(0)
    setTipoDeTarjeta('')
    setEntrega(0)
    setCambio(0)
  }
  const handleTipoDeTarjetaChange = (e) => {
    setTipoDeTarjeta(e.target.value)
  }
  const handleCuotasChange = (e) => {
    setCuotas(e.target.value)
  }

  const [formData, setFormData] = useState({
    metodo_de_pago: '',
    total_venta: 0 // Inicializa total_venta sin lógica dependiente
  });
  
  useEffect(() => {
    const total = formData.metodo_de_pago === "Efectivo" ? totalVenta : totalFinal;
    setFormData((prevData) => ({
      ...prevData,
      total_venta: total
    }));
  }, [formData.metodo_de_pago, totalFinal, totalVenta]);
  

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }))
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()

  //   try {
  //     let formDataToSend = { ...formData }

  //     const response = await fetch(endpoint, {
  //       method: 'POST',
  //       mode: 'cors',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(formDataToSend),
  //       credentials: 'include'
  //     })

  //     if (!response.ok) {
  //       const errorData = await response.json()
  //       const errorMessage = errorData.errors ? errorData.errors.join(', ') : errorData.error
  //       throw new Error(errorMessage)
  //     }

  //     const responseData = await response.json()
  //     console.log(responseData)

  //     toast.success('Haz relizado una venta', {
  //       position: 'top-right',
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: false,
  //       draggable: true,
  //       progress: undefined,
  //       theme: 'light'
  //     })
  //   } catch (error) {
  //     console.error('Error al enviar datos:', error.message)
  //     toast.error('Error al intentar iniciar sesión:' + error.message, {
  //       position: 'top-right',
  //       autoClose: 5000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: false,
  //       draggable: true,
  //       progress: undefined,
  //       theme: 'light'
  //     })
  //   }
  // }


  const handlePedirPrecioArticulo = async () => {
    const articuloTrimmed = articuloAComprar.trim() // Elimina los espacios en blanco al principio y al final

    if (!articuloTrimmed) {
      console.error('El campo de artículo está vacío')
      return // Salir de la función si el campo está vacío
    }

    try {
      const data = await obtenerArticuloEmpleado(articuloTrimmed, user.sucursal.id)
      setDataArticulo(data) // Actualiza con los datos obtenidos
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
    } else {
      console.error('No hay datos de artículo para cargar.')
    }
  }
  const handleDescargarArticulo = () => {
    setCargasVentas((prevCargas) => {
      if (prevCargas.length === 0) {
        console.error('No hay artículos para eliminar.')
        return prevCargas
      }

      // Encuentra el índice del último artículo agregado
      const lastArticuloIndex = prevCargas.length - 1

      const lastArticulo = prevCargas[lastArticuloIndex]

      // Si la cantidad es mayor que 1, simplemente resta uno
      if (lastArticulo.Cantidad > 1) {
        return prevCargas.map((articulo, index) =>
          index === lastArticuloIndex ? { ...articulo, Cantidad: articulo.Cantidad - 1 } : articulo
        )
      } else {
        // Si la cantidad es 1, elimina el artículo de la lista
        return prevCargas.filter((_, index) => index !== lastArticuloIndex)
      }
    })
  }
  const handleDescargarTodo = () => {
    if (cargasVentas.length > 0) {
      setCargasVentas([])
    }
  }

  useEffect(() => {
    const sumaTotal = cargasVentas.reduce((accumulator, carga) => {
      return accumulator + parseFloat(carga.Precio) * carga.Cantidad
    }, 0)
    useTotalVenta(sumaTotal)
  }, [cargasVentas, useTotalVenta])


  const handleFinalizarPago = () => {
    setFinalizado(true)
  }

  const optionsFormaDePago = ['Efectivo', 'Tarjeta']
  const optionsTarjeta = [
    'Visa',
    'MasterCard',
    'Cabal',
    'Debito',
    'Fertil',
    'Maestro',
    'Nativa',
    'Mercado Pago',
    'Cuenta DNI'
  ]

  const handleEntregaChange = (e) => {
    let valor = parseFloat(e.target.value)

    // Si el valor no es un número válido o es negativo
    if (isNaN(valor) || valor <= 0) {
      setCambio(`Debe ingresar un valor válido mayor a 0`)
      setEntrega(0)
    } else if (valor < totalVenta) {
      // Si el valor es menor que el total de la venta
      setCambio(`No se puede entregar menos que ${totalVenta}`)
      setEntrega(valor)
    } else {
      // Si el valor es válido y mayor o igual al total de la venta
      setEntrega(valor)
      setCambio(valor - totalVenta)
    }
  }

  const handleAdelantoChange = (e) => {
    let valor = parseFloat(e.target.value)
    if (isNaN(valor)) {
      setCambio(0)
    } else {
      setAdelanto(valor)
      setResto(totalVenta - valor)
    }
  }

  const handleInteresChange = (e) => {
    setInteres(parseFloat(e.target.value) || 0); // Asegúrate de que el valor sea un número
  };
  
  useEffect(() => {
    if (interes > 0) {
      const resultado = resto + resto * (interes / 100);
      setTotalFinal(resultado);
    }
  }, [interes]); // Solo ejecuta cuando el interés cambia

  console.log(formData)

  return (
    <>
      <div className="contenedor__busqueda">
        <article className="busqueda">
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
          <BtnGeneral tocar={handlePedirPrecioArticulo}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
            Consultar Precio
          </BtnGeneral>
        </article>
        <article className="resultado">
          <p>
            Descripción: <strong>{dataArticulo && <>{dataArticulo.Descripcion}</>}</strong>
          </p>
          <p>
            Precio de venta: <strong>{dataArticulo && <>${dataArticulo.Precio}</>}</strong>
          </p>
        </article>
        <BtnGeneral tocar={handleCargarArticulo} claseBtn="btn__cargar">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 4h-6a3 3 0 0 0 -3 3v7" />
            <path d="M13 10l-4 4l-4 -4m8 5l-4 4l-4 -4" />
          </svg>
          Cargar Artículo
        </BtnGeneral>
        {cargasVentas.length > 0 && (
          <>
            <BtnGeneral claseBtn="btn__descargar" tocar={handleDescargarArticulo}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                <path d="M12 9l0 3" />
                <path d="M12 15l.01 0" />
              </svg>
              Anular Ultimo Artículo
            </BtnGeneral>
            <BtnGeneral claseBtn="__todo" tocar={handleDescargarTodo}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 7l16 0" />
                <path d="M10 11l0 6" />
                <path d="M14 11l0 6" />
                <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
              </svg>
              Anular Todo
            </BtnGeneral>
          </>
        )}
      </div>
      <div className="table__container">
        <div tipoDeTabla="ventas" className="table-wrapper">
          <TablesProductos ventas={true} data={cargasVentas} />
        </div>
      </div>
      <div className="pasarela__de__pago">
        {cargasVentas.length > 0 && (
          <>
            <p onClick={handleFinalizarPago} className="btn__finalizar">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 19h-6a3 3 0 0 1 -3 -3v-8a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v4.5" />
                <path d="M3 10h18" />
                <path d="M16 19h6" />
                <path d="M19 16l3 3l-3 3" />
                <path d="M7.005 15h.005" />
                <path d="M11 15h2" />
              </svg>
              Finalizar
            </p>
            {finalizado && (
              <article className="pasarela">
                <div className="forma__de__pago">
                  <div className="flex">
                    <label>
                      <select
                        // onChange={handleFormaDePagoChange}
                        onChange={handleChange}
                        // value={formaDePago}
                        className="input"
                        name='metodo_de_pago'
                        required
                      >
                        <option value="">Seleccione una opción</option>
                        {optionsFormaDePago.map((option, optIndex) => (
                          <option key={optIndex} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <span>Forma de pago</span>
                    </label>
                  </div>
                  {formData.metodo_de_pago === 'Efectivo' && (
                    <>
                      <div className="flex">
                        <label>
                          <input
                            onChange={handleEntregaChange}
                            type="number"
                            name="id_mercaderia"
                            className="input"
                          />
                          <span>Entrega</span>
                        </label>
                      </div>
                      <p>Cambio: {cambio}</p>
                    </>
                  )}
                  {formData.metodo_de_pago === 'Tarjeta' && (
                    <>
                      <div className="flex">
                        <label>
                          <input
                            onChange={handleAdelantoChange}
                            type="number"
                            name="id_mercaderia"
                            className="input"
                          />
                          <span>Adelanto</span>
                        </label>
                      </div>
                      <p>Resto: {resto}</p>

                      {adelanto >= 0 && (
                        <>
                          <div className="flex">
                            <label>
                              <select
                                onChange={handleTipoDeTarjetaChange}
                                className="input"
                                required
                              >
                                <option value="">Seleccione una opción</option>
                                {optionsTarjeta.map((option, optIndex) => (
                                  <option key={optIndex} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                              <span>Tipo de tarjeta</span>
                            </label>
                          </div>
                          {tipoDeTarjeta.length >= 1 && (
                            <>
                              <div className="flex">
                                <label>
                                  <select onChange={handleCuotasChange} className="input" required>
                                    <option>Seleccione cantidad de cuotas</option>
                                    {[...Array(12).keys()].map((n) => (
                                      <option key={n + 1} value={n + 1}>
                                        {n + 1} cuota(s)
                                      </option>
                                    ))}
                                  </select>
                                  <span>Cuotas</span>
                                </label>
                              </div>
                              {cuotas > 1 && (
                                <>
                                  <div className="flex">
                                    <label>
                                      <input
                                        onChange={handleInteresChange}
                                        type="number"
                                        name="id_mercaderia"
                                        className="input"
                                      />
                                      <span>Interes en (%)</span>
                                    </label>
                                  </div>
                                  {totalFinal}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </article>
            )}
            <p className="totalVenta">Total: ${totalVenta}</p>
          </>
        )}
      </div>
    </>
  )
}

export default FormVentas
