"use client"
import { useNavigate } from "react-router-dom"
import "./Panel_control.css"
import { FaCubes, FaHandshake, FaChartBar, FaFileInvoice, FaArrowLeft } from "react-icons/fa"
import { IoPersonAdd } from "react-icons/io5"

const getRole = () => (localStorage.getItem("rol") || localStorage.getItem("role") || "").toUpperCase()
const getPermisos = () => {
  try { return JSON.parse(localStorage.getItem("permisos") || "{}") }
  catch { return {} }
}

const PanelControl = () => {
  const navigate = useNavigate()

  // PERMISOS EXACTAMENTE COMO LOS USABAS ANTES
  const rol = getRole()
  const permisos = getPermisos()

  const esAdmin =
    rol.includes("ADMIN") ||
    permisos?.crearUsuario ||
    permisos?.reportes ||
    permisos?.modificarProductos

  // FILTRAR ITEMS SEGÚN PERMISOS
  const menuItems = [
    { icon: <FaCubes size={24} />, label: "PRODUCTOS", path: "/lista_de_productos", visible: true },
    { icon: <FaHandshake size={24} />, label: "PROVEEDORES", path: "/lista_de_proveedores", visible: esAdmin },
    { icon: <FaFileInvoice size={24} />, label: "REMISIÓN", path: "/remision", visible: true },
    { icon: <IoPersonAdd size={24} />, label: "CREAR USUARIO", path: "/crear.usuario", visible: esAdmin },
    { icon: <FaChartBar size={24} />, label: "REPORTES", path: "/reportes", visible: esAdmin },
  ]

  return (
    <div className="sidebar-container">
      {/* Header con logo y botón de regreso */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span>LOGO</span>
        </div>
        <button className="back-button" onClick={() => navigate("/login")} aria-label="Regresar">
          <FaArrowLeft size={20} />
        </button>
      </div>

      {/* Sidebar con items */}
      <nav className="sidebar">
        {menuItems
          .filter((item) => item.visible)     // ← AQUI OCULTAMOS LO QUE NO LE TOCA AL EMPLEADO
          .map((item, index) => (
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
