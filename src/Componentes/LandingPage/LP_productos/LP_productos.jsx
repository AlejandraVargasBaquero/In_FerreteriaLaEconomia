"use client"

import { useState, useEffect } from "react"
import "./LP_productos.css"

import imgCemento from "./ImagenesProductos/cemento.png"
import imgTornillos from "./ImagenesProductos/tornillos.png"
import imgPintura from "./ImagenesProductos/pintura.png"
import imgTuberia from "./ImagenesProductos/tuberia.png"
import imgBrochas from "./ImagenesProductos/brochas.png"
import imgAlicate from "./ImagenesProductos/alicate.png"

const LP_productos = () => {
  const productos = [
    { name: "Cemento", img: imgCemento, categoria: "Materiales de Construcción", descripcion: "Cemento de alta calidad para todo tipo de construcciones. Ideal para cimientos y estructuras." },
    { name: "Tornillos y Accesorios", img: imgTornillos, categoria: "Ferretería", descripcion: "Amplia variedad de tornillería y fijación." },
    { name: "Pintura", img: imgPintura, categoria: "Acabados", descripcion: "Pinturas de alta cobertura para interior y exterior." },
    { name: "Tuberías PVC", img: imgTuberia, categoria: "Plomería", descripcion: "Tuberías y accesorios para instalaciones hidráulicas." },
    { name: "Brochas y Rodillos", img: imgBrochas, categoria: "Acabados", descripcion: "Brochas y rodillos profesionales para mejores acabados." },
    { name: "Alicates y Pinzas", img: imgAlicate, categoria: "Herramientas", descripcion: "Herramientas de precisión para trabajos eléctricos y mecánicos." },
  ]

  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setCurrentIndex((i) => (i + 1) % productos.length), 4200)
    return () => clearInterval(t)
  }, [productos.length])

  const current = productos[currentIndex]

  return (
    <section id="productos" className="ferre-productos">
      <div className="ferre-prod-head">
        <h2>Descubre nuestros productos</h2>
        <span className="ferre-prod-barrr" />
        <div className="ferre-prod-copy">
          <p>En <strong>La Economía A &amp; G</strong> ofrecemos materiales y herramientas de primera calidad.</p>
          <p>Contamos con productos ideales para construcción, plomería, electricidad, acabados y más.</p>
          <p>Encuentra todo lo que necesitas para tus proyectos en un solo lugar.</p>
        </div>
      </div>

      {/* ===== SLIDER SIN FONDO AZUL ===== */}
      <div className="ferre-slider">
        <div className="ferre-page" key={currentIndex}>
          <div className="ferre-page__subtitle">Categorías más vendidas</div>

          <div className="ferre-page__body">
            <div className="ferre-page__img">
              <img src={current.img} alt={current.name} />
            </div>

            <div className="ferre-page__content">
              <span className="ferre-chip">{current.categoria}</span>
              <h3>{current.name}</h3>
              <p>{current.descripcion}</p>

              <div className="ferre-dots">
                {productos.map((_, idx) => (
                  <button
                    key={idx}
                    className={`ferre-dot ${idx === currentIndex ? "is-active" : ""}`}
                    onClick={() => setCurrentIndex(idx)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default LP_productos
