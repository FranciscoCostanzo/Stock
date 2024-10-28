const BtnGeneral = ({ children, claseBtn, tocar, disabled }) => {
  return (
    <p onClick={!disabled && tocar} className={ disabled ? `disabled btn__general ${claseBtn}` : `btn__general ${claseBtn}`}>
      {children}
    </p>
  )
}

export default BtnGeneral
