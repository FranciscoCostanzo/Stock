import { useState, useEffect } from 'react'

const InternetStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine) // Estado inicial basado en si el usuario está conectado

    useEffect(() => {
        // Funciones para manejar los eventos 'online' y 'offline'
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        // Añadir listeners para detectar los cambios
        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        // Eliminar listeners cuando el componente se desmonta
        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return (
        <>
            {isOnline ? (
                <article className="internet__status">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 18l.01 0" />
                        <path d="M9.172 15.172a4 4 0 0 1 5.656 0" />
                        <path d="M6.343 12.343a8 8 0 0 1 11.314 0" />
                        <path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0" />
                    </svg>
                    <p>Conexión a internet: Conectado</p>
                </article>
            ) : (
                <article className="internet__status">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M12 18l.01 0" />
                        <path d="M9.172 15.172a4 4 0 0 1 5.656 0" />
                        <path d="M6.343 12.343a7.963 7.963 0 0 1 3.864 -2.14m4.163 .155a7.965 7.965 0 0 1 3.287 2" />
                        <path d="M3.515 9.515a12 12 0 0 1 3.544 -2.455m3.101 -.92a12 12 0 0 1 10.325 3.374" />
                        <path d="M3 3l18 18" />
                    </svg>
                    <p>Conexión a internet: Desconectado</p>
                </article>
            )}
        </>
    )
}

export default InternetStatus
