const EtiquetaImpresion = ({ descripcion, precio, articulo }) => {
  return (
    <div className="print-area">
      <p>Descripción: {descripcion}</p>
      <p>Precio: {precio}</p>
      <p>Artículo: {articulo}</p>
    </div>
  );
};

export default EtiquetaImpresion;
