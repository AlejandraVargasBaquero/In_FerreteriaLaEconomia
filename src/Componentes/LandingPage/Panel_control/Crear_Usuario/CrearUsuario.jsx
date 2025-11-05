// src/Componentes/LandingPage/Panel_control/Crear_Usuario/CrearUsuario.jsx
"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { FaUser, FaEnvelope, FaLock, FaIdCard, FaMapMarkerAlt, FaUserTag } from "react-icons/fa"
import "./crear.css"

const API_BASE = "" // proxy CRA
const CREATE_URL = `${API_BASE}/prueba/guardar/usuario` // => "/prueba/guardar/usuario"

export default function CrearUsuario() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    perNombre: "",
    perApellido: "",
    perTipoDocumento: "",
    perIdentidad: "",
    perDireccion: "",
    idRol: "",
  })

  const [okMsg, setOkMsg] = useState("")
  const [errMsg, setErrMsg] = useState("")

  const clearMessages = () => { setOkMsg(""); setErrMsg("") }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    clearMessages()
  }

  const handleReset = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      perNombre: "",
      perApellido: "",
      perTipoDocumento: "",
      perIdentidad: "",
      perDireccion: "",
      idRol: "",
    })
    clearMessages()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearMessages()
    try {
      const response = await fetch(CREATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!response.ok) {
        const txt = await response.text().catch(() => "")
        throw new Error(`No se pudo guardar. ${txt || ""}`)
      }
      setOkMsg("✅ Usuario guardado correctamente.")
      handleReset()
    } catch (error) {
      console.error("Error:", error)
      setErrMsg("❌ Error al guardar usuario. Revisa los datos o el servidor.")
    }
  }

  return (
    <div className="crear-container">
      <div className="crear-header" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>
          <h1 className="crear-title" style={{marginBottom:4}}>Crear Nuevo Usuario</h1>
          <p className="crear-subtitle" style={{marginTop:0}}>Registra usuarios</p>
        </div>

        {/* volver a la lista dentro de tu Layout */}
        <Link to="/crear.usuario" className="btn-limpiar" style={{ textDecoration: "none" }}>
          Volver a la lista
        </Link>
      </div>

      {okMsg && <div className="alert ok">{okMsg}</div>}
      {errMsg && <div className="alert error">{errMsg}</div>}

      <form onSubmit={handleSubmit} className="crear-form" style={{width:"100%"}}>
        <div className="form-grid">
          <div className="form-field">
            <label><FaUser /> Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Ingrese username" required />
          </div>

          <div className="form-field">
            <label><FaEnvelope /> Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@ejemplo.com" required />
          </div>

          <div className="form-field">
            <label><FaLock /> Contraseña</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
          </div>

          <div className="form-field">
            <label><FaUser /> Nombre</label>
            <input type="text" name="perNombre" value={formData.perNombre} onChange={handleChange} placeholder="Nombre" required />
          </div>

          <div className="form-field">
            <label><FaUser /> Apellido</label>
            <input type="text" name="perApellido" value={formData.perApellido} onChange={handleChange} placeholder="Apellido" required />
          </div>

          <div className="form-field">
            <label><FaIdCard /> Tipo de Documento</label>
            <input type="text" name="perTipoDocumento" value={formData.perTipoDocumento} onChange={handleChange} placeholder="CC, TI, CE..." required />
          </div>

          <div className="form-field">
            <label><FaIdCard /> Número de Documento</label>
            <input type="text" name="perIdentidad" value={formData.perIdentidad} onChange={handleChange} placeholder="Número de documento" required />
          </div>

          <div className="form-field">
            <label><FaMapMarkerAlt /> Dirección</label>
            <input type="text" name="perDireccion" value={formData.perDireccion} onChange={handleChange} placeholder="Dirección completa" required />
          </div>

          <div className="form-field">
            <label><FaUserTag /> Rol</label>
            <select name="idRol" value={formData.idRol} onChange={handleChange} required>
              <option value="">Seleccionar rol</option>
              <option value="1">Administrativo</option>
              <option value="2">Empleado</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-guardar">Guardar Usuario</button>
          <button type="button" onClick={handleReset} className="btn-limpiar">Limpiar Formulario</button>
        </div>
      </form>
    </div>
  )
}
