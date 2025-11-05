"use client"

import { useState } from "react"
import LP_inicio from "./LP_inicio/LP_inicio"
import LP_contactanos from "./LP_contactanos/LP_contactanos"
import LP_productos from "./LP_productos/LP_productos"
import "./LandingPage.css"
import logo from "./logooo.png"

const PHONE_PLAIN = "3125854465"
const WHATS_URL = `https://wa.me/57${PHONE_PLAIN}?text=¡Hola!%20Quiero%20información%20sobre%20productos.`

const LandingPage = () => {
  const [seccion, setSeccion] = useState("inicio")

  const goto = (id) => {
    setSeccion(id) // mantiene tu comportamiento original si lo usas
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div>
      {/* HEADER (solo navega a secciones) */}
      <nav className="header">
        <div className="imagenferreteria" onClick={() => goto("inicio")} style={{ cursor: "pointer" }}>
          <img src={logo} alt="La Economía A&G Logo" className="logo-ferreteria" />
        </div>
        <div className="enlaces">
          <button onClick={() => goto("inicio")}><h3>Inicio</h3></button>
          <button onClick={() => goto("productos")}><h3>Productos</h3></button>
          <button onClick={() => goto("contactanos")}><h3>Contáctanos</h3></button>
        </div>
        <div className="enlacelogin">
          <button onClick={() => window.open("http://localhost:3000/login", "_blank")}>Acceder</button>
        </div>
      </nav>

      {/* Deja tus secciones como estaban */}
      {seccion === "inicio" && <LP_inicio />}
      {seccion === "productos" && <LP_productos />}
      {seccion === "contactanos" && <LP_contactanos />}

      {/* FOOTER actualizado */}
      <footer className="abajo">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-section">
              <h4>La Economía A & G</h4>
              <p>
                Tu ferretería de confianza en El Juncal, Palermo – Huila. Más de 20 años brindando calidad y servicio
                excepcional a nuestra comunidad.
              </p>
            </div>

            <div className="footer-section">
              <h4>Servicios</h4>
              <ul>
                <li>Asesoría personalizada</li>
                <li>Entrega de materiales</li>
                <li>Cotizaciones sin costo</li>
                <li>Garantía en productos</li>
              </ul>
            </div>

            <div className="footer-section">
              <h4>Horarios</h4>
              <p>Lunes a Viernes: 7:00 AM - 6:00 PM</p>
              <p>Sábados: 7:00 AM - 5:00 PM</p>
              <p>Domingos: 8:00 AM - 12:00 PM</p>
            </div>

            <div className="footer-section">
              <h4>Contacto</h4>
              <p>
                📞{" "}
                <a href={WHATS_URL} target="_blank" rel="noreferrer">
                  +57 {PHONE_PLAIN}
                </a>
              </p>
              <p>✉️ <a href="mailto:contacto@laeconomiaayg.com">contacto@laeconomiaayg.com</a></p>
              <p>📍 LA CIUDADELA SAN LUIS, CR 2 # 8-149, Palermo, Huila</p>
            </div>
          </div>

          {/* Se quita la franja de 3 textos (textoabajo) */}

          <div className="despedida">
            <h3>━━━━━━━━━━</h3>
            <p>Gracias por visitarnos</p>
            <h3>━━━━━━━━━━</h3>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
