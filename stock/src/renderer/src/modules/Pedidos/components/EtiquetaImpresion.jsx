const EtiquetaImpresion = ({ descripcion, precio, articulo, sucursal }) => {
  return (
    <div>
      <p>{sucursal}</p>
      <p>Artículo: {articulo}</p>
      <p>{descripcion}</p>
      <p>Precio contado: ${precio}</p>
    </div>
  )
}

export default EtiquetaImpresion
