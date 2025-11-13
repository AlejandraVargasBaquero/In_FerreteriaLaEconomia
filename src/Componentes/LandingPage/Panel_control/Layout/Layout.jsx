import { Outlet } from "react-router-dom"
import PanelControl from ".././Panel_control"
import "./Layout.css"

export default function Layout() {
  // Cargamos el rol y permisos desde localStorage (guardados en el login)
  const permisos = JSON.parse(localStorage.getItem("permisos") || "{}")
  const rol = localStorage.getItem("rol") || "EMPLEADO"

  return (
    <div className="layout-container">
      {/* Panel lateral dinámico según rol */}
      <PanelControl permisos={permisos} rol={rol} />

      {/* Contenido principal */}
      <div className="layout-content">
        <Outlet /> {/* aquí se dibuja cada página */}
      </div>
    </div>
  )
}
