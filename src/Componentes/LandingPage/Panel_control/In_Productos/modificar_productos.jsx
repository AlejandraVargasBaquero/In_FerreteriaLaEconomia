import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./modificar_productos.css";
import "./In_Productos";

const BASE = (import.meta?.env?.VITE_API_URL || process.env.REACT_APP_API_URL || "http://localhost:8080").replace(/\/+$/, "");

export default function ModificarProductos() {

  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [busquedaCategoria, setBusquedaCategoria] = useState("Todos");

  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  // ==============================
  // Cargar productos
  // ==============================
  useEffect(() => { cargar(); }, []);

  async function cargar() {
    setErr(""); setMsg("");

    try {
      const r = await fetch(`${BASE}/productos/listar`);
      if (!r.ok) throw new Error("Error obteniendo productos.");

      const data = await r.json();
      if (!Array.isArray(data)) throw new Error("Formato inesperado en el backend.");

      setProductos(data);
      setMsg(`Cargados ${data.length} producto(s).`);

    } catch (e) {
      setErr(e.message || "Error cargando productos.");
      setProductos([]);
    }
  }

  // ==============================
  // Filtros
  // ==============================
  const categoriasUnicas = useMemo(
    () => ["Todos", ...new Set(productos.map(p => p.proCategoria ?? "Sin categoría"))],
    [productos]
  );

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const nombre = (p.nombreProducto || "").toLowerCase();
      const cat = p.proCategoria ?? "Sin categoría";
      const nm = nombre.includes(busquedaNombre.toLowerCase());
      const cm = busquedaCategoria === "Todos" || busquedaCategoria === cat;
      return nm && cm;
    });
  }, [productos, busquedaNombre, busquedaCategoria]);


  // ==============================
  // Abrir modal editar
  // ==============================
  function abrirEditar(p) {
    setEditData({
      idProducto: p.idProducto,
      nombreProducto: p.nombreProducto ?? "",
      proCategoria: p.proCategoria ?? "",
      proUnidad: p.proUnidad ?? 0,
      proCantidad: p.proCantidad ?? 0,
      proPrecioEntrada: p.proPrecioEntrada ?? 0,
      proPrecioSalida: p.proPrecioSalida ?? 0,
      proDescuento: p.proDescuento ?? 0,
    });
    setShowEdit(true);
  }

  function cerrarEditar() {
    setShowEdit(false);
    setEditData(null);
  }


  // ==============================
  // Guardar Cambios (ACTUALIZAR)
  // ==============================
  async function guardarCambios() {
    if (!editData?.idProducto) return;

    setErr(""); setMsg("");

    const body = {
      ...editData,
      proCantidad: Number(editData.proCantidad),
      proPrecioEntrada: Number(editData.proPrecioEntrada),
      proPrecioSalida: Number(editData.proPrecioSalida),
      proDescuento: Number(editData.proDescuento),
    };

    try {

      const r = await fetch(`${BASE}/productos/${editData.idProducto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!r.ok) throw new Error("No se pudo actualizar el producto.");

      setMsg("Producto actualizado correctamente.");
      cerrarEditar();
      await cargar();

    } catch (e) {
      setErr(e.message || "Error al actualizar.");
    }
  }

  // ==============================
  // Eliminar producto
  // ==============================
  async function eliminarProducto(p) {
    if (!p?.idProducto) return;

    if (!window.confirm(`¿Eliminar el producto #${p.idProducto} (${p.nombreProducto})?`)) return;

    try {

      const r = await fetch(`${BASE}/productos/${p.idProducto}`, {
        method: "DELETE"
      });

      if (!r.ok) throw new Error("Error al eliminar.");

      setMsg("Producto eliminado.");
      await cargar();

    } catch (e) {
      setErr(e.message || "No se pudo eliminar.");
    }
  }

  // ==============================
  // UI
  // ==============================
  return (
    <div className="modificar-wrap">

      <div className="header-section sticky">
        <h1 className="page-title">Modificar productos</h1>
        <div className="acciones-top">
          <button className="btn-modificar" onClick={() => navigate('/lista_de_productos')}>
            ← Volver al inventario
          </button>
        </div>
      </div>

      {/* FILTROS */}
      <div className="filtros-m">
        <div className="filtro">
          <label>Buscar Nombre:</label>
          <input
            type="text"
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            placeholder="Producto"
          />
        </div>

        <div className="filtro">
          <label>Categoría:</label>
          <select value={busquedaCategoria} onChange={(e) => setBusquedaCategoria(e.target.value)}>
            {categoriasUnicas.map((c, i) => <option key={i} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {err && <div className="alert error">{err}</div>}
      {msg && <div className="alert ok">{msg}</div>}

      {/* TABLA */}
      <table className="tabla-productos">
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>CATEGORIA</th>
            <th>PRECIO ENTRADA</th>
            <th>PRECIO SALIDA</th>
            <th>ACCIONES</th>
          </tr>
        </thead>

        <tbody>
          {productosFiltrados.map(p => (
            <tr key={p.idProducto}>
              <td>{p.idProducto}</td>
              <td>{p.nombreProducto}</td>
              <td>{p.proCategoria}</td>
              <td>${p.proPrecioEntrada}</td>
              <td>${p.proPrecioSalida}</td>

              <td>
                <button className="btn-accion editar" onClick={() => abrirEditar(p)}>Editar</button>
                <button className="btn-accion eliminar" onClick={() => eliminarProducto(p)}>Eliminar</button>
              </td>
            </tr>
          ))}

          {!productosFiltrados.length && (
            <tr><td colSpan={6}>Sin resultados.</td></tr>
          )}
        </tbody>
      </table>

      {/* MODAL EDITAR */}
      {showEdit && editData && (
        <div className="modal-backdrop" onClick={cerrarEditar}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>

            <h3>Editar #{editData.idProducto}</h3>

            <div className="modal-body grid2">

              <div className="campo">
                <label>Nombre</label>
                <input value={editData.nombreProducto}
                  onChange={(e) => setEditData({ ...editData, nombreProducto: e.target.value })} />
              </div>

              <div className="campo">
                <label>Categoría</label>
                <input value={editData.proCategoria}
                  onChange={(e) => setEditData({ ...editData, proCategoria: e.target.value })} />
              </div>

              <div className="campo">
                <label>Unidad</label>
                <input value={editData.proUnidad}
                  onChange={(e) => setEditData({ ...editData, proUnidad: e.target.value })} />
              </div>

              <div className="campo">
                <label>Cantidad</label>
                <input type="number" value={editData.proCantidad}
                  onChange={(e) => setEditData({ ...editData, proCantidad: e.target.value })} />
              </div>

              <div className="campo">
                <label>Precio Entrada</label>
                <input type="number" value={editData.proPrecioEntrada}
                  onChange={(e) => setEditData({ ...editData, proPrecioEntrada: e.target.value })} />
              </div>

              <div className="campo">
                <label>Precio Salida</label>
                <input type="number" value={editData.proPrecioSalida}
                  onChange={(e) => setEditData({ ...editData, proPrecioSalida: e.target.value })} />
              </div>

              <div className="campo">
                <label>Descuento (%)</label>
                <input type="number" min={0} max={100} value={editData.proDescuento}
                  onChange={(e) => setEditData({ ...editData, proDescuento: e.target.value })} />
              </div>

            </div>

            <div className="modal-actions">
              <button className="btn-cancelar" onClick={cerrarEditar}>Cancelar</button>
              <button className="btn-guardar" onClick={guardarCambios}>Guardar</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
