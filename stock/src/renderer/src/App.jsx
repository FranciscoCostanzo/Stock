import { Route, Routes } from 'react-router-dom'
import { useEffect } from 'react'

import Login from './modules/Auth/Login'
import Register from './modules/Auth/Register'
import Dashboard from './modules/Dashboard/Dashboard'
import { AuthRouter } from './modules/Auth/components/AuthRouter'
import Stock from './modules/Mercaderia/Stock'
import Header from './modules/Header/Header'
import Mercaderia from './modules/Mercaderia/Mercaderia'
import Papelera from './modules/Mercaderia/Papelera'
import Ventas from './modules/Ventas/Ventas'
import VerVentas from './modules/Ventas/VerVentas.jsx'
import Inversion from './modules/Mercaderia/Inversion'
import AuthTimeStampAviso from './modules/Auth/components/AuthTimeStampAviso/AuthTimeStampAviso'
import Cambios from './modules/Ventas/Cambios'
import Fallas from './modules/Pedidos/Fallas.jsx'
import Configuracion from './modules/Configuracion/Configuracion.jsx'
import InternetStatus from './modules/Components/InternetStatus/InternetStatus.jsx'
import Pedidos from './modules/Pedidos/Pedidos.jsx'
import VerPedidos from './modules/Pedidos/VerPedidos.jsx'
import RecibirPedidos from './modules/Pedidos/RecibirPedidos.jsx'

const App = () => {
  useEffect(() => {
    // Enviar la solicitud inicial al proceso principal de Electron
    window.api.ipcRenderer.send('check-token')

    // Definir la función del listener
    const handleTokenStatus = (event, token) => {
      if (token) {
        console.log('Token recibido:', token)
        // Aquí podrías actualizar el estado o el contexto con el token recibido
      } else {
        console.log('Token no recibido')
      }
    }

    // Registrar el listener para 'token-status'
    window.api.ipcRenderer.on('token-status', handleTokenStatus)

    // Función de limpieza para remover el listener cuando el componente se desmonte
    return () => {
      window.api.ipcRenderer.removeListener('token-status', handleTokenStatus)
    }
  }, [])

  return (
    <>
      <Header />
      <Routes>
        <Route element={<AuthRouter requireAuth={false} />}>
          <Route path="/" element={<Login />} />
        </Route>
        <Route element={<AuthRouter />}>
          <Route path="/inicio" element={<Dashboard />} />

          <Route path="/mercaderia" element={<Mercaderia />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/papelera" element={<Papelera />} />
          <Route path="/inversion" element={<Inversion />} />
          <Route path="/fallas" element={<Fallas />} />

          <Route path="/ventas" element={<Ventas />} />
          <Route path="/generar-cambios" element={<Cambios />} />
          <Route path="/ver-ventas" element={<VerVentas />} />

          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/ver-pedidos" element={<VerPedidos />} />
          <Route path="/recibir-pedidos" element={<RecibirPedidos />} />

          <Route path="/configuracion" element={<Configuracion />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
      <AuthTimeStampAviso />
      <InternetStatus />
    </>
  )
}

export default App
