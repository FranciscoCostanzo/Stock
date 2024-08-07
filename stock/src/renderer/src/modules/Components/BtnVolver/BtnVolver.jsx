import { Link } from "react-router-dom"

const BtnVolver = ({donde}) => {
  return (
    <Link className="btn__volver" to={donde}>Volver</Link>
  )
}

export default BtnVolver