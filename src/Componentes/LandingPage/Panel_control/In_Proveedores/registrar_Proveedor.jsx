import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../In_Productos/In_Productos.css";  // header / botones
import "../In_Productos/registrar_productos.css";        // estilos del form ya mejorados para productos

const RegistrarProveedor = () => {
  const navigate = useNavigate();

  const [proveedor, setProveedor] = useState({
    nomProveedor: "",
    direccionProveedor: "",
    correo: "",
    telefono: "",
    valorCompra: 0,
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setProveedor({ ...proveedor, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const r = await fetch("http://localhost:8080/Proveedor/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(proveedor),
      });

      if (r.ok) {
        setMensaje("✅ Proveedor guardado correctamente");
        setProveedor({
          nomProveedor: "",
          direccionProveedor: "",
          correo: "",
          telefono: "",
          valorCompra: 0,
        });
      } else {
        setMensaje("❌ Error al guardar el proveedor");
      }
    } catch {
      setMensaje("⚠️ Error de conexión con el servidor");
    } finally {
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="registrar-wrap">
      <div className="header-section sticky">
        <h1 className="page-title">Registrar proveedor</h1>
        <div className="acciones-top">
          <button className="btn-modificar" onClick={() => navigate("/lista_de_proveedores")}>
            ← Volver al inventario
          </button>
        </div>
      </div>

      {mensaje && <div className="alerta-mensaje">{mensaje}</div>}

      <form className="form-card grande" onSubmit={handleSubmit}>
        <div className="form-title">
          <h2>Datos del proveedor</h2>
          <p>Completa los campos para registrar un nuevo proveedor.</p>
        </div>

        <div className="grid">
          <div className="campo">
            <label>Nombre</label>
            <input
              name="nomProveedor"
              placeholder="Ej. Acero & Cía"
              value={proveedor.nomProveedor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Dirección</label>
            <input
              name="direccionProveedor"
              placeholder="Ej. Calle 10 #12-34"
              value={proveedor.direccionProveedor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Correo</label>
            <input
              name="correo"
              type="email"
              placeholder="proveedor@correo.com"
              value={proveedor.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Teléfono</label>
            <input
              name="telefono"
              placeholder="Ej. 3101234567"
              value={proveedor.telefono}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Valor Compra</label>
            <input
              name="valorCompra"
              type="number"
              min="0"
              placeholder="Ej. 150000"
              value={proveedor.valorCompra}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-primary" type="submit">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrarProveedor;
