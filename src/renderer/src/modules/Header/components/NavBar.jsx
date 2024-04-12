import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  const [subsectionsState, setSubsectionsState] = useState({})
  const sectionsNavBar = [
    { section: 'Mercaderia' },
    {
      section: 'Ventas',
      subsections: ['Generar Alra', 'Buscar Ventas', 'Analisis', 'Generar Cambio']
    },
    {
      section: 'Fallas',
      subsections: ['Generar Alra', 'Buscar Ventas', 'Analisis', 'Generar Cambio']
    },
    {
      section: 'Pedidos',
      subsections: ['Generar Alra', 'Buscar Ventas', 'Analisis', 'Generar Cambio']
    },
    { section: 'Configuracion' },
    { section: 'Codigo de Barra' },
    { section: 'Caja' }
  ]
  const handleOpenSubsections = (index) => {
    setSubsectionsState((prevState) => ({
      ...prevState,
      [index]: !prevState[index] // Alternar la visibilidad
    }))
  }

  return (
    <nav>
      {sectionsNavBar.map((sections, index) => (
        <section key={index}>
          <p onClick={() => handleOpenSubsections(index)} className="section__navbar">
            {sections.section}
          </p>
          {subsectionsState[index] && sections.subsections && (
            <article className="conteiner__subsections">
              {sections.subsections.map((subsection, subIndex) => (
                <Link key={subIndex} className="subsections__navbar">
                  {subsection}
                </Link>
              ))}
            </article>
          )}
        </section>
      ))}
    </nav>
  )
}

export default NavBar
