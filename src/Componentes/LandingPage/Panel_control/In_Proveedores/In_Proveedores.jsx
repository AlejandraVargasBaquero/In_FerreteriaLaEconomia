"use client";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaPlus, FaEdit } from "react-icons/fa";
import "../In_Productos/In_Productos.css"; // reutiliza estilos

const In_Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [busquedaNombre, setBusquedaNombre] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/Proveedor/obtener")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProveedores(data);
        else if (Array.isArray(data?.proveedores)) setProveedores(data.proveedores);
        else setProveedores([]);
      })
      .catch(() => setProveedores([]));
  }, []);

  const proveedoresFiltrados = useMemo(
    () =>
      proveedores.filter((p) =>
        (p.nomProveedor || "").toLowerCase().includes(busquedaNombre.toLowerCase())
      ),
    [proveedores, busquedaNombre]
  );

  return (
    <div className="contenedor-inventario">
      <div className="header-section">
        <h1 className="page-title">Gestión de Proveedores</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn-modificar" onClick={() => navigate("/registro_de_proveedores")}>
            <FaPlus /> Agregar
          </button>
          <button className="btn-modificar" onClick={() => navigate("/modificar_proveedores")}>
            <FaEdit /> Modificar
          </button>
        </div>
      </div>

      <div className="filtros-container">
        <div className="filtro-item">
          <label>
            <FaSearch /> Buscar Proveedor:
          </label>
          <input
            type="text"
            value={busquedaNombre}
            onChange={(e) => setBusquedaNombre(e.target.value)}
            placeholder="Nombre del proveedor..."
          />
        </div>
      </div>

      <div className="tabla-container">
        <table className="tabla-productos">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre del Proveedor</th>
              <th>Dirección</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Valor Compra</th>
            </tr>
          </thead>
          <tbody>
            {proveedoresFiltrados.map((p, i) => (
              <tr key={p.idProveedor ?? i}>
                <td>{p.idProveedor}</td>
                <td className="producto-nombre">{p.nomProveedor}</td>
                <td>{p.direccionProveedor}</td>
                <td>{p.correo}</td>
                <td>{p.telefono}</td>
                <td className="cantidad">${p.valorCompra}</td>
              </tr>
            ))}
            {!proveedoresFiltrados.length && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 14 }}>
                  Sin resultados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default In_Proveedores;
