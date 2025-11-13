"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import "./Remision.css"

const BASE_URL =
  (process.env.REACT_APP_API_URL ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    "http://localhost:8080").replace(/\/+$/, "")

const VENTA_URL = `${BASE_URL}/api/venta`
const LISTA_USUARIOS_URL = `${BASE_URL}/prueba/listar/persona`
const BUSCAR_PRODUCTOS_URL = `${BASE_URL}/productos/buscar`

function decodeJwt(token) {
  try {
    const base = token.split(".")[1]
    const json = atob(base.replace(/-/g, "+").replace(/_/g, "/"))
    return JSON.parse(json)
  } catch {
    return null
  }
}

async function detectVentasListUrl() {
  const candidates = [
    `${VENTA_URL}`,
    `${VENTA_URL}/all`,
    `${VENTA_URL}/listar`,
  ]
  for (const url of candidates) {
    try {
      const r = await fetch(url, { method: "GET" })
      if (r.ok) {
        const txt = await r.text()
        if (txt.trim().startsWith("[")) return url
      }
    } catch {}
  }
  return `${VENTA_URL}`
}

function normalizeVenta(v) {
  const id =
    v.id ?? v.idVenta ?? v.ventaId ?? v.remisionId ?? v.codigo ?? v.codigoVenta ?? "—"

  const fechaRaw =
    v.fecha ?? v.fechaVenta ?? v.fechaCreacion ?? v.createdAt ?? v.fecCreacion
  const fecha = fechaRaw ? new Date(fechaRaw).toLocaleString() : "—"

  const cliente =
    v.clienteNombre ??
    v.cliente ??
    v?.cliente?.nombre ??
    v?.cliente?.razonSocial ??
    "—"

  const usuario =
    v.usuarioNombre ??
    v.usuario ??
    v?.usuario?.nombre ??
    v?.usuario?.username ??
    (v.userId ? `ID ${v.userId}` : "—")

  let total = v.total ?? 0
  if (total == null) {
    const items = v.items ?? v.detalles ?? []
    total = Array.isArray(items)
      ? items.reduce((acc, it) => {
          const pu =
            it.precioUnitario ?? it.valorUnitario ?? it.precio ?? it.valor ?? 0
          const cant = it.cantidad ?? 0
          return acc + Number(pu) * Number(cant)
        }, 0)
      : 0
  }

  return { id, fecha, cliente, usuario, total: Number(total || 0) }
}

export default function Remision() {
  const [usuarios, setUsuarios] = useState([])
  const [usuarioId, setUsuarioId] = useState("")

  const [clienteNombre, setClienteNombre] = useState("")
  const [clienteDocumento, setClienteDocumento] = useState("")
  const [clienteEmail, setClienteEmail] = useState("")

  const [query, setQuery] = useState("")
  const [sugerencias, setSugerencias] = useState([])
  const [openSug, setOpenSug] = useState(false)
  const [loadingSug, setLoadingSug] = useState(false)
  const abortRef = useRef(null)

  const [items, setItems] = useState([])
  const total = useMemo(
    () =>
      items.reduce(
        (acc, it) => acc + Number(it.cantidad || 0) * Number(it.precioUnitario || 0),
        0
      ),
    [items]
  )

  const [saving, setSaving] = useState(false)
  const [okMsg, setOkMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const [ventasUrlList, setVentasUrlList] = useState(`${VENTA_URL}`)
  const [ventas, setVentas] = useState([])
  const [loadingVentas, setLoadingVentas] = useState(false)
  const [ventasErr, setVentasErr] = useState("")

  const [filtroCliente, setFiltroCliente] = useState("")
  const ventasFiltradas = useMemo(() => {
    if (!filtroCliente.trim()) return ventas
    const texto = filtroCliente.toLowerCase()
    return ventas.filter(v => (v.cliente || "").toLowerCase().includes(texto))
  }, [filtroCliente, ventas])

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(LISTA_USUARIOS_URL)
        if (!res.ok) throw new Error()
        const data = await res.json()
        const normalizados = (Array.isArray(data) ? data : [])
          .map((p) => {
            const id = p.id ?? p.perId ?? p.idPersona ?? p.personaId ?? p.userId ?? p.idUsuario
            const nombre =
              [p.perNombre, p.perApellido].filter(Boolean).join(" ") ||
              p.username || p.nombre || p.email || (id ? `Usuario ${id}` : "")
            return id ? { id, nombre } : null
          })
          .filter(Boolean)
        setUsuarios(normalizados)
        if (!usuarioId && normalizados.length > 0) {
          setUsuarioId(String(normalizados[0].id))
        }
      } catch {
        setUsuarios([])
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    ;(async () => {
      setLoadingVentas(true)
      setVentasErr("")
      try {
        const url = await detectVentasListUrl()
        setVentasUrlList(url)
        const r = await fetch(url)
        if (!r.ok) throw new Error("No se pudo listar las remisiones")
        const data = await r.json()
        const normal = (Array.isArray(data) ? data : []).map(normalizeVenta)
        normal.sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
        setVentas(normal)
      } catch (e) {
        setVentasErr(e.message || "Error listando remisiones")
      } finally {
        setLoadingVentas(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSugerencias([])
      setOpenSug(false)
      return
    }
    setLoadingSug(true)
    if (abortRef.current) abortRef.current.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    const t = setTimeout(async () => {
      try {
        const url = `${BUSCAR_PRODUCTOS_URL}?q=${encodeURIComponent(query.trim())}`
        const res = await fetch(url, { signal: ctrl.signal })
        if (!res.ok) throw new Error("No se pudo buscar productos")
        const data = await res.json()
        setSugerencias(Array.isArray(data) ? data : [])
        setOpenSug(true)
      } catch {
        setSugerencias([])
        setOpenSug(false)
      } finally {
        setLoadingSug(false)
      }
    }, 250)

    return () => clearTimeout(t)
  }, [query])

  function addItemFromSuggestion(s) {
    const existe = items.find((it) => it.idProducto === s.id)
    if (existe) {
      setItems((prev) =>
        prev.map((it) =>
          it.idProducto === s.id ? { ...it, cantidad: Number(it.cantidad) + 1 } : it
        )
      )
    } else {
      setItems((prev) => [
        ...prev,
        {
          idProducto: s.id,
          nombre: s.nombre,
          precioUnitario: Number(s.valorUnitario ?? 0),
          cantidad: 1,
        },
      ])
    }
    setQuery("")
    setOpenSug(false)
  }

  function updateCantidad(idx, valor) {
    let c = parseInt(valor, 10)
    if (!Number.isFinite(c) || c < 1) c = 1
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, cantidad: c } : it)))
  }

  function removeItem(idx) {
    setItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const isValid =
    String(usuarioId).trim() &&
    clienteNombre.trim() &&
    clienteDocumento.trim() &&
    items.length > 0 &&
    items.every((it) => Number(it.cantidad) >= 1)

  async function guardarRemision() {
    try {
      setSaving(true)
      setOkMsg("")
      setErrorMsg("")

      const payload = {
        userId: Number(usuarioId),
        clienteNombre: clienteNombre.trim(),
        clienteDocumento: clienteDocumento.trim(),
        clienteEmail: clienteEmail?.trim() || null,
        items: items.map((it) => ({
          idProducto: it.idProducto,
          cantidad: Number(it.cantidad),
          precioUnitario: Number(it.precioUnitario),
        })),
      }

      const res = await fetch(VENTA_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => "")
        throw new Error(txt || "Error al guardar la remisión")
      }

      setOkMsg("Remisión guardada correctamente.")
      setItems([])
      setQuery("")

      const r = await fetch(ventasUrlList)
      if (r.ok) {
        const data = await r.json()
        const normal = (Array.isArray(data) ? data : []).map(normalizeVenta)
        normal.sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
        setVentas(normal)
      }
    } catch (err) {
      setErrorMsg(err.message || "Error al guardar")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="remision-pageeeee">
      <header className="remision-headerrrr">
        <h2>Crear Remisión</h2>
      </header>

      {/* Cliente */}
      <section className="remision-clienterrrr">
        <div className="rowwwww">
          <label>Nombre del cliente</label>
          <input
            type="text"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
          />
        </div>
        <div className="rowwwww">
          <label>Documento</label>
          <input
            type="text"
            value={clienteDocumento}
            onChange={(e) => setClienteDocumento(e.target.value)}
          />
        </div>
        <div className="rowwwww">
          <label>Correo</label>
          <input
            type="email"
            value={clienteEmail}
            onChange={(e) => setClienteEmail(e.target.value)}
          />
        </div>
      </section>

      {/* Usuario */}
      <section className="remision-usuariorrrr">
        <div className="rowwwww">
          <label>Usuario que realiza la remisión</label>
          <select value={usuarioId} onChange={(e) => setUsuarioId(e.target.value)}>
            <option value="">Seleccione…</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Buscar producto */}
      <section className="remision-buscadorrrrr">
        <label>Buscar producto</label>

        <div className="sug-wrappppp">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Escribe al menos 2 letras…"
            onFocus={() => query.trim().length >= 2 && setOpenSug(true)}
            onBlur={() => setTimeout(() => setOpenSug(false), 120)}
          />

          {openSug && sugerencias.length > 0 && (
            <ul className="sug-listtttt">
              {sugerencias.map((s) => (
                <li
                  key={s.id}
                  onMouseDown={() => addItemFromSuggestion(s)}
                  title={s.nombre}
                >
                  <span>{s.nombre}</span>
                  <span>${s.valorUnitario?.toLocaleString?.() ?? 0}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Tabla de items */}
      <section className="remision-tablaaaaa">
        <table className="tablaaaaaa">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Precio unitario</th>
              <th>Cantidad</th>
              <th>Subtotal</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan="6">No hay productos.</td></tr>
            ) : (
              items.map((it, i) => (
                <tr key={i}>
                  <td>{it.idProducto}</td>
                  <td>{it.nombre}</td>
                  <td>${it.precioUnitario.toLocaleString()}</td>
                  <td>
                    <input
                      type="number"
                      value={it.cantidad}
                      onChange={(e) => updateCantidad(i, e.target.value)}
                    />
                  </td>
                  <td>${(it.precioUnitario * it.cantidad).toLocaleString()}</td>
                  <td><button onClick={() => removeItem(i)}>✕</button></td>
                </tr>
              ))
            )}
          </tbody>
          <tfoot>
            <tr><td colSpan="4">Total</td><td colSpan="2">${total.toLocaleString()}</td></tr>
          </tfoot>
        </table>
      </section>

      {/* Acciones */}
      <section className="remision-actionsrrrr">
        <button disabled={!isValid || saving} onClick={guardarRemision}>
          {saving ? "Guardando…" : "Guardar remisión"}
        </button>
        {okMsg && <div className="alertrrrr okkkk">{okMsg}</div>}
        {errorMsg && <div className="alertrrrr errorrrr">{errorMsg}</div>}
      </section>

      {/* Historial */}
      <section className="remision-historialllll" style={{ marginTop: 30 }}>
        <h3>Historial de remisiones</h3>

        <div className="buscador-historialllll">
          <input
            type="text"
            placeholder="Buscar por nombre del cliente..."
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
          />
        </div>

        {loadingVentas ? (
          <p>Cargando…</p>
        ) : ventasErr ? (
          <p className="alertrrrr errorrrr">{ventasErr}</p>
        ) : (
          <table className="tablaaaaaa">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Usuario</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {ventasFiltradas.length === 0 ? (
                <tr><td colSpan="5">No hay remisiones.</td></tr>
              ) : (
                ventasFiltradas.map((v) => (
                  <tr key={v.id}>
                    <td>{v.id}</td>
                    <td>{v.fecha}</td>
                    <td>{v.cliente}</td>
                    <td>{v.usuario}</td>
                    <td>${v.total.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
