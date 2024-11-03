import { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import ContenedorPages from '../Components/Contenedor/ContenedorPages'
import { obtenerCajaPorSucursal } from './lib/libCaja'
import { AuthContext } from '../Auth/context/AuthContext'
import SelectMotivosCaja from './components/SelectMotivosCaja'
import { toast } from 'react-toastify'
import BtnGeneral from '../Components/Btns/BtnGeneral'

const Caja = () => {
    const { user } = useContext(AuthContext)
    const [caja, setCaja] = useState(null)
    const [loading, setLoading] = useState(true)
    const [dataCajaFields, setDataCajaFields] = useState({
        monto: 0,
        sobrante: 0
    })
    const [cajaEntries, setCajaEntries] = useState([]) // Array que almacena las entradas de caja
    if (caja) {
        var totalCaja = parseFloat(caja.totalEfectivoVentas) + parseFloat(caja.totalAdelanto)
    }

    useEffect(() => {
        const loadCaja = async () => {
            try {
                if (user) {
                    const data = await obtenerCajaPorSucursal(user.sucursal.id)
                    setCaja(data)
                }
            } catch (error) {
                toast.error(data.message)
                console.log('Error al cargar la caja:', error.message)
            } finally {
                setLoading(false)
            }
        }
        loadCaja()
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setDataCajaFields({
            ...dataCajaFields,
            [name]: value
        })
    }

    const [motivoSeleccionado, setMotivoSeleccionado] = useState({});

    const handleMotivoChange = (motivo) => {
      setMotivoSeleccionado(motivo); // Guardar el objeto con `id` y `motivo`
    };

    // const handleMotivoChange = (id) => {
    //     setSelectedMotivoId(id)
    // }

    const truncarADosDecimales = (num) => {
        return Math.trunc(num * 100) / 100
    }

    const calcularFondo = () => {
        const totalMontos = cajaEntries.reduce((total, entry) => total + entry.monto, 0)
        const fondoFinal = totalCaja - totalMontos
        return truncarADosDecimales(fondoFinal)
    }

    const isFondoAvailable = () => calcularFondo() > 0

    const handleAddEntry = () => {
        const { monto } = dataCajaFields
        const montoNumerico = Number(monto)

        if (motivoSeleccionado.id === null) {
            toast.error('Debes seleccionar un motivo')
            return
        }

        // Verificar que el monto no exceda el efectivo disponible
        if (montoNumerico > calcularFondo()) {
            toast.error(`No puedes usar más de ${calcularFondo()} en efectivo`)
            return
        }

        // Verificar que el motivo no se haya seleccionado antes
        if (cajaEntries.some((entry) => entry.id_motivo === motivoSeleccionado.id)) {
            toast.error('Ya has seleccionado este motivo, elige otro.')
            return
        }

        let fondoFinal
        let sobranteFinal = motivoSeleccionado.id === 2 ? Number(dataCajaFields.sobrante) : 0

        // // Si se selecciona motivo 2, restar el monto acumulado antes de agregar la última entrada
        // if (selectedMotivoId === 2) {
        //     const totalMontos = cajaEntries.reduce((total, entry) => total + entry.monto, 0)
        //     const totalConNuevoMonto = totalMontos + montoNumerico

        //     // Calcular el fondo con el nuevo monto incluido
        //     fondoFinal = truncarADosDecimales(totalCaja - totalConNuevoMonto)

        //     // Si el fondo es mayor a 0, mostrar error y no permitir agregar sobrante
        //     if (fondoFinal > 0) {
        //         toast.error(
        //             `Aún tienes un fondo disponible de ${fondoFinal}. Debes cerrar la caja antes de agregar sobrante.`
        //         )
        //         return
        //     }
        // }

        // Crear nueva entrada
        const newEntry = {
            monto: montoNumerico,
            sobrante: sobranteFinal, // Asegurarse de que el sobrante sea 0 si fondo > 0
            fondo: motivoSeleccionado.id === 2 ? fondoFinal : 0,
            id_motivo: motivoSeleccionado.id,
            id_usuario: user.id,
            id_sucursal: user.sucursal.id
        }

        // Agregar nueva entrada al array
        setCajaEntries([...cajaEntries, newEntry])
        setDataCajaFields({ monto: 0, sobrante: 0 }) // Resetear los campos
        setMotivoSeleccionado({}) // Resetear motivo
        toast.success('Entrada agregada exitosamente')
    }

    console.log(cajaEntries)

    // Función para cerrar la caja y enviar los datos al endpoint
    const handleCerrarCaja = async () => {
        try {
            const response = await fetch('http://localhost:3000/cerrar-caja', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cajaEntries), // Enviar el array de entradas en el cuerpo de la solicitud
                credentials: 'include' // Si es necesario enviar cookies
            })

            if (!response.ok) {
                throw new Error('Error al cerrar la caja')
            }

            toast.success('Caja cerrada exitosamente')
            setCajaEntries([]) // Limpiar las entradas de la caja después de cerrarla
        } catch (error) {
            toast.error('Error al cerrar la caja')
            console.log('Error:', error.message)
        }
    }

    // Verificar si el motivo con id 2 está en el array
    const isMotivoRendicionInEntries = cajaEntries.some((entry) => entry.id_motivo === 2)

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
                        {caja.message ? (
                            <p>{caja.message}</p>
                        ) : (
                            <>
                                <article className="detalle__caja">
                                    <div className="contenedor__info__caja">
                                        <p>
                                            Cantidad de ventas en efectivo: <strong>{caja.cantidadEfectivo}</strong>
                                        </p>
                                        <p>
                                            Total de ventas en efectivo: <strong>${caja.totalEfectivoVentas}</strong>{' '}
                                        </p>
                                    </div>
                                    <div className="contenedor__info__caja">
                                        <p>
                                            Cantidad de ventas con tarjeta: <strong>{caja.cantidadTarjeta}</strong>{' '}
                                        </p>
                                        <p>
                                            Total de ventas con tarjeta: <strong>${caja.totalTarjeta}</strong>
                                        </p>
                                    </div>
                                    {cajaEntries.length > 0 && (
                                        <div className="contenedor__info__caja">
                                            <h2>La caja se va a cerrar con:</h2>
                                            {/* Mostrar entradas actuales */}
                                            {cajaEntries.map((entry, index) => (
                                                <p key={index}>
                                                    Motivo: {entry.id_motivo}, Monto: ${entry.monto}, Sobrante: $
                                                    {entry.sobrante}
                                                </p>
                                            ))}
                                        </div>
                                    )}
                                </article>
                                <p className="total__ventas__dia">Total de ventas del día: ${caja.totalVentas}</p>
                                <p className="total__efectivo__dia">Total Adelantos: ${caja.totalAdelanto}</p>
                                <p className="total__efectivo__dia">Total fondo acumulado: ${caja.fondo}</p>
                                <p className="total__efectivo__dia">Efectivo de la Caja: ${calcularFondo()}</p>
                                <h2>Cerrar caja:</h2>

                                <SelectMotivosCaja onChange={handleMotivoChange} />

                                <div className="flex">
                                    <label>
                                        <input
                                            value={dataCajaFields.monto}
                                            onChange={handleChange}
                                            type="number"
                                            name="monto"
                                            className="input"
                                            placeholder="Monto a salir"
                                        />
                                        <span>Monto a salir</span>
                                    </label>
                                </div>

                                {motivoSeleccionado.id === 2 && (
                                    <div className="flex">
                                        <label>
                                            <input
                                                value={dataCajaFields.sobrante}
                                                onChange={handleChange}
                                                type="number"
                                                name="sobrante"
                                                className="input"
                                                placeholder="Sobrante"
                                            />
                                            <span>Sobrante</span>
                                        </label>
                                    </div>
                                )}

                                {/* Botón para agregar entrada */}
                                <BtnGeneral tocar={handleAddEntry}>
                                    <svg viewBox="0 0 24 24">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                        <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                                        <path d="M14 11h-2.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3h-2.5" />
                                        <path d="M12 17v1m0 -8v1" />
                                    </svg>
                                    Agregar
                                </BtnGeneral>

                                {/* Botón para cerrar la caja */}
                                {isMotivoRendicionInEntries && (
                                    <BtnGeneral tocar={handleCerrarCaja}>
                                        <svg viewBox="0 0 24 24">
                                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                            <path d="M9 14c0 1.657 2.686 3 6 3s6 -1.343 6 -3s-2.686 -3 -6 -3s-6 1.343 -6 3z" />
                                            <path d="M9 14v4c0 1.656 2.686 3 6 3s6 -1.344 6 -3v-4" />
                                            <path d="M3 6c0 1.072 1.144 2.062 3 2.598s4.144 .536 6 0c1.856 -.536 3 -1.526 3 -2.598c0 -1.072 -1.144 -2.062 -3 -2.598s-4.144 -.536 -6 0c-1.856 .536 -3 1.526 -3 2.598z" />
                                            <path d="M3 6v10c0 .888 .772 1.45 2 2" />
                                            <path d="M3 11c0 .888 .772 1.45 2 2" />
                                        </svg>
                                        Cerrar Caja
                                    </BtnGeneral>
                                )}
                            </>
                        )}
                    </ContenedorPages>
                </section>
            )}
        </>
    )
}

export default Caja
