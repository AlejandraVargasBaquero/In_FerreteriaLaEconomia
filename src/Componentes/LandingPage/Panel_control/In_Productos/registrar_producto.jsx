import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./registrar_productos.css";
import "./In_Productos.css"; // Reutiliza header y botones

const RegistrarProducto = () => {
  const navigate = useNavigate();

  const [producto, setProducto] = useState({
    nombreProducto: "",
    proCategoria: "",
    proUnidad: 0,
    proCantidad: 0,
    proPrecioEntrada: 0,
    proPrecioSalida: 0,
    proDescuento: 0,
  });

  const [mensaje, setMensaje] = useState(""); // ✅ mensaje de confirmación

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
          proUnidad: 0,
          proCantidad: 0,
          proPrecioEntrada: 0,
          proPrecioSalida: 0,
          proDescuento: 0,
        });

        // Oculta el mensaje después de 3 segundos
        setTimeout(() => setMensaje(""), 3000);
      } else {
        setMensaje("❌ Error al guardar el producto");
        setTimeout(() => setMensaje(""), 3000);
      }
    } catch (error) {
      setMensaje("⚠️ Error de conexión con el servidor");
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="registrar-wrap">
      {/* Header fijo arriba */}
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

      {/* Mensaje de éxito o error */}
      {mensaje && <div className="alerta-mensaje">{mensaje}</div>}

      {/* Formulario */}
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
              placeholder="Ej. Tornillo 3/16 x 6"
              value={producto.nombreProducto}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Categoría</label>
            <input
              name="proCategoria"
              placeholder="Ej. Ferretería / Construcción"
              value={producto.proCategoria}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Unidad</label>
            <input
              name="proUnidad"
              type="number"
              min="0"
              placeholder="Ej. 1"
              value={producto.proUnidad}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Cantidad</label>
            <input
              name="proCantidad"
              type="number"
              min="0"
              placeholder="Ej. 50"
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
              min="0"
              placeholder="Ej. 2500"
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
              min="0"
              placeholder="Ej. 3500"
              value={producto.proPrecioSalida}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label>Descuento (%)</label>
            <input
              name="proDescuento"
              type="number"
              min="0"
              max="100"
              placeholder="Ej. 10"
              value={producto.proDescuento}
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
