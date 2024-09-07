import { useContext, useEffect, useState } from 'react';
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver';
import ContenedorPages from '../Components/Contenedor/ContenedorPages';
import { obtenerCajaPorSucursal } from './lib/libCaja';
import { AuthContext } from '../Auth/context/AuthContext';
import SelectMotivosCaja from './components/SelectMotivosCaja';
import { toast} from 'react-toastify';

const Caja = () => {
    const { user } = useContext(AuthContext);
    const [caja, setCaja] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dataCajaFields, setDataCajaFields] = useState({
        monto: 0,
        sobrante: 0,
    });
    const [selectedMotivoId, setSelectedMotivoId] = useState(null);
    const [cajaEntries, setCajaEntries] = useState([]); // Array que almacena las entradas de caja

    useEffect(() => {
        const loadCaja = async () => {
            try {
                if (user) {
                    const data = await obtenerCajaPorSucursal(user.sucursal.id);
                    setCaja(data);
                }
            } catch (error) {
                toast.error('Error al cargar la caja');
                console.log('Error al cargar la caja:', error.message);
            } finally {
                setLoading(false);
            }
        };
        loadCaja();
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDataCajaFields({
            ...dataCajaFields,
            [name]: value,
        });
    };

    const handleMotivoChange = (id) => {
        setSelectedMotivoId(id);
    };

    const handleAddEntry = () => {
        if (selectedMotivoId === null) {
            toast.error('Debes seleccionar un motivo');
            return;
        }

        // Verificar que el motivo no se haya seleccionado antes
        if (cajaEntries.some(entry => entry.id_motivo === selectedMotivoId)) {
            toast.error('Ya has seleccionado este motivo, elige otro.');
            return;
        }

        const newEntry = {
            monto: Number(dataCajaFields.monto),
            sobrante: selectedMotivoId === 2 ? Number(dataCajaFields.sobrante) : 0,
            id_motivo: selectedMotivoId,
            id_usuario: user.id,
            id_sucursal: user.sucursal.id,
        };

        setCajaEntries([...cajaEntries, newEntry]); // Agregar nueva entrada al array
        setDataCajaFields({ monto: 0, sobrante: 0 }); // Resetear los campos
        setSelectedMotivoId(null); // Resetear motivo
        toast.success('Entrada agregada exitosamente');
    };

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
                                </article>
                                <p className="total__ventas__dia">Total de ventas del día: ${caja.totalVentas}</p>
                                <p className="total__efectivo__dia">Efectivo de la Caja: ${caja.totalCaja}</p>
                            </>
                        ) : (
                            <p>No hay datos de caja disponibles.</p>
                        )}
                        <h4>Cerrar caja:</h4>

                        {/* Select para motivos */}
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

                        {selectedMotivoId === 2 && (
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
                        <button onClick={handleAddEntry} className="btn">Agregar</button>

                        {/* Mostrar entradas actuales */}
                        <h4>Entradas actuales en caja:</h4>
                        <ul>
                            {cajaEntries.map((entry, index) => (
                                <li key={index}>
                                    Motivo: {entry.id_motivo}, Monto: ${entry.monto}, Sobrante: ${entry.sobrante}
                                </li>
                            ))}
                        </ul>
                    </ContenedorPages>
                </section>
            )}
        </>
    );
};

export default Caja;
