import { Route, Routes } from 'react-router-dom'
import Home from './screens/Home'
import Dashbord from './screens/Dashbord'

function App() {
  return (
    <>
      <Routes>
        <Route index path="/" element={<Home />} />
        <Route index path="/dashbord" element={<Dashbord />} />
      </Routes>
    </>
  )
}

export default App
