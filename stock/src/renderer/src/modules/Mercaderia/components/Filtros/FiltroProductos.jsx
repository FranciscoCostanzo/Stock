import { useState, useEffect, useRef } from 'react'

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

const FiltroProductos = ({ columns, dateColumns = [], onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState({})
  const debouncedFilters = useDebounce(localFilters, 300)

  // Referencia para los campos de fecha
  const fechaRefs = useRef({})

  const convertDateFormat = (dateStr) => {
    if (!dateStr) return ''
    // Convierte de YYYY-MM-DD a YYYY/MM/DD
    return dateStr.split('-').join('/')
  }

  const handleInputChange = (column, value) => {
    // Si la columna es una columna de fecha, asegurarse de que el valor esté en formato YYYY/MM/DD
    const formattedValue = dateColumns.includes(column) ? convertDateFormat(value) : value
    const newFilters = { ...localFilters, [column]: formattedValue }
    setLocalFilters(newFilters)
  }

  useEffect(() => {
    onFilterChange(debouncedFilters)
  }, [debouncedFilters, onFilterChange])

  // Manejo de cambios en los inputs de fecha
  useEffect(() => {
    if (dateColumns.length > 0) {
      dateColumns.forEach((column) => {
        if (fechaRefs.current[column]) {
          fechaRefs.current[column].addEventListener('change', (e) => {
            handleInputChange(column, e.target.value)
          })
        }
      })
    }
  }, [dateColumns, localFilters])

  return (
    <div className="contenedor__filtros">
      {columns.map((column) => (
        <div key={column}>
          <input
            ref={(el) => dateColumns.includes(column) && (fechaRefs.current[column] = el)}
            min="2020-01-01"
            max="2025-12-31"
            id={dateColumns.includes(column) ? `fecha-${column}` : ''}
            type={dateColumns.includes(column) ? 'date' : 'text'} // Cambia el tipo de input si es una columna de fecha
            onChange={(e) => handleInputChange(column, e.target.value)}
            placeholder={dateColumns.includes(column) ? 'YYYY-MM-DD' : `Filtrar por ${column}`}
          />
        </div>
      ))}
    </div>
  )
}

export default FiltroProductos
