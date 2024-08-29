// Filtro.jsx
import { useState, useEffect } from 'react'

// Función para aplicar el debounce
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const Filtro = ({ columns, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState({})
  const debouncedFilters = useDebounce(localFilters, 300)

  const handleInputChange = (column, value) => {
    const newFilters = { ...localFilters, [column]: value }
    setLocalFilters(newFilters)
  }

  useEffect(() => {
    onFilterChange(debouncedFilters)
  }, [debouncedFilters, onFilterChange])

  return (
    <div className="contenedor__filtros">
      {columns.map((column) => (
        <div key={column}>
          <input
            type="text"
            onChange={(e) => handleInputChange(column, e.target.value)}
            placeholder={`Filtrar por ${column}`}
          />
        </div>
      ))}
    </div>
  )
}

export default Filtro
