import React, { useState } from 'react';
import LP_inicio from './LP_inicio/LP_inicio';
import LP_contactanos from './LP_contactanos/LP_contactanos';
import LP_productos from './LP_productos/LP_productos';
import Login from './Login/Login';
import './LandingPage.css';
import imagenferreteria from'./Login/logo.png';

const LandingPage = () => {
  const [seccion, setSeccion] = useState("inicio");

  return (
    <div>
      <nav  className='header'>
        <div className='imagenferreteria'>
          <img src={imagenferreteria} />
        </div>
        <div className='enlaces'>
          <button onClick={() => setSeccion("inicio")}> <h3>Inicio</h3></button>
          <button onClick={() => setSeccion("productos")}><h3>Productos</h3></button>
          <button onClick={() => setSeccion("contactanos")}><h3>Contactanos</h3></button>
        </div>
        <div className='enlacelogin'>
          <button onClick={() => window.open("http://localhost:3000/login", "_blank")}>Login</button>
        </div>
      </nav>

      {seccion === "inicio" && <LP_inicio />}
      {seccion === "productos" && <LP_productos />}
      {seccion === "contactanos" && <LP_contactanos />}
      {seccion === "login" && <Login />}

      <footer className='abajo'>
        <div className='textoabajo'>
          <p>Calidad que construye.</p>
          <p>Tu ferretería de confianza.</p>
          <p>Herramientas, soluciones, y servicio.</p>
        </div>
        <div className='despedida'>
          <h3>━━━━━━━━━━━━━━━━━━━</h3> 
          <p>Gracias por visitarnos</p>
          <h3>━━━━━━━━━━━━━━━━━━━</h3> 
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
