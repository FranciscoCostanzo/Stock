import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  const [subsectionsState, setSubsectionsState] = useState({})

  const sectionsNavBar = [
    {
      section: 'Mercaderia',
      subsections: [
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Buscar Ventas', toLink: 'buscarventas' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' }
      ]
    },
    {
      section: 'Ventas',
      subsections: [
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Buscar Ventas', toLink: 'buscarventas' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' }
      ]
    },
    {
      section: 'Fallas',
      subsections: [
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Buscar Ventas', toLink: 'buscarventas' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' }
      ]
    },
    {
      section: 'Pedidos',
      subsections: [
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Buscar Ventas', toLink: 'buscarventas' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' }
      ]
    },
    {
      section: 'Configuracion',
      subsections: [
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Buscar Ventas', toLink: 'buscarventas' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' }
      ]
    },
    {
      section: 'Codigo de Barra',
      subsections: [
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Buscar Ventas', toLink: 'buscarventas' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' }
      ]
    },
    {
      section: 'Caja',
      subsections: [
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Buscar Ventas', toLink: 'buscarventas' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' },
        { nameSection: 'Generar Alta', toLink: 'generaralta' }
      ]
    }
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
        <section className="conteiner__section" key={index}>
          <p onClick={() => handleOpenSubsections(index)} className="section__navbar">
            {sections.section}
          </p>
          {subsectionsState[index] && sections.subsections && (
            <article className="conteiner__subsections">
              {sections.subsections.map((subsection, subIndex) => (
                <Link to={`/${subsection.toLink}`} key={subIndex} className="subsections__navbar">
                  {subsection.nameSection}
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
