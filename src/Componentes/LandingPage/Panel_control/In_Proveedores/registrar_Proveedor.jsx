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
    let { name, value } = e.target;

    // 🔥 Validación: solo números en teléfono
    if (name === "telefono") {
      value = value.replace(/\D/g, ""); // elimina letras y símbolos
    }

    setProveedor({ ...proveedor, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Validación: teléfono debe ser 10 dígitos
    if (!/^\d{10}$/.test(proveedor.telefono)) {
      setMensaje("❌ El teléfono debe tener exactamente 10 dígitos numéricos");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

    // 🔥 Validación: valorCompra >= 1
    if (Number(proveedor.valorCompra) < 1) {
      setMensaje("❌ El valor de compra debe ser mayor o igual a 1");
      setTimeout(() => setMensaje(""), 3000);
      return;
    }

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
              placeholder="Nombre del proveedor"
              value={proveedor.nomProveedor}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Dirección</label>
            <input
              name="direccionProveedor"
              placeholder="Dirección"
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
              placeholder="Correo electrónico"
              value={proveedor.correo}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Teléfono</label>
            <input
              name="telefono"
              placeholder="Teléfono"
              value={proveedor.telefono}
              onChange={handleChange}
              maxLength={10}   // evita más de 10 dígitos
              required
            />
          </div>

          <div className="campo">
            <label>Valor Compra</label>
            <input
              name="valorCompra"
              type="number"
              min="1"   // 🔥 mayor o igual a 1
              placeholder="Valor de compra"
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
