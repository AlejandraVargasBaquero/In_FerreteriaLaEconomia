// src/Componentes/LandingPage/Panel_control/Layout/Layout.jsx
import PanelControl from ".././Panel_control"
import { Outlet } from "react-router-dom"
import "./Layout.css"

export default function Layout() {
  return (
    <div className="layout-container">
      <PanelControl />
      <div className="layout-content">
        <Outlet /> {/* aquí se dibuja cada página */}
      </div>
    </div>
  )
}
