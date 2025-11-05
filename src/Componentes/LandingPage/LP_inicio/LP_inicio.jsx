import "./LP_inicio.css"
import Ferreteria_hero from "./ferreteria_hero.png"

const LP_inicio = () => {
  return (
    <section id="inicio" className="ferre-inicio">
      {/* ===== HERO PRINCIPAL ===== */}
      <div className="ferre-hero">
        <img className="ferre-hero__bg" src={Ferreteria_hero} alt="Fondo ferretería" />
        <div className="ferre-hero__shade" />
        <div className="ferre-hero__text">
          <h1>Ferretería La Economía A&amp;G</h1>
          <p>Ofrecemos productos de alta calidad al mejor precio.</p>
        </div>
      </div>

      {/* ===== SECCIÓN DE BIENVENIDA ===== */}
      <div className="ferre-bienvenida">
        <div className="ferre-bienvenida__inner">
          <h2 className="ferre-bienvenida__title">Bienvenido a La Economía A&amp;G</h2>
          <span className="ferre-bienvenida__bar" />

          <p className="ferre-bienvenida__lead">
            En <strong>La Economía A&amp;G</strong> no solo encontrarás productos; también soluciones, asesoría y el
            respaldo de un equipo dispuesto a ayudarte en cada proyecto.
          </p>
          <p className="ferre-bienvenida__lead">
            Ofrecemos <strong>productos de alta calidad</strong> al mejor precio, con atención cercana y confiable.
            ¡Construye con nosotros con toda confianza!
          </p>
          
        </div>
      </div>

      <span className="ferre-bienvenida__barr" />

      {/* ===== SECCIÓN INFORMATIVA ===== */}
      <div className="ferre-inicio__copy">

        <div className="ferre-inicio__grid">
          <p>
            En nuestra ferretería, la calidad y el buen precio siempre van de la mano. ¡Ven y descúbrelo!
          </p>
          <p>
            Te ayudamos a darle vida a tus ideas, desde un simple arreglo hasta el proyecto más grande.
          </p>
        </div>
      </div>
    </section>
  )
}

export default LP_inicio
