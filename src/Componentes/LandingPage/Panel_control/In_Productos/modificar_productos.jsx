import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ IMPORTA useNavigate
import "./modificar_productos.css";
import "./In_Productos";

const BASE = (import.meta?.env?.VITE_API_URL || process.env.REACT_APP_API_URL || "http://localhost:8080").replace(/\/+$/,"");

const LIST_ENDPOINTS = ["/productos/obtener", "/productos/listar"];
const UPDATE_ENDPOINTS = (id) => [`/productos/${id}`, `/productos/actualizar/${id}`, `/productos/editar/${id}`];
const DELETE_ENDPOINTS = (id) => [`/productos/${id}`, `/productos/eliminar/${id}`];

function toNumberOrNull(v){ const n=Number(v); return Number.isFinite(n)?n:null; }

export default function ModificarProductos(){
  const navigate = useNavigate(); // ✅ CREA navigate
  const [productos, setProductos] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const [busquedaCategoria, setBusquedaCategoria] = useState("Todos");

  const [showEdit, setShowEdit] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(()=>{ cargar(); },[]);
  async function cargar(){
    setErr(""); setMsg("");
    try{
      let data=[];
      for(const p of LIST_ENDPOINTS){
        const r = await fetch(`${BASE}${p}`);
        if(!r.ok) continue;
        const json = await r.json();
        if(Array.isArray(json)){ data=json; break; }
        if(Array.isArray(json?.productos)){ data=json.productos; break; }
      }
      if(!Array.isArray(data)) throw new Error("No se pudo obtener el inventario.");
      setProductos(data);
      setMsg(`Cargados ${data.length} producto(s).`);
    }catch(e){
      setProductos([]); setErr(e.message || "Error cargando productos.");
    }
  }

  const categoriasUnicas = useMemo(
    ()=>["Todos", ...new Set(productos.map(p=>p.proCategoria ?? "Sin categoría"))],
    [productos]
  );

  const productosFiltrados = useMemo(()=>{
    return productos.filter(p=>{
      const nombre=(p.nombreProducto||"").toLowerCase();
      const cat=p.proCategoria ?? "Sin categoría";
      const nm=nombre.includes((busquedaNombre||"").toLowerCase());
      const cm=busquedaCategoria==="Todos" || cat===busquedaCategoria;
      return nm && cm;
    });
  },[productos,busquedaNombre,busquedaCategoria]);

  function abrirEditar(p){
    setEditData({
      idProducto: p.idProducto,
      nombreProducto: p.nombreProducto ?? "",
      proCategoria: p.proCategoria ?? "",
      proUnidad: p.proUnidad ?? "",
      proCantidad: p.proCantidad ?? 0,
      proPrecioEntrada: p.proPrecioEntrada ?? 0,
      proPrecioSalida: p.proPrecioSalida ?? 0,
      proDescuento: p.proDescuento ?? 0,
    });
    setShowEdit(true);
  }
  function cerrarEditar(){ setShowEdit(false); setEditData(null); }

  async function guardarCambios(){
    if(!editData?.idProducto) return;
    setErr(""); setMsg("");
    const body={...editData,
      proCantidad: toNumberOrNull(editData.proCantidad),
      proPrecioEntrada: toNumberOrNull(editData.proPrecioEntrada),
      proPrecioSalida: toNumberOrNull(editData.proPrecioSalida),
      proDescuento: toNumberOrNull(editData.proDescuento),
    };
    let ok=false;
    for(const p of UPDATE_ENDPOINTS(editData.idProducto)){
      try{
        const r=await fetch(`${BASE}${p}`,{method:"PUT", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});
        if(r.ok){ ok=true; break; }
      }catch{}
    }
    if(!ok){ setErr("No se pudo actualizar el producto. Verifica el endpoint de actualización en tu backend."); return; }
    setMsg("Producto actualizado correctamente."); cerrarEditar(); await cargar();
  }

  async function eliminarProducto(p){
    if(!p?.idProducto) return;
    if(!window.confirm(`¿Eliminar el producto #${p.idProducto} (${p.nombreProducto})?`)) return;
    setErr(""); setMsg("");
    let ok=false;
    for(const d of DELETE_ENDPOINTS(p.idProducto)){
      try{
        const r=await fetch(`${BASE}${d}`,{method:"DELETE"});
        if(r.ok){ ok=true; break; }
      }catch{}
    }
    if(!ok){ setErr("No se pudo eliminar. Verifica el endpoint de eliminación."); return; }
    setMsg("Producto eliminado."); await cargar();
  }

  return (
    <div className="modificar-wrap">

      {/* Header fijo arriba con botón de retorno */}
      <div className="header-section sticky">
        <h1 className="page-title">Modificar productos</h1>
        <div className="acciones-top">
          <button className="btn-modificar" onClick={() => navigate('/lista_de_productos')}>
            {/* Si prefieres: "Dejar de modificar" */}
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
            onChange={(e)=>setBusquedaNombre(e.target.value)}
            placeholder="Producto"
          />
        </div>
        <div className="filtro">
          <label>Buscar Categoría:</label>
          <select value={busquedaCategoria} onChange={(e)=>setBusquedaCategoria(e.target.value)}>
            {categoriasUnicas.map((c,i)=><option key={i} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {err && <div className="alert error">{err}</div>}
      {msg && <div className="alert ok">{msg}</div>}

      <table className="tabla-productos">
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>CATEGORÍA</th>
            <th>PRECIO ENTRADA</th>
            <th>PRECIO SALIDA</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          {productosFiltrados.map((p)=>(
            <tr key={p.idProducto}>
              <td>{p.idProducto}</td>
              <td>{p.nombreProducto}</td>
              <td>{p.proCategoria}</td>
              <td>${p.proPrecioEntrada}</td>
              <td>${p.proPrecioSalida}</td>
              <td>
                <button className="btn-accion editar" onClick={()=>abrirEditar(p)}>Editar</button>
                <button className="btn-accion eliminar" onClick={()=>eliminarProducto(p)}>Eliminar</button>
              </td>
            </tr>
          ))}
          {!productosFiltrados.length && (
            <tr>
              <td colSpan={6} style={{textAlign:"center",padding:"12px"}}>Sin resultados.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showEdit && editData && (
        <div className="modal-backdrop" onClick={cerrarEditar}>
          <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header"><h3>Editar #{editData.idProducto}</h3></div>
            <div className="modal-body grid2">
              <div className="campo">
                <label>Nombre</label>
                <input value={editData.nombreProducto} onChange={(e)=>setEditData({...editData, nombreProducto:e.target.value})}/>
              </div>
              <div className="campo">
                <label>Categoría</label>
                <input value={editData.proCategoria} onChange={(e)=>setEditData({...editData, proCategoria:e.target.value})}/>
              </div>
              <div className="campo">
                <label>Unidad</label>
                <input value={editData.proUnidad} onChange={(e)=>setEditData({...editData, proUnidad:e.target.value})}/>
              </div>
              <div className="campo">
                <label>Cantidad</label>
                <input type="number" min={0} value={editData.proCantidad} onChange={(e)=>setEditData({...editData, proCantidad:e.target.value})}/>
              </div>
              <div className="campo">
                <label>Precio Entrada</label>
                <input type="number" min={0} value={editData.proPrecioEntrada} onChange={(e)=>setEditData({...editData, proPrecioEntrada:e.target.value})}/>
              </div>
              <div className="campo">
                <label>Precio Salida</label>
                <input type="number" min={0} value={editData.proPrecioSalida} onChange={(e)=>setEditData({...editData, proPrecioSalida:e.target.value})}/>
              </div>
              <div className="campo">
                <label>Descuento (%)</label>
                <input type="number" min={0} max={100} value={editData.proDescuento} onChange={(e)=>setEditData({...editData, proDescuento:e.target.value})}/>
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
