import BtnGeneral from '../Btns/BtnGeneral'

const matchesFilter = (value, filter) => {
  if (!filter) return true // Si no hay filtro, siempre devolver verdadero
  // Verificar si el valor comienza con el filtro, considerando minúsculas para la comparación
  return value?.toString().toLowerCase().startsWith(filter.toLowerCase())
}

const TablesProductos = ({ data = [], filters = {}, ventas, pedidos, handleVolverAImprimir }) => {
  if (!data || data.length === 0)
    return <>{ventas ? <div>No hay ventas cargadas</div> : <div>No hay datos para mostrar</div>}</>

  // Obtener los nombres de las columnas a partir de las claves del primer objeto del array
  const columns = Object.keys(data[0] || {}) // Asegúrate de que data[0] existe

  // Filtrar los datos según los filtros
  const filteredData = data.filter((row) => {
    return columns.every((column) => {
      return matchesFilter(row[column], filters[column])
    })
  })

  return (
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
          <>
            {pedidos && (

              <BtnGeneral tocar={handleVolverAImprimir} claseBtn="btn__volver__imprimir">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M17 17h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-14a2 2 0 0 0 -2 2v4a2 2 0 0 0 2 2h2" />
                  <path d="M17 9v-4a2 2 0 0 0 -2 -2h-6a2 2 0 0 0 -2 2v4" />
                  <path d="M7 13m0 2a2 2 0 0 1 2 -2h6a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6a2 2 0 0 1 -2 -2z" />
                </svg>
                Volver a Imprimir
              </BtnGeneral>
            )}
            <tr key={index}>
              {columns.map((column) => (
                <td key={column}>{row[column] !== undefined ? row[column] : 'N/A'}</td> // Manejar valores undefined
              ))}
            </tr>
          </>
        ))}
      </tbody>
    </table>
  )
}

export default TablesProductos
