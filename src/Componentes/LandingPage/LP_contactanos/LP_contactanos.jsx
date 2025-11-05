import "./LP_contactanos.css"
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from "react-icons/fa"

const PHONE_PLAIN = "3125854465"
const WHATSAPP_URL = `https://wa.me/57${PHONE_PLAIN}?text=¡Hola!%20Quiero%20información%20sobre%20productos.`

export default function LP_contactanos() {
  return (
    <>
      <a className="ws-float" href={WHATSAPP_URL} target="_blank" rel="noreferrer" aria-label="WhatsApp">
        <FaWhatsapp />
      </a>

      <section id="contactanos" className="seccion-contacto">
        <div className="contacto-container">
          <div className="contacto-header">
            <h2>Ponte en Contacto</h2>
            <span className="ferre-prod-barrrr" />
          </div>

          <p className="contacto-intro">
            En La Economía A&G valoramos el trato directo y personal. Visítanos en nuestra tienda física o ponte en
            contacto con nosotros por cualquiera de nuestros canales. ¡Estamos listos para ayudarte en tu próximo
            proyecto!
          </p>

          <div className="contacto-grid">
            <div className="contacto-info">
              <h3>Información de Contacto</h3>

              <div className="info-item">
                <FaPhone className="info-icon" />
                <div>
                  <p className="info-label">Teléfono</p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                    +57 {PHONE_PLAIN}
                  </a>
                </div>
              </div>

              <div className="info-item">
                <FaWhatsapp className="info-icon" />
                <div>
                  <p className="info-label">WhatsApp</p>
                  <a href={WHATSAPP_URL} target="_blank" rel="noreferrer">
                    Contactar por WhatsApp
                  </a>
                </div>
              </div>

              <div className="info-item">
                <FaEnvelope className="info-icon" />
                <div>
                  <p className="info-label">Email</p>
                  <a href="mailto:contacto@laeconomiaayg.com">contacto@laeconomiaayg.com</a>
                </div>
              </div>

              <div className="info-item">
                <FaMapMarkerAlt className="info-icon" />
                <div>
                  <p className="info-label">Ubicación</p>
                  <p>
                    LA CIUDADELA SAN LUIS
                    <br />
                    Carrera 2 #8-149
                    <br />
                    Palermo, Huila - Colombia
                  </p>
                </div>
              </div>
            </div>

            <div className="contacto-mapa">
              <iframe
                title="Ubicación La Economía A&G"
                src="https://www.google.com/maps?q=LA+CIUDADELA+SAN+LUIS,+Carrera+2+%238-149,+Palermo,+Huila,+Colombia&output=embed"
                loading="lazy"
                allowFullScreen=""
              />
            </div>
          </div>

          <p className="contacto-outro">
            <strong>¡Te esperamos con gusto para ayudarte en todo lo que necesites!</strong> Estamos comprometidos con
            tu satisfacción.
          </p>
        </div>
      </section>
    </>
  )
}
