//rafce
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Atras from '../atras.png';
import Letrero from './letrero.png';
import '../In_Productos/In_Productos.css';

const In_Productos = () => {
  const [productos, setProductos] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [busquedaCategoria, setBusquedaCategoria] = useState('Todos');
  const navigate = useNavigate(); 

  useEffect(() => {
    fetch("http://localhost:8080/proveedores/obtener")
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
          <label>Buscar Proveedor:</label>
          <input
            type="text"
            value={busquedaNombre}
            onChange={e => setBusquedaNombre(e.target.value)}
            placeholder="Proveedor"
          />
        </div>

      </div>

      <div className="barra-superior">
        <div className="acciones">
          <button onClick={() => navigate('/registro_de_proveedores')}>MODIFICAR</button>
        </div>
      </div>

      

      <table className="tabla-productos">
        <thead>
          <tr>
            <th>Nombre del Proveedor</th>
            <th>NIT/CC</th>
            <th>Dirección</th>
            <th>Correo</th>
            <th>Telefono</th>
            <th>Compra</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map(p => (
            <tr key={p.idProveedor || p.id}>
              <td>{p.nombreProveedor}</td>
              <td>{p.proCC}</td>
              <td>{p.proDireccion}</td>
              <td>{p.proCorreo}</td>
              <td>{p.proTelefono}</td>
              <td>{p.proCompra}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default In_Productos;
