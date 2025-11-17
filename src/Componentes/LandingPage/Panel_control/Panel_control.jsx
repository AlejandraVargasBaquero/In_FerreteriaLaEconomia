"use client"
import { useNavigate } from "react-router-dom"
import "./Panel_control.css"
import {
  FaCubes,
  FaHandshake,
  FaChartBar,
  FaFileInvoice,
  FaArrowLeft,
  FaSignOutAlt,
  FaUserCircle
} from "react-icons/fa"
import { IoPersonAdd } from "react-icons/io5"

// Obtener rol
const getRole = () =>
  (localStorage.getItem("rol") || localStorage.getItem("role") || "").toUpperCase()

// Obtener permisos
const getPermisos = () => {
  try {
    return JSON.parse(localStorage.getItem("permisos") || "{}")
  } catch {
    return {}
  }
}

// Obtener nombre del usuario desde sessionUser.displayName
const getUsuarioActual = () => {
  try {
    const raw = localStorage.getItem("sessionUser")
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.displayName) return parsed.displayName
    }
  } catch {}

  return "Usuario activo"
}

const PanelControl = () => {
  const navigate = useNavigate()

  const rol = getRole()
  const permisos = getPermisos()
  const usuarioActual = getUsuarioActual()

  const esAdmin =
    rol.includes("ADMIN") ||
    permisos?.crearUsuario ||
    permisos?.reportes ||
    permisos?.modificarProductos

  const menuItems = [
    { icon: <FaCubes size={24} />, label: "PRODUCTOS", path: "/lista_de_productos", visible: true },
    { icon: <FaHandshake size={24} />, label: "PROVEEDORES", path: "/lista_de_proveedores", visible: esAdmin },
    { icon: <FaFileInvoice size={24} />, label: "REMISIÓN", path: "/remision", visible: true },
    { icon: <IoPersonAdd size={24} />, label: "CREAR USUARIO", path: "/crear.usuario", visible: esAdmin },
    { icon: <FaChartBar size={24} />, label: "REPORTES", path: "/reportes", visible: esAdmin },

    // Cerrar sesión
    { icon: <FaSignOutAlt size={24} />, label: "CERRAR SESIÓN", logout: true, visible: true }
  ]

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login")
  }

  const logoutItem = menuItems.find(i => i.logout)
  const mainItems = menuItems.filter(i => !i.logout && i.visible)

  return (
    <div className="sidebar-container">

      {/* Header con logo */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <span>LOGO</span>
        </div>

        <button className="back-button" onClick={() => navigate("/login")} aria-label="Regresar">
          <FaArrowLeft size={20} />
        </button>
      </div>

      <nav
        className="sidebar"
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >

        {/* 🔹 Usuario arriba */}
        <div
          className="sidebar-user"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "18px 8px",
            color: "white",
          }}
        >
          <FaUserCircle size={34} style={{ marginBottom: 6 }} />

          <span
            style={{
              fontSize: "13px",
              fontWeight: 600,
              textAlign: "center",
              maxWidth: "140px",
              lineHeight: "16px",
              wordBreak: "break-word",
            }}
          >
            {usuarioActual}
          </span>
        </div>

        {/* 🔹 Línea blanca más clara */}
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "rgba(255,255,255,0.35)",
            margin: "6px 0 14px 0"
          }}
        ></div>

        {/* 🔹 Menú centrado entre las dos líneas */}
        <div
          className="sidebar-menu"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            justifyContent: "center",
            height: "100%",
          }}
        >
          {mainItems.map((item, index) => (
            <div
              key={index}
              className="sidebar-item"
              onClick={() => navigate(item.path)}
            >
              <div className="sidebar-icon">{item.icon}</div>
              <span className="sidebar-label">{item.label}</span>
            </div>
          ))}
        </div>

        {/* 🔹 Línea blanca arriba del botón cerrar sesión */}
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "rgba(255,255,255,0.35)",
            margin: "14px 0"
          }}
        ></div>

        {/* 🔹 Cerrar sesión abajo */}
        {logoutItem && (
          <div
            className="sidebar-item"
            onClick={handleLogout}
            style={{ marginBottom: "6px" }}
          >
            <div className="sidebar-icon">{logoutItem.icon}</div>
            <span className="sidebar-label">{logoutItem.label}</span>
          </div>
        )}
      </nav>
    </div>
  )
}

export default PanelControl
