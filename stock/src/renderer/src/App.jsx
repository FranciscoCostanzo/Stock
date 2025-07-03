import { Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'

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
import Caja from './modules/Caja/Caja.jsx'
import Etiqueta from './modules/Etiqueta/Etiqueta.jsx'
import VerCaja from './modules/Caja/VerCaja.jsx'

const App = () => {
  const [tokenStatus, setTokenStatus] = useState(null)

  const isWindows = navigator.userAgent.includes("Windows");

console.log("¿Es Windows?", isWindows);
console.log("User agent:", navigator.userAgent);
const ua = navigator.userAgent;

if (ua.includes("Windows NT 6.1")) {
  console.log("Es Windows 7");
} else if (ua.includes("Windows NT 10.0")) {
  console.log("Es Windows 10 o 11");
}



  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('access_token') // Obtener el token del localStorage

      if (token) {
        setTokenStatus('Token ya está disponible:')
        console.log(token)
      } else {
        setTokenStatus('Token no disponible, solicitalo.')
        console.error(tokenStatus)
      }
    }
    checkToken()
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

          <Route path="/caja" element={<Caja />} />
          <Route path="/ver-caja" element={<VerCaja />} />

          <Route path="/etiqueta" element={<Etiqueta />} />
        </Route>
      </Routes>
      <AuthTimeStampAviso />
      <InternetStatus />
    </>
  )
}

export default App
