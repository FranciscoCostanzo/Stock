import React, { useContext, useEffect, useState } from 'react'
import EtiquetaImpresion from '../Pedidos/components/EtiquetaImpresion'
import SelectSucursales from '../Components/Inputs/SelectSucursales'
import BtnVolver from '../Components/Btns/BtnVolver/BtnVolver'
import ContenedorPages from '../Components/Contenedor/ContenedorPages'
import BtnGeneral from '../Components/Btns/BtnGeneral'
import { AuthContext } from '../Auth/context/AuthContext'
import { obtenerMercaderiaAdmin } from '../Mercaderia/lib/libMercaderia'
import { toast } from 'react-toastify'

const Etiquetas = () => {
    const { user } = useContext(AuthContext)
    const [mercaderia, setMercaderia] = useState([])
    const [articuloAComprar, setArticuloAComprar] = useState('')
    const [etiquetaData, setEtiquetaData] = useState(null)
    const [selectedSucursalId, setSelectedSucursalId] = useState(null)
    const [selectedSucursalText, setSelectedSucursalText] = useState('')
  const [loading, setLoading] = useState(true)


    const handleAceptar = () => {
        if (articuloAComprar && selectedSucursalId) {
            // Crear el objeto con los datos necesarios para la etiqueta
            const newEtiquetaData = {
                articulo: articuloAComprar,
                sucursal: selectedSucursalId
            }
            setEtiquetaData(newEtiquetaData)
        } else {
            toast.error('No hay stock disponible o el artículo no existe.')
        }
    }



    const handleSucursalChange = (id, text) => {
        setSelectedSucursalId(id)
        setSelectedSucursalText(text)
    }

    const handleChangeArticuloPedidos = (e) => {
        setArticuloAComprar(e.target.value)
    }

    useEffect(() => {
        const loadMercaderia = async () => {
          try {
            if (user) {
              let data
              if (user.rol === 'admin') {
                data = await obtenerMercaderiaAdmin()
              }
              setMercaderia(data)
            }
          } catch (error) {
            console.log('Error al cargar mercadería:', error.message)
          } finally {
            setLoading(false)
          }
        }
    
        loadMercaderia()
      }, [user])

    console.log(etiquetaData)
    return (
        <section className="ventas">
            <BtnVolver donde="/inicio" />
            <article className='contenedor__generar__etiqueta'>
                <h2>Seleccionar Artículo y Sucursal</h2>
                <div className="flex">
                    <label>
                        <input
                            value={articuloAComprar}
                            onChange={handleChangeArticuloPedidos}
                            type="text" // Cambiar a texto para los códigos de artículo
                            name="id_mercaderia"
                            className="input"
                        />
                        <span>Artículo</span>
                    </label>
                    <SelectSucursales onChange={handleSucursalChange} />
                </div>
                <div></div>
                <BtnGeneral claseBtn="btn__aceptar__etiqueta" tocar={handleAceptar}>Aceptar</BtnGeneral>

                {/* {etiquetaData && <EtiquetaImpresion data={etiquetaData} />} */}
            </article>
        </section>
    )
}

export default Etiquetas
