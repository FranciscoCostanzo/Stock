import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

const AuthTimeStampAviso = () => {
  const { user, setUser } = useContext(AuthContext)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [sessionExpired, setSessionExpired] = useState(false)
  const [aviso, setAviso] = useState(true)

  useEffect(() => {
    if (user) {
      const checkSession = () => {
        const currentTime = Math.floor(Date.now() / 1000)
        const timeLeft = user.exp - currentTime

        if (timeLeft <= 0) {
          setSessionExpired(true)
          setUser(null)
          setTimeRemaining(0)
          setAviso(true)
          localStorage.removeItem('access_token')
          window.location.reload()
        } else {
          setSessionExpired(false)
          setTimeRemaining(timeLeft)
        }
      }

      checkSession()
      const interval = setInterval(checkSession, 1000)

      return () => clearInterval(interval)
    }
  }, [user, setUser])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    return `${hours} horas, ${minutes} minutos y ${remainingSeconds} segundos`
  }

  const handleCerrarAviso = () => {
    setAviso(false)
  }

  return (
    <div>
      {sessionExpired
        ? aviso && (
            <article className="aviso__time__stamp">
              <div className="aviso">
                <p>
                  Tu sesión ha expirado. Por favor, vuelve a{' '}
                  <strong onClick={handleCerrarAviso}>iniciar sesión</strong>
                </p>
              </div>
            </article>
          )
        : timeRemaining > 0 && (
            <article className="contador__time__stamp">
              <p>
                Tu sesión expirará en: <strong>{formatTime(timeRemaining)}</strong>
              </p>
            </article>
          )}
    </div>
  )
}

export default AuthTimeStampAviso
