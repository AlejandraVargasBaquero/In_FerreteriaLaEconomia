import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../In_Productos/In_Productos.css";     // header, botones, tabla
import "../In_Productos/modificar_productos.css";            // si ya tienes estilos de modal/acciones, reutiliza

const BASE = (import.meta?.env?.VITE_API_URL || process.env.REACT_APP_API_URL || "http://localhost:8080").replace(/\/+$/,"");

const LIST = "/Proveedor/obtener";
const SAVE = "/Proveedor"; // usaremos PUT/DELETE con /Proveedor/{id}

export default function ModificarProveedores(){
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [filtro, setFiltro] = useState("");

  const [showEdit, setShowEdit] = useState(false);
  const [edit, setEdit] = useState(null);

  useEffect(()=>{ cargar(); },[]);
  async function cargar(){
    setErr(""); setMsg("");
    try{
      const r = await fetch(`${BASE}${LIST}`);
      if(!r.ok) throw new Error("No se pudo obtener la lista de proveedores.");
      const j = await r.json();
      const arr = Array.isArray(j) ? j : (Array.isArray(j?.proveedores) ? j.proveedores : []);
      setData(arr);
      setMsg(`Cargados ${arr.length} proveedor(es).`);
    }catch(e){
      setData([]); setErr(e.message || "Error cargando proveedores.");
    }
  }

  const filtrados = useMemo(
    ()=> data.filter(p => (p.nomProveedor || "").toLowerCase().includes(filtro.toLowerCase())),
    [data, filtro]
  );

  function abrirEditar(p){
    setEdit({
      idProveedor: p.idProveedor,
      nomProveedor: p.nomProveedor ?? "",
      direccionProveedor: p.direccionProveedor ?? "",
      correo: p.correo ?? "",
      telefono: p.telefono ?? "",
      valorCompra: p.valorCompra ?? 0
    });
    setShowEdit(true);
  }
  function cerrar(){ setShowEdit(false); setEdit(null); }

  async function guardar(){
    if(!edit?.idProveedor) return;
    setErr(""); setMsg("");
    try{
      const r = await fetch(`${BASE}${SAVE}/${edit.idProveedor}`,{
        method:"PUT",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify(edit)
      });
      if(!r.ok) throw new Error("No se pudo actualizar el proveedor.");
      setMsg("Proveedor actualizado.");
      cerrar(); await cargar();
    }catch(e){
      setErr(e.message || "Error al actualizar.");
    }
  }

  async function eliminar(p){
    if(!p?.idProveedor) return;
    if(!window.confirm(`¿Eliminar el proveedor #${p.idProveedor} (${p.nomProveedor})?`)) return;
    setErr(""); setMsg("");
    try{
      const r = await fetch(`${BASE}${SAVE}/${p.idProveedor}`,{ method:"DELETE" });
      if(!r.ok) throw new Error("No se pudo eliminar el proveedor.");
      setMsg("Proveedor eliminado.");
      await cargar();
    }catch(e){
      setErr(e.message || "Error al eliminar.");
    }
  }

  return (
    <div className="modificar-wrap">
      <div className="header-section sticky">
        <h1 className="page-title">Modificar proveedores</h1>
        <div className="acciones-top">
          <button className="btn-modificar" onClick={() => navigate("/lista_de_proveedores")}>
            ← Volver al inventario
          </button>
        </div>
      </div>

      <div className="filtros-container">
        <div className="filtro-item" style={{ maxWidth: 420 }}>
          <label>Buscar Proveedor:</label>
          <input
            type="text"
            placeholder="Nombre del proveedor"
            value={filtro}
            onChange={(e)=>setFiltro(e.target.value)}
          />
        </div>
      </div>

      {err && <div className="alert error">{err}</div>}
      {msg && <div className="alert ok">{msg}</div>}

      <div className="tabla-container">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Dirección</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Valor Compra</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p)=>(
              <tr key={p.idProveedor}>
                <td>{p.idProveedor}</td>
                <td className="producto-nombre">{p.nomProveedor}</td>
                <td>{p.direccionProveedor}</td>
                <td>{p.correo}</td>
                <td>{p.telefono}</td>
                <td className="cantidad">${p.valorCompra}</td>
                <td>
                  <button className="btn-accion editar" onClick={()=>abrirEditar(p)}>Editar</button>
                  <button className="btn-accion eliminar" onClick={()=>eliminar(p)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {!filtrados.length && (
              <tr>
                <td colSpan={7} style={{ textAlign:"center", padding:14 }}>Sin resultados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal edición (reutiliza clases de tu css de productos si ya lo tienes) */}
      {showEdit && edit && (
        <div className="modal-backdrop" onClick={cerrar}>
          <div className="modal-card" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header"><h3>Editar #{edit.idProveedor}</h3></div>
            <div className="modal-body grid2">
              <div className="campo">
                <label>Nombre</label>
                <input value={edit.nomProveedor} onChange={(e)=>setEdit({...edit, nomProveedor:e.target.value})}/>
              </div>
              <div className="campo">
                <label>Dirección</label>
                <input value={edit.direccionProveedor} onChange={(e)=>setEdit({...edit, direccionProveedor:e.target.value})}/>
              </div>
              <div className="campo">
                <label>Correo</label>
                <input value={edit.correo} onChange={(e)=>setEdit({...edit, correo:e.target.value})}/>
              </div>
              <div className="campo">
                <label>Teléfono</label>
                <input value={edit.telefono} onChange={(e)=>setEdit({...edit, telefono:e.target.value})}/>
              </div>
              <div className="campo">
                <label>Valor Compra</label>
                <input type="number" min={0} value={edit.valorCompra} onChange={(e)=>setEdit({...edit, valorCompra:e.target.value})}/>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-cancelar" onClick={cerrar}>Cancelar</button>
              <button className="btn-guardar" onClick={guardar}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
