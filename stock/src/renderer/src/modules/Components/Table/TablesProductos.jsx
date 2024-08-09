// Función para comparar dos valores de manera insensible a mayúsculas/minúsculas
const matchesFilter = (value, filter) => {
  if (!filter) return true; // Si no hay filtro, siempre devolver verdadero
  // Verificar si el valor comienza con el filtro, considerando minúsculas para la comparación
  return value.toString().toLowerCase().startsWith(filter.toLowerCase());
};

const TablesProductos = ({ data, filters }) => {
  if (!data || data.length === 0) return <div>No hay datos para mostrar</div>;

  // Obtener los nombres de las columnas a partir de las claves del primer objeto del array
  const columns = Object.keys(data[0]);

  // Filtrar los datos según los filtros
  const filteredData = data.filter((row) => {
    return columns.every((column) => {
      return matchesFilter(row[column], filters[column]);
    });
  });

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
          <tr key={index}>
            {columns.map((column) => (
              <td key={column}>{row[column]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablesProductos;
