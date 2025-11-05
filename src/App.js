import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import LandingPage from "./Componentes/LandingPage/LandingPage"
import Login from "./Componentes/LandingPage/Login/Login"

import Layout from "./Componentes/LandingPage/Panel_control/Layout/Layout"
import PanelHome from "./Componentes/LandingPage/Panel_control/PanelHome"

import UsuariosLista from "./Componentes/LandingPage/Panel_control/Crear_Usuario/UsuariosLista"
import CrearUsuario from "./Componentes/LandingPage/Panel_control/Crear_Usuario/CrearUsuario"


import Lista_Productos from "./Componentes/LandingPage/Panel_control/In_Productos/In_Productos"
import Registrar_Productos from "./Componentes/LandingPage/Panel_control/In_Productos/registrar_producto"
import Modificar_productos from "./Componentes/LandingPage/Panel_control/In_Productos/modificar_productos"

import Lista_Proveedores from "./Componentes/LandingPage/Panel_control/In_Proveedores/In_Proveedores"
import Registrar_Proveedores from "./Componentes/LandingPage/Panel_control/In_Proveedores/registrar_Proveedor"
import Modificar_proveedor from "./Componentes/LandingPage/Panel_control/In_Proveedores/modificar_proveedor"

import Remision from "./Componentes/LandingPage/Panel_control/Remisiones/Remision"

import Reportes from "./Componentes/LandingPage/Panel_control/Reportes/Reportes"

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas SIN sidebar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ TODO lo que debe verse con el sidebar va DENTRO de Layout */}
        <Route element={<Layout />}>
          {/* puedes dejar /panel como “home del panel” */}
          <Route path="panel" element={<PanelHome />} />

          {/* Inventario */}
          <Route path="lista_de_productos" element={<Lista_Productos />} />
          <Route path="registro_de_productos" element={<Registrar_Productos />} />
          <Route path="modificar_productos" element={<Modificar_productos />} />

          {/* Proveedores */}
          <Route path="lista_de_proveedores" element={<Lista_Proveedores />} />
          <Route path="registro_de_proveedores" element={<Registrar_Proveedores />} />
          <Route path="modificar_proveedores" element={<Modificar_proveedor />} />

          {/* Usuarios */}
          <Route path="crear.usuario" element={<UsuariosLista />} />
          <Route path="usuarios/nuevo" element={<CrearUsuario />} />

          {/* Remisiones */}
          <Route path="remision" element={<Remision />} />

          {/* Reportes */}
          <Route path="reportes" element={<Reportes />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 24 }}>Página no encontrada</div>} />
      </Routes>
    </Router>
  )
}

export default App
