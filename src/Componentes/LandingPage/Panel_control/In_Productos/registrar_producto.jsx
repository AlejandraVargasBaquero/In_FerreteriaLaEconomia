import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registrar_productos.css";
import "./In_Productos.css";

const RegistrarProducto = () => {
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombreProducto: "",
    proCategoria: "",
    proCantidad: 0,
    proPrecioEntrada: 0,
    proPrecioSalida: 0,
  });

  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔥 Validaciones: mayores a 0
    if (producto.proCantidad <= 0)
      return setMensaje("❌ La cantidad debe ser mayor a 0");

    if (producto.proPrecioEntrada <= 0)
      return setMensaje("❌ El precio de entrada debe ser mayor a 0");

    if (producto.proPrecioSalida <= 0)
      return setMensaje("❌ El precio de salida debe ser mayor a 0");

    try {
      const res = await fetch("http://localhost:8080/productos/guardar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      if (res.ok) {
        setMensaje("✅ Producto guardado correctamente");

        setProducto({
          nombreProducto: "",
          proCategoria: "",
          proCantidad: 0,
          proPrecioEntrada: 0,
          proPrecioSalida: 0,
        });

        setTimeout(() => setMensaje(""), 3000);
      } else {
        setMensaje("❌ Error al guardar el producto");
        setTimeout(() => setMensaje(""), 3000);
      }
    } catch {
      setMensaje("⚠️ Error de conexión con el servidor");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="registrar-wrap">
      <div className="header-section sticky">
        <h1 className="page-title">Registrar producto</h1>
        <div className="acciones-top">
          <button
            className="btn-modificar"
            onClick={() => navigate("/lista_de_productos")}
          >
            ← Volver al inventario
          </button>
        </div>
      </div>

      {mensaje && <div className="alerta-mensaje">{mensaje}</div>}

      <form className="form-card grande" onSubmit={handleSubmit}>
        <div className="form-title">
          <h2>Datos del producto</h2>
          <p>Completa los campos para registrar un nuevo producto.</p>
        </div>

        <div className="grid">
          <div className="campo">
            <label>Nombre del Producto</label>
            <input
              name="nombreProducto"
              placeholder="Nombre del producto"
              value={producto.nombreProducto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Categoría</label>
            <input
              name="proCategoria"
              placeholder="Categoría"
              value={producto.proCategoria}
              onChange={handleChange}
              required
            />
          </div>

          {/* UNIDAD ELIMINADA */}

          <div className="campo">
            <label>Cantidad</label>
            <input
              name="proCantidad"
              type="number"
              min="1"                 // 🔥 Debe ser mayor a 0
              placeholder="Cantidad"
              value={producto.proCantidad}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Precio de Entrada</label>
            <input
              name="proPrecioEntrada"
              type="number"
              min="1"                 // 🔥 Debe ser mayor a 0
              placeholder="Precio de entrada"
              value={producto.proPrecioEntrada}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Precio de Salida</label>
            <input
              name="proPrecioSalida"
              type="number"
              min="1"                 // 🔥 Debe ser mayor a 0
              placeholder="Precio de salida"
              value={producto.proPrecioSalida}
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

export default RegistrarProducto;
