import React, { useState } from 'react'
import BtnGeneral from '../Btns/BtnGeneral'

const matchesFilter = (value, filter) => {
  if (!filter) return true
  return value?.toString().toLowerCase().startsWith(filter.toLowerCase())
}

const TablesProductos = ({
  data = [],
  filters = {},
  ventas,
  pedidos,
  onRowClick
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [hoveredRow, setHoveredRow] = useState(null)

  if (!data || data.length === 0)
    return <>{ventas ? <div>No hay ventas cargadas</div> : <div>No hay datos para mostrar</div>}</>

  const columns = Object.keys(data[0] || {})

  const filteredData = data.filter((row) => {
    return columns.every((column) => {
      return matchesFilter(row[column], filters[column])
    })
  })

  // Función que maneja el movimiento del mouse
  const handleMouseMove = (e, index) => {
    setTooltipPosition({ x: e.pageX, y: e.pageY }) // Actualiza la posición del tooltip
    setHoveredRow(index) // Guarda el índice de la fila para la que el tooltip debe mostrarse
    setTooltipVisible(true) // Muestra el tooltip
  }

  const handleMouseLeave = () => {
    setTooltipVisible(false) // Oculta el tooltip cuando el mouse sale de la fila
    setHoveredRow(null) // Limpia el índice de la fila
  }

  return (
    <>
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, index) => (
            <React.Fragment key={index}>
              <tr
                key={index}
                className={ventas && 'tr__ventas'}
                onClick={() => onRowClick && onRowClick(row)}
                onMouseMove={(e) => handleMouseMove(e, index)} // Maneja el movimiento del mouse
                onMouseLeave={handleMouseLeave} // Maneja cuando el mouse sale de la fila
              >
                {columns.map((column) => (
                  <td key={column}>{row[column] !== undefined ? row[column] : 'N/A'}</td>
                ))}
                {ventas && tooltipVisible && hoveredRow !== null && (
                  <div
                    className="tooltip__eliminar"
                    style={
                      pedidos
                        ? {
                          left: `${tooltipPosition.x - 150}px` // Ajusta para evitar solapamiento
                        }
                        : {
                          left: `${tooltipPosition.x - 290}px` // Ajusta para evitar solapamiento
                        }
                    }
                  >
                    {pedidos ? (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                          <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                          <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                          <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
                        </svg>
                        <p>Volver a Imprimir</p>
                      </>
                    ) : (
                      <p>Eliminar Fila Entera</p>
                    )}
                  </div>
                )}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default TablesProductos
