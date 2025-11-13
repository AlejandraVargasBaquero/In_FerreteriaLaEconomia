import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"

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

// 🔐 Guards de rol
import RequireRole from "./auth/RequireRole"
import { ROLE_ADMIN, ROLE_EMP } from "./auth/roles"

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas SIN sidebar */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ TODO lo que debe verse con el sidebar va DENTRO de Layout */}
        <Route element={<Layout />}>
          {/* Home panel (admin o empleado) */}
          <Route
            path="panel"
            element={
              <RequireRole allow={[ROLE_ADMIN, ROLE_EMP]}>
                <PanelHome />
              </RequireRole>
            }
          />
          {/* Alias para que /Panel redirija correctamente si llega con mayúscula */}
          <Route path="Panel" element={<Navigate to="/panel" replace />} />

          {/* ===== Empleado y Admin ===== */}
          <Route
            path="lista_de_productos"
            element={
              <RequireRole allow={[ROLE_ADMIN, ROLE_EMP]}>
                <Lista_Productos />
              </RequireRole>
            }
          />
          <Route
            path="remision"
            element={
              <RequireRole allow={[ROLE_ADMIN, ROLE_EMP]}>
                <Remision />
              </RequireRole>
            }
          />

          {/* ===== Solo Admin ===== */}
          <Route
            path="registro_de_productos"
            element={
              <RequireRole allow={[ROLE_ADMIN]}>
                <Registrar_Productos />
              </RequireRole>
            }
          />
          <Route
            path="modificar_productos"
            element={
              <RequireRole allow={[ROLE_ADMIN]}>
                <Modificar_productos />
              </RequireRole>
            }
          />
          <Route
            path="lista_de_proveedores"
            element={
              <RequireRole allow={[ROLE_ADMIN]}>
                <Lista_Proveedores />
              </RequireRole>
            }
          />
          <Route
            path="registro_de_proveedores"
            element={
              <RequireRole allow={[ROLE_ADMIN]}>
                <Registrar_Proveedores />
              </RequireRole>
            }
          />
          <Route
            path="modificar_proveedores"
            element={
              <RequireRole allow={[ROLE_ADMIN]}>
                <Modificar_proveedor />
              </RequireRole>
            }
          />

          {/* Usuarios (solo Admin) */}
          <Route
            path="crear.usuario"
            element={
              <RequireRole allow={[ROLE_ADMIN]}>
                <UsuariosLista />
              </RequireRole>
            }
          />
          <Route
            path="usuarios/nuevo"
            element={
              <RequireRole allow={[ROLE_ADMIN]}>
                <CrearUsuario />
              </RequireRole>
            }
          />

          {/* Reportes (solo Admin) */}
          <Route
            path="reportes"
            element={
              <RequireRole allow={[ROLE_ADMIN]}>
                <Reportes />
              </RequireRole>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<div style={{ padding: 24 }}>Página no encontrada</div>} />
      </Routes>
    </Router>
  )
}

export default App
