import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const AuthTimeStampAviso = () => {
  const { user, setUser } = useContext(AuthContext)
  const [timeRemaining, setTimeRemaining] = useState(null)
  const [sessionExpired, setSessionExpired] = useState(false)

  useEffect(() => {
    if (user) {
      const currentTime = Math.floor(Date.now() / 1000) // Tiempo actual en segundos
      const timeLeft = user.exp - currentTime
      console.log(timeLeft)

      if (timeLeft <= 0) {
        setSessionExpired(true)
        setUser(null)
        setTimeRemaining(0)
      } else {
        setTimeRemaining(timeLeft)

        const interval = setInterval(() => {
          const newTimeLeft = user.exp - Math.floor(Date.now() / 1000)
          if (newTimeLeft <= 0) {
            setSessionExpired(true)
            clearInterval(interval)
            setUser(null)
          } else {
            setTimeRemaining(newTimeLeft)
          }
        }, 1000)

        return () => clearInterval(interval)
      }
    }
  }, [user])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes} minutos y ${remainingSeconds} segundos`
  }

  return (
    <div>
      {sessionExpired ? (
        <article className="aviso__time__stamp">
          <div className="aviso">
            <p>
              Tu sesión ha expirado. Por favor, vuelve a <Link to="/">iniciar sesión</Link>.
            </p>
          </div>
        </article>
      ) : (
        timeRemaining !== null && (
          <article className='contador__time__stamp'>
            <p>Tu sesión expirará en: <strong>{formatTime(timeRemaining)}</strong></p>
            
          </article>
        )
      )}
    </div>
  )
}

export default AuthTimeStampAviso
