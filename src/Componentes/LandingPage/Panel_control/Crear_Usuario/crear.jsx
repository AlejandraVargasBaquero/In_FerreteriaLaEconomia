import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Atras from '../atras.png'
import './crear.css';

function Crear() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    perNombre: '',
    perApellido: '',
    perTipoDocumento: '',
    perIdentidad: '',
    perDireccion: '',
    idRol: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8080/prueba/guardar/usuario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Usuario guardado correctamente');
      } else {
        alert('Error al guardar usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al conectar con el servidor');
    }
  };

  const handleReset = () => {
    setFormData({
      username: '',
      email: '',
      password: '',
      perNombre: '',
      perApellido: '',
      perTipoDocumento: '',
      perIdentidad: '',
      perDireccion: '',
      idRol: ''
    });
  };

  return (
    <div className="crear">
      <img src={Atras}  className="boton---regresar" onClick={() => navigate('/panel')} />

      <form onSubmit={handleSubmit}>
        <div className="requerimientos">
          <h3>Username:</h3>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
          />
        </div>
        <div className="requerimientos">
          <h3>Email:</h3>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="email@example.com"
            required
          />
        </div>
        <div className="requerimientos">
          <h3>Contraseña:</h3>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="******"
            required
          />
        </div>
        <div className="requerimientos">
          <h3>Nombre:</h3>
          <input
            type="text"
            name="perNombre"
            value={formData.perNombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
        </div>
        <div className="requerimientos">
          <h3>Apellido:</h3>
          <input
            type="text"
            name="perApellido"
            value={formData.perApellido}
            onChange={handleChange}
            placeholder="Apellido"
            required
          />
        </div>

        <div className="requerimientos">
          <h3>Documento:</h3>
          <input
            type="text"
            name="perTipoDocumento"
            value={formData.perTipoDocumento}
            onChange={handleChange}
            placeholder="Tipo documento"
            required
          />
        </div>
        <div className="requerimientos">
          <h3>Número:</h3>
          <input
            type="text"
            name="perIdentidad"
            value={formData.perIdentidad}
            onChange={handleChange}
            placeholder="Número documento"
            required
          />
        </div>
        <div className="requerimientos">
          <h3>Dirección:</h3>
          <input
            type="text"
            name="perDireccion"
            value={formData.perDireccion}
            onChange={handleChange}
            placeholder="Dirección"
            required
          />
        </div>
        <div className="requerimientos">
          <h3>Rol:</h3>
          <select
            name="idRol"
            value={formData.idRol}
            onChange={handleChange}
            required
          >
            <option value="1">Seleccionar rol</option>
            <option value="1">Administrativo</option>
            <option value="2">Empleado</option>
          </select>
        </div>

        <div className="boton_acciones">
          <button type="button" className="boton_limpiar" onClick={handleReset}>Limpiar</button>
          <button type="submit">Guardar</button>
        </div>
      </form>
    </div>
  );
}

export default Crear;
