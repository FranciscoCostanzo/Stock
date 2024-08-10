import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const AuthTimeStampAviso = () => {
  const { user, setUser } = useContext(AuthContext)
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);

  useEffect(() => {
    if (user) {
      const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
      const timeLeft = user.exp - currentTime;

      if (timeLeft <= 0) {
        setSessionExpired(true);
      } else {
        setTimeRemaining(timeLeft);

        const interval = setInterval(() => {
          const newTimeLeft = user.exp - Math.floor(Date.now() / 1000);
          if (newTimeLeft <= 0) {
            setSessionExpired(true);
            clearInterval(interval);
            setUser(null)
          } else {
            setTimeRemaining(newTimeLeft);
          }
        }, 1000);

        return () => clearInterval(interval);
      }
    }
  }, [user]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} minutos y ${remainingSeconds} segundos`;
  };

  return (
    <div>
      {sessionExpired ? (
        <span className='aviso__time__stamp'>Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.
        </span>
      ) : (
        timeRemaining !== null && (
          <span>{formatTime(timeRemaining)}</span>
        )
      )}
    </div>
  );
};

export default AuthTimeStampAviso;
