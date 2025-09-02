import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Componentes/LandingPage/LandingPage';
import Login from './Componentes/LandingPage/Login/Login';
import Panel from './Componentes/LandingPage/Panel_control/Panel_control'
import Crear_Usuario from './Componentes/LandingPage/Panel_control/Crear_Usuario/crear'
import Lista_Productos from './Componentes/LandingPage/Panel_control/In_Productos/In_Productos'
import Registrar_Productos from './Componentes/LandingPage/Panel_control/In_Productos/registrar_producto'
import Lista_Proveedores from './Componentes/LandingPage/Panel_control/In_Proveedores/In_Proveedores'
import Registrar_Proveedores from './Componentes/LandingPage/Panel_control/In_Proveedores/registrar_Proveedor'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/panel" element={<Panel />} />
        <Route path="/lista_de_productos" element={<Lista_Productos />} />
        <Route path="/registro_de_productos" element={<Registrar_Productos />} />
        <Route path="/lista_de_proveedores" element={<Lista_Proveedores />} />
        <Route path="/registro_de_proveedores" element={<Registrar_Proveedores />} />
        <Route path="/crear.usuario" element={<Crear_Usuario />} />
      </Routes>
    </Router>
  );
}

export default App;
