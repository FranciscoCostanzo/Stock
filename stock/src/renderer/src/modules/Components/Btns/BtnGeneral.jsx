const BtnGeneral = ({ children, claseBtn, tocar }) => {
  return (
    <p onClick={tocar} className={`btn__general ${claseBtn}`}>
      {children}
    </p>
  )
}

export default BtnGeneral
