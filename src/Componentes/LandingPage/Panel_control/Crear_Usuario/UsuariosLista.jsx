"use client"

import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { FaTrashAlt, FaSearch } from "react-icons/fa"
import "./crear.css"

// Endpoints RELATIVOS (con tu setupProxy.js)
const LIST_URL = "/pruebalistar/persona"
const DELETE_URL_BASE = "/prueba/eliminar/persona"

export default function UsuariosLista() {
  const [usuarios, setUsuarios] = useState([])
  const [loadingLista, setLoadingLista] = useState(false)
  const [busqueda, setBusqueda] = useState("")
  const [okMsg, setOkMsg] = useState("")
  const [errMsg, setErrMsg] = useState("")

  const clearMessages = () => { setOkMsg(""); setErrMsg("") }

  const loadUsuarios = async () => {
    try {
      setLoadingLista(true)
      const res = await fetch(LIST_URL)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setUsuarios(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error("Error listando usuarios:", e)
      setUsuarios([])
      setErrMsg("No se pudo cargar la información. Revisa el backend.")
    } finally {
      setLoadingLista(false)
    }
  }

  useEffect(() => { loadUsuarios() }, [])

  // ===== Helpers (como antes) =====
  const idUsuario = (u) =>
    u.id ?? u.idPersona ?? u.userId ?? u.idUsuario ?? u.id_persona ?? null

  const normalizaNombre = (u) => {
    const nombre = u.perNombre ?? u.per_nombre ?? u.nombre ?? ""
    const apellido = u.perApellido ?? u.per_apellido ?? u.apellido ?? ""
    const full = [nombre, apellido].filter(Boolean).join(" ").trim()
    return full || "—"
  }

  const getCorreo = (u) => u.email ?? u.correo ?? "—"
  const getDocumento = (u) => u.perIdentidad ?? u.per_identidad ?? u.identificacion ?? "—"

  const bloqueoAdmin = (u) => normalizaNombre(u).toLowerCase() === "alejandra vargas"

  // ===== Búsqueda =====
  const usuariosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return usuarios
    return usuarios.filter((u) => {
      const id = String(idUsuario(u) ?? "").toLowerCase()
      const nombre = normalizaNombre(u).toLowerCase()
      const email = String(getCorreo(u) ?? "").toLowerCase()
      const doc = String(getDocumento(u) ?? "").toLowerCase()
      return id.includes(q) || nombre.includes(q) || email.includes(q) || doc.includes(q)
    })
  }, [usuarios, busqueda])

  // ===== Eliminar =====
  const handleEliminar = async (u) => {
    clearMessages()
    if (bloqueoAdmin(u)) {
      setErrMsg("⚠️ Esta cuenta (Alejandra Vargas) no se puede eliminar.")
      return
    }
    const id = idUsuario(u)
    if (!id) { setErrMsg("No se pudo identificar el ID del usuario."); return }

    const confirmar = window.confirm(`¿Eliminar la cuenta de "${normalizaNombre(u)}"?`)
    if (!confirmar) return

    try {
      const res = await fetch(`${DELETE_URL_BASE}/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setOkMsg("🗑️ Usuario eliminado correctamente.")
      loadUsuarios()
    } catch (e) {
      console.error("Error al eliminar:", e)
      setErrMsg("❌ No se pudo eliminar el usuario.")
    }
  }

  // Grilla 5 columnas (ID | Nombre | Correo | Documento | Acciones)
  const grid5 = {
    display: "grid",
    gridTemplateColumns: "90px 1.6fr 1.4fr 1fr 130px",
    alignItems: "center",
  }

  return (
    <div className="crear-container">
      <div className="crear-header" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
        <div>
          <h1 className="crear-title" style={{marginBottom:4}}>Cuentas de Usuario</h1>
          <p className="crear-subtitle" style={{marginTop:0}}>Gestión de usuarios existentes</p>
        </div>

        {/* Botón → formulario como lo tenías */}
        <Link to="/usuarios/nuevo" className="btn-guardar" style={{textDecoration:"none"}}>
          Nuevo Usuario
        </Link>
      </div>

      {okMsg && <div className="alert ok">{okMsg}</div>}
      {errMsg && <div className="alert error">{errMsg}</div>}

      <aside className="panel-lista" style={{width:"100%"}}>
        <div className="lista-header">
          <h2>👥 Cuentas creadas</h2>
          <div className="buscador">
            <FaSearch />
            <input
              type="text"
              placeholder="Buscar por rol, nombre, correo o documento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>

        <div className="tabla-usuarios">
          <div className="trow thead" style={grid5}>
            <div>ID</div>
            <div>NOMBRE</div>
            <div>CORREO</div>
            <div>DOCUMENTO</div>
            <div></div>
          </div>

          {loadingLista && (
            <div className="trow" style={grid5}>
              <div className="c100">Cargando usuarios…</div>
            </div>
          )}

          {!loadingLista && usuariosFiltrados.length === 0 && (
            <div className="trow" style={grid5}>
              <div className="c100">No hay usuarios para mostrar.</div>
            </div>
          )}

          {!loadingLista && usuariosFiltrados.map((u) => {
            const id = idUsuario(u)
            return (
              <div key={id ?? normalizaNombre(u) + getDocumento(u)} className="trow" style={grid5}>
                <div>{id ?? "—"}</div>
                <div className="strong">{normalizaNombre(u)}</div>
                <div>{getCorreo(u)}</div>
                <div>{getDocumento(u)}</div>
                <div className="acciones-celda">
                  <button
                    className="btn-eliminar"
                    disabled={bloqueoAdmin(u)}
                    title={bloqueoAdmin(u) ? "No se puede eliminar esta cuenta" : "Eliminar usuario"}
                    onClick={() => handleEliminar(u)}
                  >
                    <FaTrashAlt />
                    <span>Eliminar</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </aside>
    </div>
  )
}
