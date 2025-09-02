//rafce
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Atras from '../atras.png';
import Letrero from './letrero.png';
import './In_Productos.css';

const In_Productos = () => {
  const [productos, setProductos] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [busquedaCategoria, setBusquedaCategoria] = useState('Todos');
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch("http://localhost:8080/productos/obtener")
      .then(res => res.json())
      .then(data => setProductos(data));
  }, []);


  const productosFiltrados = productos.filter(p => {
    const nombreMatch = p.nombreProducto.toLowerCase().includes(busquedaNombre.toLowerCase());
    const categoriaMatch = busquedaCategoria === 'Todos' || p.proCategoria === busquedaCategoria;
    return nombreMatch && categoriaMatch;
  });


  const categoriasUnicas = ['Todos', ...new Set(productos.map(p => p.proCategoria))];

  return (
    <div className="contenedor-inventario">
      <div className="ferreteriaimg">
        <img src={Letrero} alt="Letrero" />
      </div>
      <img src={Atras} className="boton-regresar" onClick={() => navigate('/panel')} />


      <div className="filtros">
        <div className="filtro">
          <label>Buscar Producto:</label>
          <input
            type="text"
            value={busquedaNombre}
            onChange={e => setBusquedaNombre(e.target.value)}
            placeholder="Producto"
          />
        </div>

        <div className="filtro">
          <label>Buscar Categoría:</label>
          <select
            value={busquedaCategoria}
            onChange={e => setBusquedaCategoria(e.target.value)}
          >
            {categoriasUnicas.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="barra-superior">
        <div className="acciones">
          <button onClick={() => navigate('/registro_de_productos')}>MODIFICAR</button>
        </div>
      </div>

      

      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Nombre del Producto</th>
            <th>Categoría</th>
            <th>Unidad</th>
            <th>Cantidad</th>
            <th>Precio Entrada</th>
            <th>Precio Salida</th>
            <th>Descuento (%)</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map(p => (
            <tr key={p.idProducto || p.id}>
              <td>{p.nombreProducto}</td>
              <td>{p.proCategoria}</td>
              <td>{p.proUnidad}</td>
              <td>{p.proCantidad}</td>
              <td>{p.proPrecioEntrada}</td>
              <td>{p.proPrecioSalida}</td>
              <td>{p.proDescuento}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default In_Productos;
