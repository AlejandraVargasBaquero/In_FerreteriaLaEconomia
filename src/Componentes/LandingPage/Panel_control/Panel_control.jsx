import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Panel_control.css';
import Atras from './atras.png';
import Logo from './logo.png';
import { FaCubes } from "react-icons/fa";
import { IoPersonAdd } from "react-icons/io5";
import { FaHandshake } from "react-icons/fa";


const PanelControl = () => {
  const navigate = useNavigate();

  return (
    <div className="panel">
      <img src={Atras} alt="Back" className="regresar" onClick={() => navigate('/login')} />
      <img src={Logo} alt="Logo" className="log0" />

      <div className="titu1o">
        <h1>PANEL DE CONTROL</h1>
        <h3 className='linealarga'>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h3>
      </div>

      <div className="cards">
        <div className="card" onClick={() => navigate("/lista_de_productos")}>
          <h3>PRODUCTOS</h3>
          <FaCubes size={50}/>
        </div>
        <div className="card" onClick={() => navigate("/lista_de_proveedores")}>
          <h3>PROVEEDORES</h3>
          <FaHandshake size={50}/>
        </div>
        <div className="card" onClick={() => navigate("/crear.usuario")}>
          <h3>CREAR USUARIO</h3>
          <IoPersonAdd size={40}/>
        </div>
      </div>
    </div>
  );
};

export default PanelControl;
