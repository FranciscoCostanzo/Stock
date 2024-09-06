import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import ContenedorPages from '../Components/Contenedor/ContenedorPages'

const Caja = () => {
    return (
        <section className="ventas">
            <BtnVolver donde="/inicio" />
            <ContenedorPages>Caja</ContenedorPages>
        </section>
    )
}

export default Caja
