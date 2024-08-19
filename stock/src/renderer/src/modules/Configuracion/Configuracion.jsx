import { useContext } from 'react'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import BtnGeneral from '../Components/Btns/BtnGeneral'
import { AuthContext } from '../Auth/context/AuthContext'
import ToolsConfiguracion from './ToolsConfiguracion'

const Configuracion = () => {
  const { user } = useContext(AuthContext) // obtener el usuario desde el contexto
  return (
    <>
      {user.rol === 'admin' && (
        <>
          <section className="configuracion">
            <BtnVolver donde="/inicio" />
            <article className="contenedor__btns__configuracion">
              <BtnGeneral claseBtn="btn__configuracion">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                  <path d="M3 10l18 0" />
                  <path d="M7 15l.01 0" />
                  <path d="M11 15l2 0" />
                </svg>
                <p>Tarjetas</p>
              </BtnGeneral>
              <BtnGeneral claseBtn="btn__configuracion">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                  <path d="M6 21v-2a4 4 0 0 1 4 -4h3.5" />
                  <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z" />
                </svg>
                <p>Registrar Usuarios</p>
              </BtnGeneral>
              <BtnGeneral claseBtn="btn__configuracion">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M3 21l18 0" />
                  <path d="M3 7v1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1m0 1a3 3 0 0 0 6 0v-1h-18l2 -4h14l2 4" />
                  <path d="M5 21l0 -10.15" />
                  <path d="M19 21l0 -10.15" />
                  <path d="M9 21v-4a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v4" />
                </svg>
                <p>Sucursales</p>
              </BtnGeneral>
            </article>
          </section>
        </>
      )}
    </>
  )
}

export default Configuracion
