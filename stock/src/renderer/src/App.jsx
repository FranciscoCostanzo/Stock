import { Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Dashbord from './screens/Dashbord'
import { AuthRouter } from './modules/Auth/libs/AuthRouter'
import GenerarAlta from './modules/GenerarAlta/GenerarAlta'
import Auth from './modules/Auth/Auth'
import Register from './modules/Register/Register'

function App() {
  return (

    <Routes>
      <Route index path="/" element={<Home />} />
      <Route element={<AuthRouter />}>
        <Route path="/dashbord" element={<Dashbord />} />
        <Route path="/generaralta" element={<GenerarAlta />} />
      </Route>
      <Route element={<AuthRouter requireAuth={false} />}>
        <Route path="/auth" element={<Auth />} />
        <Route path="/register" element={<Register />} />
      </Route>
    </Routes>
  )
}

export default App
