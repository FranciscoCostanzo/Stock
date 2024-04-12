import { Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Dashbord from './screens/Dashbord'
import { AuthRouter } from './modules/Auth/libs/AuthRouter'

function App() {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route element={<AuthRouter />}>
        <Route path="/dashbord" element={<Dashbord />} />
      </Route>
    </Routes>
  )
}

export default App
