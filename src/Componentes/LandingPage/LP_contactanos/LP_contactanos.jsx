import React from 'react';
import './LP_contactanos.css';
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const LP_contactanos = () => {
  return (
    <div className="contactanos">
      <h3>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h3>
      <h1>CONTACTANOS</h1>
      <h3>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h3>

      <p className="intro">
        ¡Nos encantaría ayudarte! En La Economía A & G valoramos el trato directo, por eso nuestra atención 
        y asesoramiento son exclusivamente presenciales. Visítanos en nuestro local y recibe el acompañamiento 
        que necesitas de parte de nuestro equipo.
      </p>

      <div className="info">
        <div className="datos">
          <p><FaPhone className="icono" /> Teléfono: (123) 456-7890</p>
          <p><FaEnvelope className="icono" /> Correo: contacto@laeconomiaayg.com</p>
          <p><FaMapMarkerAlt className="icono" /> Dirección: Calle Principal #123, El Juncal, Neiva</p>
        </div>

        <div className="mapa">
          <iframe
            title="Mapa La Economía A & G"
            src="https://www.google.com/maps?q=El+Juncal+Neiva&output=embed"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>

      <p className="ultimo">¡Te esperamos con gusto para ayudarte en todo lo que necesites!</p>
    </div>
  );
};

export default LP_contactanos;
