"use client"

import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { FaTrashAlt, FaSearch } from "react-icons/fa"
import "./crear.css"

const API_BASE = "http://localhost:8080"
const LIST_URL = `${API_BASE}/api/usuarios/listar`              // trae personaId
const DELETE_URL_BASE = `${API_BASE}/prueba/eliminar/persona`   // DELETE /{personaId}

export default function UsuariosLista() {
  const [usuarios, setUsuarios] = useState([])
  const [loadingLista, setLoadingLista] = useState(false)
  const [busqueda, setBusqueda] = useState("")

  const loadUsuarios = async () => {
    try {
      setLoadingLista(true)
      const res = await fetch(LIST_URL, {
        method: "GET",
        mode: "cors",
        headers: { Accept: "application/json" },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setUsuarios(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error("Error listando usuarios:", e)
      setUsuarios([])
    } finally {
      setLoadingLista(false)
    }
  }

  useEffect(() => { loadUsuarios() }, [])

  // ===== Helpers =====
  // ID visual (muestra id de persona si existe, para que coincida con el borrado)
  const getIdVisual = (u) =>
    u.personaId ?? u.idPersona ?? u.id ?? u.idUsuario ?? u.userId ?? u.id_persona ?? null

  // Para eliminar, usamos personaId
  const getIdParaEliminar = (u) =>
    u.personaId ?? u.idPersona ?? u.id_persona ?? null

  const getNombre = (u) =>
    (u.nombre ?? u.perNombre ?? u.per_nombre ?? "").toString().trim()

  const getApellido = (u) =>
    (u.apellido ?? u.perApellido ?? u.per_apellido ?? "").toString().trim()

  const getNombreCompleto = (u) => {
    const full = [getNombre(u), getApellido(u)].filter(Boolean).join(" ").trim()
    return full || "—"
  }

  const getCorreo = (u) =>
    (u.email ?? u.correo ?? u.usuario?.email ?? u.usuario?.correo ?? "—").toString()

  const getDocumento = (u) =>
    (u.documento ?? u.perIdentidad ?? u.per_identidad ?? u.identificacion ?? u.doc ?? "—").toString()

  const normalizaRol = (r) => {
    const x = (r ?? "").toString().toLowerCase()
    if (!x) return "—"
    if (x.includes("admin")) return "Administrador"
    if (x.includes("emple")) return "Empleado"
    if (x.startsWith("rol_")) return x.replace(/^rol_/, "").toUpperCase()
    return r.charAt(0).toUpperCase() + r.slice(1)
  }

  const getRol = (u) => normalizaRol(u.rol ?? u.role ?? "")

  const getPasswordDisplay = (u) => {
    const raw =
      u.password ?? u.contrasena ?? u.clave ?? u.pass ?? u.usuario?.password ?? u.usuario?.contrasena ?? ""
    const pwd = (raw ?? "").toString()
    if (!pwd) return "—"
    const looksHashed =
      /^\$2[aby]\$/.test(pwd) || /^\$argon2(id|i|d)\$/.test(pwd) || /^\$scrypt\$/.test(pwd) ||
      /^[a-f0-9]{64,}$/.test(pwd) || (/[./$]/.test(pwd) && pwd.length > 25) || pwd.length > 50
    return looksHashed ? "******" : pwd
  }

  const bloqueoAdmin = (u) => getNombreCompleto(u).toLowerCase() === "alejandra vargas"

  // ===== Búsqueda =====
  const usuariosFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase()
    if (!q) return usuarios
    return usuarios.filter((u) => {
      const id = String(getIdVisual(u) ?? "").toLowerCase()
      const nombre = getNombreCompleto(u).toLowerCase()
      const email = String(getCorreo(u) ?? "").toLowerCase()
      const doc = String(getDocumento(u) ?? "").toLowerCase()
      const rol = String(getRol(u) ?? "").toLowerCase()
      return id.includes(q) || nombre.includes(q) || email.includes(q) || doc.includes(q) || rol.includes(q)
    })
  }, [usuarios, busqueda])

  // ===== Eliminar (ahora por personaId) =====
  const handleEliminar = async (u) => {
    if (bloqueoAdmin(u)) {
      console.warn("⚠️ Esta cuenta no se puede eliminar.")
      return
    }
    const personaId = getIdParaEliminar(u)
    if (!personaId) {
      console.error("No se pudo identificar el ID de persona para eliminar.")
      return
    }
    // eslint-disable-next-line no-restricted-globals
    const confirmar = confirm(`¿Eliminar la cuenta de "${getNombreCompleto(u)}"?`)
    if (!confirmar) return

    try {
      const res = await fetch(`${DELETE_URL_BASE}/${personaId}`, {
        method: "DELETE",
        mode: "cors",
        headers: { Accept: "application/json" },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      await loadUsuarios()
    } catch (e) {
      console.error("Error al eliminar:", e)
    }
  }

  // 7 columnas: ID | NOMBRE | CORREO | DOCUMENTO | ROL | CONTRASEÑA | ACCIONES
  const grid7 = {
    display: "grid",
    gridTemplateColumns: "90px 1.6fr 1.6fr 1fr 1fr 1fr 130px",
    alignItems: "center",
    gap: "8px",
  }

  return (
    <div className="crear-container">
      <div
        className="crear-header"
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
      >
        <div>
          <h1 className="crear-title" style={{ marginBottom: 4 }}>Cuentas de Usuario</h1>
          <p className="crear-subtitle" style={{ marginTop: 0 }}>Gestión de usuarios existentes</p>
        </div>
        <Link to="/usuarios/nuevo" className="btn-guardar" style={{ textDecoration: "none" }}>
          Nuevo Usuario
        </Link>
      </div>

      <aside className="panel-lista" style={{ width: "100%" }}>
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
          <div className="trow thead" style={grid7}>
            <div>ID</div>
            <div>NOMBRE</div>
            <div>CORREO</div>
            <div>DOCUMENTO</div>
            <div>ROL</div>
            <div>CONTRASEÑA</div>
            <div></div>
          </div>

          {loadingLista && (
            <div className="trow" style={grid7}>
              <div className="c100">Cargando usuarios…</div>
            </div>
          )}

          {!loadingLista && usuariosFiltrados.length === 0 && (
            <div className="trow" style={grid7}>
              <div className="c100">No hay usuarios para mostrar.</div>
            </div>
          )}

          {!loadingLista &&
            usuariosFiltrados.map((u) => {
              const id = getIdVisual(u)
              return (
                <div
                  key={id ?? getNombreCompleto(u) + getDocumento(u)}
                  className="trow"
                  style={grid7}
                >
                  <div>{id ?? "—"}</div>
                  <div className="strong">{getNombreCompleto(u)}</div>
                  <div>{getCorreo(u)}</div>
                  <div>{getDocumento(u)}</div>
                  <div>{getRol(u)}</div>
                  <div>{getPasswordDisplay(u)}</div>
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
