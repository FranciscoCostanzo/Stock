import { Route, Routes } from 'react-router-dom';
import { useEffect } from 'react';

import Login from './modules/Auth/Login';
import Register from './modules/Auth/Register';
import Dashboard from './modules/Dashboard/Dashboard';
import PrivateRoute from "./modules/Auth/components/PrivateRoute"

const App = () => {
  useEffect(() => {
    window.api.ipcRenderer.send('check-token');

    window.api.ipcRenderer.on('token-status', (event, token) => {
      if (token) {
        console.log('Token recibido:', token);
        // Puedes almacenar el token en el estado o en un contexto
      } else {
        console.log('Token no recibido');
      }
    });

    return () => {
      window.api.ipcRenderer.removeAllListeners('token-status');
    };
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
    </Routes>
  );
};

export default App;
