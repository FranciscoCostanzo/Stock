import { useContext, useEffect, useState } from 'react'
import { obtenerArticuloEmpleado, obtenerTarjetas } from '../lib/libVentas'
import { AuthContext } from '../../Auth/context/AuthContext'
import TablesProductos from '../../Components/Table/TablesProductos'
import BtnGeneral from '../../Components/Btns/BtnGeneral'
import { toast } from 'react-toastify'

const FormVentas = () => {
  const { user } = useContext(AuthContext)

  // Variables Efectivo
  // Variables UI Efectivo
  const [entrega, setEntrega] = useState(0)
  const [cambio, setCambio] = useState(0)
  // Variables FormData Efectivo
  const [totalVenta, setTotalVenta] = useState(0)
  //

  const [resto, setResto] = useState(0)
  const [totalFinal, setTotalFinal] = useState(0)
  const [cargasVentas, setCargasVentas] = useState([])
  const [finalizado, setFinalizado] = useState(false)

  const [tarjetas, setTarjetas] = useState([])

  const optionsFormaDePago = ['Efectivo', 'Tarjeta']

  const truncarADosDecimales = (num) => {
    return Math.trunc(num * 100) / 100
  }

  const [dataVentasFields, setDataVentasFields] = useState({
    metodo_de_pago: '',
    adelanto: 0,
    id_tarjeta: 0,
    cuotas: 0,
    total_venta: 0,
    nombre_cliente: '',
    apellido_cliente: '',
    dni_cliente: 0,
    porcentaje: 0,
    aumento: 0
  })

  useEffect(() => {
    const adelantoField =
      dataVentasFields.metodo_de_pago === 'Tarjeta' ? dataVentasFields.adelanto : 0
    const nuevoResto = totalVenta - adelantoField
    if (adelantoField > totalVenta) {
      setResto('No se pueden poner valores mayores al total')
    } else {
      setResto(nuevoResto)
    }

    setDataVentasFields((prevData) => ({
      ...prevData,
      total_venta: totalVenta,
      adelanto: adelantoField
    }))
  }, [dataVentasFields.metodo_de_pago, totalVenta, dataVentasFields.adelanto])

  const construirFormDataDinamico = () => {
    return cargasVentas.map((articulo) => {
      const precioTotalArticulo = articulo.Precio * articulo.Cantidad
      const esTarjeta = dataVentasFields.metodo_de_pago === 'Tarjeta'
      const esPorcentajeEnTarjeta =
        dataVentasFields.metodo_de_pago === 'Tarjeta' && dataVentasFields.porcentaje > 0
      const adelanto = esTarjeta
        ? truncarADosDecimales((precioTotalArticulo / totalVenta) * dataVentasFields.adelanto)
        : 0
      const porcentajePorUsarTarjeta = esTarjeta
        ? dataVentasFields.aumento > 0
          ? dataVentasFields.aumento
          : 0
        : 0

      const total_venta = esPorcentajeEnTarjeta
        ? truncarADosDecimales(
          truncarADosDecimales(precioTotalArticulo - adelanto) +
          truncarADosDecimales(precioTotalArticulo - adelanto) *
          (parseFloat(dataVentasFields.porcentaje) / 100)
        )
        : truncarADosDecimales(precioTotalArticulo - adelanto)

      return {
        id_usuario: user.id,
        id_sucursal: user.sucursal.id,
        id_mercaderia: articulo.Artículo,
        cantidad: articulo.Cantidad,
        metodo_de_pago: dataVentasFields.metodo_de_pago.toLowerCase(),
        id_tarjeta: esTarjeta ? dataVentasFields.id_tarjeta : 0,
        nombre_cliente: esTarjeta ? dataVentasFields.nombre_cliente : '',
        apellido_cliente: esTarjeta ? dataVentasFields.apellido_cliente : '',
        dni_cliente: esTarjeta ? dataVentasFields.dni_cliente : 0,
        adelanto: adelanto,
        cuotas: esTarjeta ? dataVentasFields.cuotas : 0,
        total_venta: total_venta + total_venta * (porcentajePorUsarTarjeta / 100)
      }
    })
  }

  useEffect(() => {
    const loadTarjetas = async () => {
      try {
        let data = await obtenerTarjetas()
        if (JSON.stringify(data) !== JSON.stringify(tarjetas)) {
          setTarjetas(data)
        }
      } catch (error) {
        console.log('Error al cargar tarjetas:', error.message)
      }
    }
    loadTarjetas()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    const newFields = {
      ...dataVentasFields,
      [name]: value
    }

    if (newFields.metodo_de_pago === 'Efectivo') {
      newFields.adelanto = 0
      newFields.id_tarjeta = 0
      newFields.cuotas = 0
      newFields.porcentaje = 0
    }

    setDataVentasFields(newFields)
  }

  const [dataArticulo, setDataArticulo] = useState({ message: '' });
  const [articuloAComprar, setArticuloAComprar] = useState('');

  const handlePedirPrecioArticulo = async () => {
    const articuloTrimmed = articuloAComprar.trim();

    if (!articuloTrimmed) {
      toast.warn('El campo de artículo está vacío');
      return;
    }

    try {
      const data = await obtenerArticuloEmpleado(articuloTrimmed, user.sucursal.id);
      setDataArticulo(data); // Set the state with the fetched data
    } catch (error) {
      console.error(error);

      if (error.response) {
        const { error: errorCode, message } = error.response.data;

        switch (errorCode) {
          case "NoStock":
            toast.warn(message);
            setDataArticulo({ message }); // Set dataArticulo with an object containing the message
            break;
          case "NoArticulo":
            toast.warn(message);
            setDataArticulo({ message }); // Set dataArticulo with an object containing the message
            break;
          case "ServerError":
            toast.error(message);
            setDataArticulo({ message }); // Set dataArticulo with an object containing the message
            break;
          default:
            toast.error("Ocurrió un error inesperado.");
            setDataArticulo({ message: "Ocurrió un error inesperado." }); // Default message
            break;
        }
      } else {
        toast.error("No hay stock disponible o el artículo no existe.");
        setDataArticulo({ message: "Error al conectar con el servidor." }); // Default message
      }
    }
  };
  
  

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
    setTotalVenta(sumaTotal)
  }, [cargasVentas])

  const handleFinalizarPago = () => {
    setFinalizado((prev) => !prev)
  }

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

  useEffect(() => {
    let idBuscado = parseFloat(dataVentasFields.id_tarjeta)
    const aumentoPorUsarTarjeta = tarjetas.find((tarjeta) => tarjeta.id === idBuscado)

    // Inicializamos el resultado con el valor actual de 'resto'
    let resultado = resto

    // Si existe un aumento por usar tarjeta, lo sumamos al total
    if (aumentoPorUsarTarjeta && resto > 0) {
      resultado += resto * (aumentoPorUsarTarjeta.aumento / 100)

      // Si también hay un porcentaje adicional por las cuotas, lo sumamos al total después del aumento por tarjeta
      if (dataVentasFields.porcentaje > 0 && dataVentasFields.cuotas > 1) {
        resultado += resultado * (dataVentasFields.porcentaje / 100)
      } else {
        setDataVentasFields((prevData) => ({
          ...prevData,
          porcentaje: 0
        }))
      }

      // Actualizamos el campo de aumento en 'dataVentasFields' solo si ha cambiado
      if (aumentoPorUsarTarjeta.aumento !== dataVentasFields.aumento) {
        setDataVentasFields((prevData) => ({
          ...prevData,
          aumento: aumentoPorUsarTarjeta.aumento
        }))
      }
    } else {
      // Si no hay aumento por tarjeta, lo reseteamos
      setDataVentasFields((prevData) => ({
        ...prevData,
        aumento: 0
      }))
    }

    // Actualizamos el total final solo si el resultado cambia
    if (resultado !== totalVenta) {
      setTotalFinal(resultado)
    }
  }, [
    dataVentasFields.porcentaje,
    dataVentasFields.cuotas,
    dataVentasFields.id_tarjeta,
    resto,
    tarjetas,
    totalVenta
  ])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      // Crear el formData dinámico
      const formDataDinamico = construirFormDataDinamico()
      const response = await fetch('http://localhost:3000/venta', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formDataDinamico),
        credentials: 'include'
      })

      if (!response.ok) {
        const errorData = await response.json()
        const errorMessage = errorData.errors ? errorData.errors.join(', ') : errorData.error
        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      toast.success('Haz realizado una venta', {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        theme: 'light'
      })
      window.location.reload()
    } catch (error) {
      console.error('Error al enviar datos:', error.message)
      toast.error('Error al intentar iniciar sesión: ' + error.message, {
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
  Descripción: <strong>{dataArticulo && dataArticulo.Descripcion ? dataArticulo.Descripcion : dataArticulo.message}</strong>
</p>
<p>
  Precio de venta: <strong>{dataArticulo && dataArticulo.Precio ? `$${dataArticulo.Precio}` : ''}</strong>
</p>

        </article>
        <BtnGeneral
          tocar={finalizado ? null : handleCargarArticulo}
          claseBtn={finalizado ? 'btn__cargar btn__silenciado' : 'btn__cargar'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 4h-6a3 3 0 0 0 -3 3v7" />
            <path d="M13 10l-4 4l-4 -4m8 5l-4 4l-4 -4" />
          </svg>
          Cargar Artículo
        </BtnGeneral>
        {cargasVentas.length > 0 && (
          <>
            <BtnGeneral
              tocar={finalizado ? null : handleDescargarArticulo}
              claseBtn={finalizado ? 'btn__descargar btn__silenciado' : 'btn__descargar'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
                <path d="M12 9l0 3" />
                <path d="M12 15l.01 0" />
              </svg>
              Anular Ultimo Artículo
            </BtnGeneral>
            <BtnGeneral
              tocar={finalizado ? null : handleDescargarTodo}
              claseBtn={finalizado ? '__todo btn__silenciado' : '__todo'}
            >
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
        <div tipodetabla="ventas" className="table-wrapper">
          <TablesProductos ventas={true} data={cargasVentas} />
        </div>
      </div>
      <div className="pasarela__de__pago">
        {cargasVentas.length > 0 && (
          <>
            <BtnGeneral tocar={handleFinalizarPago} claseBtn="btn__finalizar">
              <>
                {finalizado ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M13 14l-4 -4l4 -4" />
                      <path d="M8 14l-4 -4l4 -4" />
                      <path d="M9 10h7a4 4 0 1 1 0 8h-1" />
                    </svg>
                    Seguir Comprando
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </>
            </BtnGeneral>
            {finalizado && (
              <article className="contendor__pasarela">
                <div className="pasarela">
                  <div className="flex">
                    <label>
                      <select
                        value={dataVentasFields.metodo_de_pago}
                        onChange={handleChange}
                        className="input"
                        name="metodo_de_pago"
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
                  {dataVentasFields.metodo_de_pago === 'Efectivo' && (
                    <>
                      <div className="flex">
                        <label>
                          <input onChange={handleEntregaChange} type="number" className="input" />
                          <span>Entrega</span>
                        </label>
                      </div>
                      <p>Cambio: {cambio}</p>
                      <button onClick={handleSubmit}>Guardar Venta</button>
                    </>
                  )}
                  {dataVentasFields.metodo_de_pago === 'Tarjeta' && (
                    <>
                      <div className="flex">
                        <label>
                          <input
                            value={dataVentasFields.adelanto}
                            onChange={handleChange}
                            type="number"
                            name="adelanto"
                            className="input"
                          />
                          <span>Adelanto</span>
                        </label>
                      </div>
                      <p>Resto: {resto}</p>

                      {dataVentasFields.adelanto >= 0 && (
                        <>
                          <div className="flex">
                            <label>
                              <select
                                onChange={handleChange}
                                value={dataVentasFields.id_tarjeta}
                                className="input"
                                name="id_tarjeta"
                                required
                              >
                                <option value="">Seleccione una opción</option>
                                {tarjetas.map((tarjeta, optIndex) => (
                                  <option key={optIndex} value={tarjeta.id}>
                                    {tarjeta.tipo_tarjeta}
                                  </option>
                                ))}
                              </select>
                              <span>Tipo de tarjeta</span>
                            </label>
                          </div>
                          {dataVentasFields.id_tarjeta >= 1 && (
                            <>
                              <div className="flex">
                                <label>
                                  <select
                                    onChange={handleChange}
                                    value={dataVentasFields.cuotas}
                                    name="cuotas"
                                    className="input"
                                    required
                                  >
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
                              <p>
                                {dataVentasFields.cuotas} Cuota de{' '}
                                {totalFinal / dataVentasFields.cuotas}
                              </p>
                              <div className="flex">
                                <label>
                                  <input
                                    value={dataVentasFields.nombre_cliente}
                                    onChange={handleChange}
                                    type="text"
                                    name="nombre_cliente"
                                    className="input"
                                  />
                                  <span>Nombre Cliente</span>
                                </label>
                              </div>
                              <div className="flex">
                                <label>
                                  <input
                                    value={dataVentasFields.apellido_cliente}
                                    onChange={handleChange}
                                    type="text"
                                    name="apellido_cliente"
                                    className="input"
                                  />
                                  <span>Apellido Cliente</span>
                                </label>
                              </div>
                              <div className="flex">
                                <label>
                                  <input
                                    value={dataVentasFields.dni_cliente}
                                    onChange={handleChange}
                                    type="text"
                                    name="dni_cliente"
                                    className="input"
                                  />
                                  <span>DNI Cliente</span>
                                </label>
                              </div>
                              <BtnGeneral claseBtn="btn__guardar__venta" tocar={handleSubmit}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                  <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                  <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                  <path d="M17 17h-11v-14h-2" />
                                  <path d="M6 5l14 1l-1 7h-13" />
                                </svg>
                                Guardar Venta
                              </BtnGeneral>
                              {dataVentasFields.cuotas > 1 && (
                                <>
                                  <div className="flex">
                                    <label>
                                      <input
                                        onChange={handleChange}
                                        type="number"
                                        name="porcentaje"
                                        className="input"
                                      />
                                      <span>Interes en (%)</span>
                                    </label>
                                  </div>
                                </>
                              )}
                              <p className="total__tarjeta">Total para tarjeta: ${totalFinal}</p>
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
