import { useContext, useEffect, useState } from 'react'
import BtnVolver from '../Components/BtnVolver/BtnVolver'
import Table from '../Components/Table/TablesProductos'
import { obtenerStockPorSucursal } from './lib/libMercaderia'
import { AuthContext } from '../Auth/context/AuthContext'

const Mercaderia = () => {
  const { user } = useContext(AuthContext)
  const [mercaderia, setMercaderia] = useState([])

  useEffect(() => {
    const loadMercaderia = async () => {
      if (user && user.sucursal) {
        // Asegurarse de que el usuario y la sucursal están definidos
        try {
          const data = await obtenerStockPorSucursal(user.sucursal.id)
          setMercaderia(data) // Actualizar el estado con los datos obtenidos
        } catch (error) {
          console.log('Error al cargar mercadería:', error.message)
        }
      }
    }

    loadMercaderia()
  }, [user]) // Agregar `user` como dependencia para que se ejecute cuando cambie

  console.log(mercaderia)

  return (
    <section style={{ position: 'relative' }}>
      <BtnVolver donde="/dashboard" />
      <article className="table__container">
        <Table data={mercaderia} />
      </article>
    </section>
  )
}

export default Mercaderia
