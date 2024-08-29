const EtiquetaImpresion = ({ descripcion, precio, articulo, sucursal }) => {
  return (
    <div>
      <p>Descripción: {descripcion}</p>
      <p>Precio: {precio}</p>
      <p>Artículo: {articulo}</p>
      <p>Sucursal: {sucursal}</p>
    </div>
  );
};

export default EtiquetaImpresion;
