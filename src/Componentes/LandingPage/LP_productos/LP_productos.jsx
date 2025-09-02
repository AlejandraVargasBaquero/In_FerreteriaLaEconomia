import React from 'react';
import './LP_productos.css';
import { IoMdArrowDroprightCircle } from "react-icons/io";
import Brochas from './ImagenesProductos/brochas.png';
import Cemento from './ImagenesProductos/cemento.png';
import Tuberias from './ImagenesProductos/tuberia.png';
import Pintura from './ImagenesProductos/pintura.png';
import Herramientas from './ImagenesProductos/electrico.png';
import Ladrillo from './ImagenesProductos/ladrillo.png';
import Alicate from './ImagenesProductos/alicate.png';
import Tornillos from './ImagenesProductos/tornillos.png';


const LP_productos = () => {
  return (
    <div className="productos">
      <h3>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h3>
      <h1>PRODUCTOS</h1>
      <h3>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h3>
      <div className='imagenesproductos'>
        <div className='img1'>
          <img src={Cemento} />
          <img src={Ladrillo} />
          <img src={Herramientas} />
          <img src={Tornillos} />
        </div>
        <div className='img1'>
          <img src={Pintura} />
          <img src={Tuberias} />
          <img src={Brochas} />
          <img src={Alicate} />
        </div>
        <h3>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h3>
      </div>
      <p>Aquí encontrarás los materiales más buscados de nuestra ferretería: La Economía A & G</p>
      <p>Contamos con una amplia selección de productos esenciales para construcción, plomería, electricidad, herramientas y mucho más.</p>
      <p>¡Todo lo que necesitas, en un solo lugar y al mejor precio!</p>
      <div className=''>
        <p>Tenemos todo lo que necesitas</p>
        <h3>━━━━━━━━━━━━━━━━━━━━━━━━━━━</h3>
        <div className='inventario'>
          <div className='inventario1'>
            <div className='numero1'><p><IoMdArrowDroprightCircle />   Cemento, ladrillos y arena</p><p><IoMdArrowDroprightCircle />   Herramientas eléctricas</p></div>
            <div className='numero2'><p><IoMdArrowDroprightCircle />  Tuberías y accesorios</p><p><IoMdArrowDroprightCircle />   Pinturas y brochas</p></div>
          </div>
        </div>
        <h3>━━━━━━━━━━━━━━━━━━━━━━━━━━━</h3>
      </div>
    </div>
  );
}

export default LP_productos;
