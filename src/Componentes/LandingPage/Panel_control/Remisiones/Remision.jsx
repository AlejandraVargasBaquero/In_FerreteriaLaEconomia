"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import "./Remision.css"

const BASE_URL =
  (process.env.REACT_APP_API_URL ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    "http://localhost:8080").replace(/\/+$/, "")

const VENTA_ENDPOINTS = ["/api/venta"]
const USUARIOS_ENDPOINTS = ["/prueba/listar/persona"]

async function detectEndpoint(base, paths) {
  for (const p of paths) {
    const url = `${base}${p}`
    try {
      await fetch(url, { method: "GET", mode: "no-cors" })
      return url
    } catch {}
  }
  return `${base}${paths[0]}`
}

function currency(n) {
  const num = Number(n ?? 0)
  if (Number.isNaN(num)) return "-"
  return num.toLocaleString("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
}

export default function Remision() {
  const [ventaUrl, setVentaUrl] = useState(null)
  const [usuariosUrl, setUsuariosUrl] = useState(null)

  const [usuarios, setUsuarios] = useState([])
  const [userId, setUserId] = useState("")

  const [clienteNombre, setClienteNombre] = useState("")
  const [clienteCedula, setClienteCedula] = useState("")

  const [query, setQuery] = useState("")
  const [sugerencias, setSugerencias] = useState([])
  const [openSug, setOpenSug] = useState(false)
  const [loadingSug, setLoadingSug] = useState(false)
  const abortRef = useRef(null)
  const boxRef = useRef(null)

  const [items, setItems] = useState([]) // {idProducto, nombre, precioUnitario, cantidad}

  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [okMsg, setOkMsg] = useState("")

  // init
  useEffect(() => {
    (async () => {
      const venta = await detectEndpoint(BASE_URL, VENTA_ENDPOINTS)
      const users = await detectEndpoint(BASE_URL, USUARIOS_ENDPOINTS)
      setVentaUrl(venta)
      setUsuariosUrl(users)

      try {
        const r = await fetch(users.replace(/\/+$/, ""))
        if (r.ok) {
          const data = await r.json()
          setUsuarios(Array.isArray(data) ? data : [])
          if (Array.isArray(data) && data.length) {
            setUserId(data[0]?.id ?? data[0]?.idPersona ?? "")
          }
        }
      } catch {}
    })()
  }, [])

  // cerrar sugerencias al hacer clic afuera
  useEffect(() => {
    function onDocClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpenSug(false)
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  // autocomplete con debounce
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSugerencias([])
      return
    }
    setLoadingSug(true)
    setErrorMsg("")
    setOkMsg("")
    if (abortRef.current) abortRef.current.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    const t = setTimeout(async () => {
      try {
        const url = `${BASE_URL}/productos/buscar?nombre=${encodeURIComponent(query.trim())}`
        const r = await fetch(url, { signal: ctrl.signal })
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        const data = await r.json()
        setSugerencias(Array.isArray(data) ? data : [])
        setOpenSug(true)
      } catch (err) {
        if (err.name !== "AbortError") setSugerencias([])
      } finally {
        setLoadingSug(false)
      }
    }, 280)

    return () => clearTimeout(t)
  }, [query])

  function addItemFromSuggestion(s) {
    const exists = items.find((it) => it.idProducto === s.id)
    if (exists) {
      setOpenSug(false)
      setQuery("")
      return
    }
    const nuevo = {
      idProducto: s.id,
      nombre: s.nombre,
      precioUnitario: Number(s.precioSalida ?? 0),
      cantidad: 1,
    }
    setItems((prev) => [...prev, nuevo])
    setOpenSug(false)
    setQuery("")
  }

  function updateCantidad(index, cantidad) {
    let c = parseInt(cantidad, 10)
    if (!Number.isFinite(c) || c < 1) c = 1
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, cantidad: c } : it)))
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const total = useMemo(
    () => items.reduce((acc, it) => acc + Number(it.precioUnitario ?? 0) * Number(it.cantidad ?? 0), 0),
    [items]
  )

  // --------- Validación de guardado ---------
  const isValid =
    clienteNombre.trim().length > 0 &&
    clienteCedula.trim().length > 0 &&
    String(userId).trim().length > 0 &&
    items.length > 0 &&
    items.every((it) => Number(it.cantidad) >= 1)

  async function guardarRemision() {
    setSaving(true)
    setErrorMsg("")
    setOkMsg("")
    try {
      if (!isValid) {
        throw new Error(
          "Completa todos los campos obligatorios: Nombre, Cédula, Cliente del catálogo y al menos un producto con cantidad."
        )
      }
      if (!ventaUrl) throw new Error("No se detectó el endpoint de ventas.")

      const payload = {
        userId: Number(userId),
        items: items.map((it) => ({
          idProducto: it.idProducto,
          cantidad: it.cantidad,
          precioUnitario: Number(it.precioUnitario),
        })),
      }

      const r = await fetch(ventaUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!r.ok) {
        const txt = await r.text().catch(() => "")
        throw new Error(`Error al guardar (HTTP ${r.status}). ${txt || ""}`)
      }
      const data = await r.json().catch(() => ({}))
      setOkMsg(
        `Remisión guardada. ID: ${data?.id ?? "—"} • Cliente: ${clienteNombre || "—"} • Cédula: ${
          clienteCedula || "—"
        }`
      )
      setItems([])
    } catch (e) {
      setErrorMsg(e.message || "Error inesperado al guardar.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="contenedor-remision">
      <header className="header-remision">
        <h1 className="titulo-remision">Remisiones / Ventas</h1>
      </header>

      {/* Datos del cliente */}
      <section className="seccion-remision">
        <div className="grid-dos">
          <div className="fila">
            <label className="label">Nombre del cliente</label>
            <input
              className="input"
              type="text"
              placeholder="Nombres y apellidos"
              value={clienteNombre}
              onChange={(e) => setClienteNombre(e.target.value)}
            />
          </div>
          <div className="fila">
            <label className="label">Cédula</label>
            <input
              className="input"
              type="text"
              placeholder="Número de documento"
              value={clienteCedula}
              onChange={(e) => setClienteCedula(e.target.value.replace(/[^\d.-]/g, ""))}
            />
          </div>
        </div>

        <div className="fila" style={{ marginTop: 10 }}>
          <label className="label">Usuario / Cliente (catálogo)</label>
          <select className="input" value={userId} onChange={(e) => setUserId(e.target.value)}>
            <option value="">— Selecciona —</option>
            {usuarios.map((u) => (
              <option key={u.id ?? u.idPersona} value={u.id ?? u.idPersona}>
                {u.nombre ?? [u.perNombre, u.perApellido].filter(Boolean).join(" ")}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Autocomplete de productos */}
      <section className="seccion-remision" ref={boxRef}>
        <div className="fila">
          <label className="label">Buscar producto por nombre</label>
          <input
            className="input"
            type="text"
            placeholder="Escribe al menos 2 letras…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => sugerencias.length && setOpenSug(true)}
          />
        </div>

        {openSug && (
          <div className="sugerencias">
            {loadingSug && <div className="sug-item">Buscando…</div>}
            {!loadingSug && !sugerencias.length && query.trim().length >= 2 && (
              <div className="sug-item">Sin coincidencias</div>
            )}
            {!loadingSug &&
              sugerencias.map((s) => (
                <button
                  type="button"
                  key={s.id}
                  className="sug-item"
                  onClick={() => addItemFromSuggestion(s)}
                >
                  <div className="sug-nombre">{s.nombre}</div>
                  <div className="sug-precio">{currency(s.precioSalida)}</div>
                </button>
              ))}
          </div>
        )}
      </section>

      {/* Items seleccionados */}
      <section className="seccion-remision">
        <div className="tabla">
          <div className="row header">
            <div>ID</div>
            <div>Producto</div>
            <div>Precio</div>
            <div>Cantidad</div>
            <div>Subtotal</div>
            <div></div>
          </div>

          {items.map((it, idx) => (
            <div className="row" key={it.idProducto}>
              <div>{it.idProducto}</div>
              <div>{it.nombre}</div>
              <div>{currency(it.precioUnitario)}</div>
              <div>
                <input
                  className="input cantidad"
                  type="number"
                  min={1}
                  step="1"
                  inputMode="numeric"
                  value={it.cantidad}
                  onChange={(e) => updateCantidad(idx, e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  onFocus={(e) => e.target.select()}
                />
              </div>
              <div>{currency(Number(it.precioUnitario) * Number(it.cantidad))}</div>
              <div>
                <button className="btn btn-danger" type="button" onClick={() => removeItem(idx)}>
                  Quitar
                </button>
              </div>
            </div>
          ))}

          {!items.length && (
            <div className="row">
              <div className="col-100">No has agregado productos todavía.</div>
            </div>
          )}
        </div>

        <div className="totales">
          <div className="total-linea">
            <span>Total:</span>
            <strong>{currency(total)}</strong>
          </div>
        </div>

        <div className="acciones">
          <button
            className="btn btn-primary"
            disabled={saving || !isValid}
            title={!isValid ? "Completa todos los campos para guardar" : ""}
            onClick={guardarRemision}
          >
            {saving ? "Guardando…" : "Guardar remisión"}
          </button>
        </div>

        {errorMsg && <div className="alert error">{errorMsg}</div>}
        {okMsg && <div className="alert ok">{okMsg}</div>}
      </section>
    </div>
  )
}
