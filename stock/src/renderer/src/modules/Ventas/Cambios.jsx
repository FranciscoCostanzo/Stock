import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import FormCambios from './components/FormCambios'

function Cambios() {
  return (
    <section className="ventas">
      <BtnVolver donde="/ventas" />
      <article className="contenedor__form__ventas">
        <FormCambios />
      </article>
    </section>
  )
}

export default Cambios
