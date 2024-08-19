import { useContext } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import { AuthContext } from '../Auth/context/AuthContext'
import ToolsConfiguracion from './ToolsConfiguracion'

const Configuracion = () => {
  const { user } = useContext(AuthContext) // obtener el usuario desde el contexto
  return (
    <>
      {user.rol === 'admin' && (
        <>
          <section className="mercaderia">
            <BtnVolver donde="/inicio" />
            aasadass
          </section>
        </>
      )}
    </>
  )
}

export default Configuracion
