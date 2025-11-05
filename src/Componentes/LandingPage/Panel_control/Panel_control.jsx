"use client"
import { useNavigate } from "react-router-dom"
import "./Panel_control.css"
import { FaCubes, FaHandshake, FaChartBar, FaFileInvoice, FaArrowLeft } from "react-icons/fa"
import { IoPersonAdd } from "react-icons/io5"

const PanelControl = () => {
  const navigate = useNavigate()

  const menuItems = [
    { icon: <FaCubes size={24} />, label: "PRODUCTOS", path: "/lista_de_productos" },
    { icon: <FaHandshake size={24} />, label: "PROVEEDORES", path: "/lista_de_proveedores" },
    { icon: <FaFileInvoice size={24} />, label: "REMISIÓN", path: "/remision" },
    { icon: <IoPersonAdd size={24} />, label: "CREAR USUARIO", path: "/crear.usuario" },
    { icon: <FaChartBar size={24} />, label: "REPORTES", path: "/reportes" },
  ]

  return (
    <div className="sidebar-container">

      {/* Sidebar con items */}
      <nav className="sidebar">
        {menuItems.map((item, index) => (
          <div key={index} className="sidebar-item" onClick={() => navigate(item.path)}>
            <div className="sidebar-icon">{item.icon}</div>
            <span className="sidebar-label">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  )
}

export default PanelControl
