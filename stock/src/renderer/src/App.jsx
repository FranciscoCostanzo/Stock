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
import Inversion from './modules/Mercaderia/Inversion'
import AuthTimeStampAviso from './modules/Auth/components/AuthTimeStampAviso/AuthTimeStampAviso'
import Cambios from './modules/Ventas/Cambios'
import Fallas from './modules/Mercaderia/Fallas'
import Configuracion from './modules/Configuracion/Configuracion.jsx'

const App = () => {
  useEffect(() => {
    window.api.ipcRenderer.send('check-token')

    window.api.ipcRenderer.on('token-status', (event, token) => {
      if (token) {
        console.log('Token recibido:', token)
        // Puedes almacenar el token en el estado o en un contexto
      } else {
        console.log('Token no recibido')
      }
    })

    return () => {
      window.api.ipcRenderer.removeAllListeners('token-status')
    }
  }, [])

  return (
    <>
    <Header/>
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
        <Route path="/cambios" element={<Cambios />} />

        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
    <AuthTimeStampAviso/>
    </>
  )
}

export default App
