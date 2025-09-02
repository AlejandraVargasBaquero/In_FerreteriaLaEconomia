import React, { useState } from 'react';
import './Login.css';
import { FaUserCircle } from "react-icons/fa";
import logo from './logo.png'; 

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 

    fetch("http://localhost:8080/api/login/prueba", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        usernameOrEmail: correo,  
        password: password
      })
    })
    .then(response => {
      if (!response.ok) throw new Error("Credenciales inválidas");
      return response.text(); 
    })
    .then(data => {
      window.location.href = "http://localhost:3000/Panel"; 
    })
    .catch(error => {
      alert(error.message); 
    });
  };

  return (
    <div className='clase1'>
        <form onSubmit={handleSubmit}>
            <img className='logo' src={logo} />
            <div className='imagen'>
                <FaUserCircle />
            </div>
            <div className='login-registro'>
                <h3>Usuario</h3>
                <input 
                  type="text" 
                  placeholder=' Username' 
                  required 
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
            </div>
            <div className='login-registro'>
                <h3>Constraseña</h3>
                <input 
                  type="password" 
                  placeholder=' ******' 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className='recuperarcontraseña'>
                <a href="#">¿Olvidaste tu contraseña?</a>
            </div>
            <div className='boton'>
                <button type="submit">Login</button>
            </div>
        </form>
    </div>
  )
}

export default Login;
