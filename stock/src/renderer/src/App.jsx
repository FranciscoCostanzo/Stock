import { Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Dashbord from './screens/Dashbord'
import { AuthRouter } from './modules/Auth/libs/AuthRouter'
import GenerarAlta from './modules/GenerarAlta/GenerarAlta'

function App() {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/dashbord" element={<Dashbord />} />
      <Route path="/generaralta" element={<GenerarAlta />} />
      <Route element={<AuthRouter />}>
      </Route>
    </Routes>
  )
}

export default App
