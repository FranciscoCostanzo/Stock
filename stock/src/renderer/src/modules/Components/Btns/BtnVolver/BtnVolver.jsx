import { Link } from 'react-router-dom'

const BtnVolver = ({ donde }) => {
  return (
    <Link className="btn__volver" to={donde}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M13 14l-4 -4l4 -4" />
        <path d="M8 14l-4 -4l4 -4" />
        <path d="M9 10h7a4 4 0 1 1 0 8h-1" />
      </svg>
      Volver
    </Link>
  )
}

export default BtnVolver
