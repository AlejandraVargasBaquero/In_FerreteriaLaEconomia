import React, { useState, useEffect } from 'react';
import Atras from '../atras.png'
import { useNavigate } from 'react-router-dom';
import Letrero from './letrero.png'
import '../In_Productos/registrar_producto'

const RegistrarProducto = () => {
  const navigate = useNavigate();
  const [producto, setProducto] = useState({
    nombreProducto: '',
    proCategoria: '',
    proUnidad: 0,
    proCantidad: 0,
    proPrecioEntrada: 0,
    proPrecioSalida: 0,
    proDescuento: 0
  });

  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditar, setIdEditar] = useState(null);

  const [busquedaNombre, setBusquedaNombre] = useState('');
  const [busquedaCategoria, setBusquedaCategoria] = useState('');

  const fetchProductos = async () => {
    const res = await fetch("http://localhost:8080/productos/obtener");
    const data = await res.json();
    setProductos(data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = modoEdicion
      ? `http://localhost:8080/productos/${idEditar}`
      : "http://localhost:8080/productos/guardar";

    const method = modoEdicion ? 'PUT' : 'POST';

    await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ...producto, id: idEditar })
    });

    setProducto({
      nombreProducto: '',
      proCategoria: '',
      proUnidad: 0,
      proCantidad: 0,
      proPrecioEntrada: 0,
      proPrecioSalida: 0,
      proDescuento: 0
    });
    setModoEdicion(false);
    setIdEditar(null);
    fetchProductos();
  };

  const handleEditar = (prod) => {
    setProducto(prod);
    setModoEdicion(true);
    setIdEditar(prod.idProducto || prod.id);
  };

  const handleEliminar = async (id) => {
    await fetch(`http://localhost:8080/productos/${id}`, { method: 'DELETE' });
    fetchProductos();
  };

  const categoriasUnicas = [...new Set(productos.map(p => p.proCategoria))];

  const productosFiltrados = productos.filter(p =>
    p.nombreProducto.toLowerCase().includes(busquedaNombre.toLowerCase()) &&
    (busquedaCategoria === '' || p.proCategoria === busquedaCategoria)
  );

  return (
    <div className='registrar-productos'>
      <div className="ferreteriaimg">
        <img src={Letrero}  />
      </div>
      <img src={Atras}  className="boton--regresar" onClick={() => navigate('/lista_de_proveedores')} />
      <div className='partedearriba'>
        <h2>Registrar Proveedor</h2>
        <h3>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</h3>
      </div>
      

      <form  className='formregistro' onSubmit={handleSubmit}>
        <div className='uno'>
          <div className="grupo">
            <label>Nombre del Producto</label>
            <input name="nombreProducto" placeholder="Nombre" value={producto.nombreProducto} onChange={handleChange} required />
          </div>
          <div className="grupo">
            <label>Categoría</label>
            <input name="proCategoria" placeholder="Categoría" value={producto.proCategoria} onChange={handleChange} required />
          </div>
          <div className="grupo">
            <label>Unidad</label>
            <input name="proUnidad" type="number" placeholder="Unidad" value={producto.proUnidad} onChange={handleChange} required />
          </div>
          <div className="grupo">
            <label>Cantidad</label>
            <input name="proCantidad" type="number" placeholder="Cantidad" value={producto.proCantidad} onChange={handleChange} required />
          </div>
        </div>

        <div className='dos'>
          <div className="grupo">
            <label>Precio de Entrada</label>
            <input name="proPrecioEntrada" type="number" placeholder="Precio Entrada" value={producto.proPrecioEntrada} onChange={handleChange} required />
          </div>
          <div className="grupo">
            <label>Precio de Salida</label>
            <input name="proPrecioSalida" type="number" placeholder="Precio Salida" value={producto.proPrecioSalida} onChange={handleChange} required />
          </div>
          <div className="grupo">
            <label>Descuento (%)</label>
            <input name="proDescuento" type="number" placeholder="Descuento" value={producto.proDescuento} onChange={handleChange} required />
          </div>
          <button className='guardarcambios'>{modoEdicion ? "Actualizar" : "Guardar"}</button>
        </div>
      </form>

      <div className="filtros">
        <div className="filtro">
          <label htmlFor="busquedaNombre">Buscar Nombre:</label>
          <input
            type="text"
            id="busquedaNombre"
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            placeholder="Producto"
          />
        </div>
      </div>

      <table className='tabla-productos'>
        <thead>
          <tr>
            <th>Nombre del Proveedor</th>
            <th>NIT/CC</th>
            <th>Dirección</th>
            <th>Telefono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((p) => (
            <tr key={p.idProveedor || p.id}>
              <td>{p.nombreProveedor}</td>
              <td>{p.proCC}</td>
              <td>${p.proDireccion}</td>
              <td>${p.proTelefono}</td>
              <td>
                <button className='guardacambios' onClick={() => handleEditar(p)} style={{ marginRight: "5px" }}>Editar</button>
                <button className='guardacambios' onClick={() => handleEliminar(p.idProducto || p.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegistrarProducto;
