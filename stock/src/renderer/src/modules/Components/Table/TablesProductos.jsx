const TablesProductos = ({ data }) => {
  if (!data || data.length === 0) return <div>No hay datos para mostrar</div>;

  // Obtener los nombres de las columnas a partir de las claves del primer objeto del array
  const columns = Object.keys(data[0]);

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
        {data.map((row, index) => (
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
