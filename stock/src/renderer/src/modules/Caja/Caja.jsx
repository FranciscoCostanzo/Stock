import { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import ContenedorPages from '../Components/Contenedor/ContenedorPages'
import { obtenerCajaPorSucursal } from './lib/libCaja'
import { AuthContext } from '../Auth/context/AuthContext'

const Caja = () => {
    const { user } = useContext(AuthContext)
    const [caja, setCaja] = useState(null) // Cambiado a null para manejar datos vacíos
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadCaja = async () => {
            try {
                if (user) {
                    const data = await obtenerCajaPorSucursal(user.sucursal.id)
                    setCaja(data)
                }
            } catch (error) {
                console.log('Error al cargar la caja:', error.message)
            } finally {
                setLoading(false)
            }
        }

        loadCaja()
    }, [user])

    const [dataCajaFields, setDataCajaFields] = useState({
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

    const handleChange = (e) => {
        const { name, value } = e.target
        const newFields = {
          ...dataCajaFields,
          [name]: value
        }    
        setDataCajaFields(newFields)
      }

    return (
        <>
            {loading ? (
                <section>
                    <div loader="interno" className="contenedor__loader">
                        <span className="loader"></span>
                        <span className="text__loader">Cargando</span>
                    </div>
                </section>
            ) : (
                <section className="ventas">
                    <BtnVolver donde="/inicio" />
                    <ContenedorPages>
                        {caja ? (
                            <>
                                <article className="detalle__caja">
                                    <div className="contenedor__info__caja">
                                        <p>Cantidad de ventas en efectivo: <strong>{caja.cantidadEfectivo}</strong></p>
                                        <p>Total de ventas en efectivo: <strong>${caja.totalEfectivoVentas}</strong> </p>
                                    </div>
                                    <div className="contenedor__info__caja">
                                        <p>Cantidad de ventas con tarjeta: <strong>{caja.cantidadTarjeta}</strong> </p>
                                        <p>Total de ventas con tarjeta: <strong>${caja.totalTarjeta}</strong></p>
                                    </div>
                                </article>
                                <p className='total__ventas__dia'>Total de ventas del día: ${caja.totalVentas}</p>
                                <p className='total__efectivo__dia' >Efectivo de la Caja: ${caja.totalCaja}</p>
                            </>
                        ) : (
                            <p>No hay datos de caja disponibles.</p>
                        )}
                        <h4>Cerrar caja:</h4>
                    </ContenedorPages>
                </section>
            )}
        </>
    )
}

export default Caja
