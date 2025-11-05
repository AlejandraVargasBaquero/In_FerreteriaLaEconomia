"use client"

import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa"
import "./In_Productos.css"

const BASE_URL =
  (process.env.REACT_APP_API_URL ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    "http://localhost:8080").replace(/\/+$/, "")

const LIST_ENDPOINTS = ["/productos/obtener", "/productos/listar"]

export default function In_Productos() {
  const [productos, setProductos] = useState([])
  const [busquedaNombre, setBusquedaNombre] = useState("")
  const [busquedaCategoria, setBusquedaCategoria] = useState("Todos")
  const navigate = useNavigate()

  useEffect(() => {
    ;(async () => {
      try {
        let data = []
        for (const path of LIST_ENDPOINTS) {
          const r = await fetch(`${BASE_URL}${path}`)
          if (!r.ok) continue
          const json = await r.json()
          if (Array.isArray(json)) { data = json; break }
          if (Array.isArray(json?.productos)) { data = json.productos; break }
        }
        setProductos(Array.isArray(data) ? data : [])
      } catch {
        setProductos([])
      }
    })()
  }, [])

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const nombreMatch = (p.nombreProducto ?? "").toLowerCase().includes((busquedaNombre ?? "").toLowerCase())
      const categoria = p.proCategoria ?? "Sin categoría"
      const categoriaMatch = busquedaCategoria === "Todos" || categoria === busquedaCategoria
      return nombreMatch && categoriaMatch
    })
  }, [productos, busquedaNombre, busquedaCategoria])

  const categoriasUnicas = useMemo(
    () => ["Todos", ...new Set(productos.map((p) => p.proCategoria ?? "Sin categoría"))],
    [productos]
  )

  return (
    <div className="contenedor-inventario">
      <div className="header-section sticky">
        <h1 className="page-title">Inventario de Productos</h1>

        <div className="acciones-top">
          <button className="btn-modificar" onClick={() => navigate("/registro_de_productos")}>
            <span style={{ fontWeight: 700 }}>+</span> Agregar
          </button>
          <button
            className="btn-modificar"
            onClick={() => navigate("/modificar_productos")}
            title="Ir a la gestión (editar/eliminar)"
          >
            ✎ Modificar
          </button>
        </div>
      </div>

      <div className="filtros-container">
        <div className="filtro-item">
          <label><FaSearch /> Buscar Producto:</label>
          <input
            type="text"
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            placeholder="Nombre del producto..."
          />
        </div>

        <div className="filtro-item">
          <label>Categoría:</label>
          <select value={busquedaCategoria} onChange={(e) => setBusquedaCategoria(e.target.value)}>
            {categoriasUnicas.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="tabla-container">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Producto</th>
              <th>Categoría</th>
              <th>Unidad</th>
              <th>Cantidad</th>
              <th>Precio Entrada</th>
              <th>Precio Salida</th>
              <th>Descuento (%)</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((p, index) => (
              <tr key={p.idProducto ?? index}>
                <td>{p.idProducto}</td>
                <td className="producto-nombre">{p.nombreProducto}</td>
                <td>{p.proCategoria}</td>
                <td>{p.proUnidad}</td>
                <td className="cantidad">{p.proCantidad}</td>
                <td>${p.proPrecioEntrada}</td>
                <td>${p.proPrecioSalida}</td>
                <td className="descuento">{p.proDescuento}%</td>
              </tr>
            ))}

            {!productosFiltrados.length && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "14px" }}>
                  No hay productos con ese filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
