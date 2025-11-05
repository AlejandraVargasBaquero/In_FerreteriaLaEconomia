"use client";

import { useEffect, useMemo, useState } from "react";
import "./Reportes.css";

const RAW_BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8080";
const BASE_URL = String(RAW_BASE).replace(/\/+$/, "");

function toQuery(params = {}) {
  const s = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => (v ?? v === 0) && s.append(k, v));
  return s.toString();
}
async function downloadPdf(path, params, filename) {
  const qs = toQuery(params);
  const url = `${BASE_URL}${path}${qs ? "?" + qs : ""}`;
  const res = await fetch(url, { headers: { Accept: "application/pdf" } });
  if (!res.ok) throw new Error(`Error ${res.status}`);
  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename || "reporte.pdf";
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(a.href);
}
async function getJson(path, params) {
  const qs = toQuery(params);
  const url = `${BASE_URL}${path}${qs ? "?" + qs : ""}`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(`Error ${r.status}`);
  return r.json();
}

const todayIso = () => new Date().toISOString().slice(0, 10);
const firstDayOfYearIso = () => `${new Date().getFullYear()}-01-01`;

export default function Reportes() {
  const [desde, setDesde] = useState(firstDayOfYearIso());
  const [hasta, setHasta] = useState(todayIso());

  // Estado del Resumen
  const [resumen, setResumen] = useState(null);
  const [loadingResumen, setLoadingResumen] = useState(false);
  const [errorResumen, setErrorResumen] = useState("");
  const [mostrarResumen, setMostrarResumen] = useState(false); // <-- NUEVO

  // Parámetros de otras tarjetas
  const [limitTop, setLimitTop] = useState(10);
  const [umbral, setUmbral] = useState(5);
  const [resumenPdfDisponible, setResumenPdfDisponible] = useState(false);

  const rangoInvalido = useMemo(
    () => !desde || !hasta || new Date(desde) > new Date(hasta),
    [desde, hasta]
  );

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const r = await fetch(
          `${BASE_URL}/reportes/ventas/resumen-pdf?desde=${firstDayOfYearIso()}&hasta=${todayIso()}`,
          { method: "HEAD" }
        );
        if (!cancel) setResumenPdfDisponible(r.ok);
      } catch { if (!cancel) setResumenPdfDisponible(false); }
    })();
    return () => { cancel = true; };
  }, []);

  const cargarResumen = async () => {
    if (rangoInvalido) return;
    setMostrarResumen(true);          // <-- mostrar la sección al click
    setLoadingResumen(true);
    setErrorResumen("");
    try {
      const data = await getJson("/reportes/ventas/resumen", { desde, hasta });
      setResumen(data);
    } catch (e) {
      setErrorResumen(e.message || "Error");
      setResumen(null);
    } finally {
      setLoadingResumen(false);
    }
  };

  const descargarDiario = () =>
    downloadPdf("/reportes/ventas/diario", { desde, hasta }, `ventas_diario_${desde}_${hasta}.pdf`);
  const descargarTop = () =>
    downloadPdf("/reportes/top-productos", { desde, hasta, limit: limitTop }, `top_productos_${desde}_${hasta}.pdf`);
  const descargarStockBajo = () =>
    downloadPdf("/reportes/stock-bajo", { umbral }, `stock_bajo_menor_a_${umbral}.pdf`);
  const descargarValorInventario = () =>
    downloadPdf("/reportes/valor-inventario", {}, `valor_inventario.pdf`);
  const descargarResumenPdf = () =>
    downloadPdf("/reportes/ventas/resumen-pdf", { desde, hasta }, `resumen_ventas_${desde}_${hasta}.pdf`);

  return (
    <div className="rp-container">
      <header className="rp-header">
        <h1>Reportes – Inventario & Ventas</h1>
        <p>Genera y descarga informes en PDF o consulta el resumen en línea.</p>
      </header>

      {/* Filtros */}
      <section className="rp-card rp-filtros">
        <div className="rp-grid-3">
          <div className="rp-field">
            <label>Desde</label>
            <input type="date" value={desde} onChange={(e) => setDesde(e.target.value)} />
          </div>
          <div className="rp-field">
            <label>Hasta</label>
            <input type="date" value={hasta} onChange={(e) => setHasta(e.target.value)} />
          </div>
          <div className="rp-field rp-actions-end">
            <button
              className="rp-btn"
              onClick={cargarResumen}
              disabled={loadingResumen || rangoInvalido}
              title="Consultar resumen"
            >
              {loadingResumen ? "Cargando..." : "Consultar resumen"}
            </button>
            {resumenPdfDisponible && (
              <button
                className="rp-btn rp-btn-secondary"
                onClick={descargarResumenPdf}
                disabled={rangoInvalido}
              >
                PDF Resumen
              </button>
            )}
          </div>
        </div>

        {rangoInvalido && (
          <div className="rp-callout rp-callout-warn">
            El rango de fechas es inválido (Desde &gt; Hasta).
          </div>
        )}
      </section>

      {/* === Resumen arriba a todo el ancho: SOLO aparece tras click === */}
      {mostrarResumen && (
        <section className="rp-grid-1">
          <article className="rp-card">
            <div className="rp-card-head rp-justify-between">
              <h2>Resumen</h2>
              <span className="rp-badge">Live</span>
            </div>

            {errorResumen && <div className="rp-callout rp-callout-error">{errorResumen}</div>}

            {resumen ? (
              <table className="rp-table">
                <thead>
                  <tr><th>Métrica</th><th>Valor</th></tr>
                </thead>
                <tbody>
                  <tr><td>Periodo</td><td>{resumen.desde} a {resumen.hasta}</td></tr>
                  <tr><td>Cantidad de ventas</td><td>{resumen.cantidadVentas ?? 0}</td></tr>
                  <tr><td>Items vendidos</td><td>{resumen.itemsVendidos ?? 0}</td></tr>
                  <tr><td>Total vendido</td><td>{resumen.totalVendido ?? 0}</td></tr>
                </tbody>
              </table>
            ) : (
              <div className="rp-skeleton">
                <div className="sk-row" /><div className="sk-row" /><div className="sk-row" /><div className="sk-row" />
              </div>
            )}
          </article>
        </section>
      )}

      {/* === 4 tarjetas PDF en una sola fila (no centradas) === */}
      <section className="rp-grid-4">
        <article className="rp-card">
          <div className="rp-card-head"><h2>Ventas / Remisiones por día</h2><span className="rp-badge">PDF</span></div>
          <p className="rp-card-desc">Descarga el consolidado de ventas por fecha dentro del rango.</p>
          <button className="rp-btn" onClick={descargarDiario} disabled={rangoInvalido}>Descargar</button>
        </article>

        <article className="rp-card">
          <div className="rp-card-head"><h2>Top productos</h2><span className="rp-badge">PDF</span></div>
          <p className="rp-card-desc">Listado de los productos más vendidos.</p>
          <div className="rp-inline">
            <label>Límite</label>
            <input type="number" min={1} value={limitTop} onChange={(e) => setLimitTop(parseInt(e.target.value || 1, 10))}/>
            <button className="rp-btn" onClick={descargarTop} disabled={rangoInvalido}>Descargar</button>
          </div>
        </article>

        <article className="rp-card">
          <div className="rp-card-head"><h2>Stock bajo</h2><span className="rp-badge">PDF</span></div>
          <p className="rp-card-desc">Productos con inventario por debajo del umbral.</p>
          <div className="rp-inline">
            <label>Umbral</label>
            <input type="number" min={0} value={umbral} onChange={(e) => setUmbral(parseInt(e.target.value || 0, 10))}/>
            <button className="rp-btn" onClick={descargarStockBajo}>Descargar</button>
          </div>
        </article>

        <article className="rp-card">
          <div className="rp-card-head"><h2>Valor del inventario</h2><span className="rp-badge">PDF</span></div>
          <p className="rp-card-desc">Valor total calculado por precio de entrada x cantidad.</p>
          <button className="rp-btn" onClick={descargarValorInventario}>Descargar</button>
        </article>
      </section>
    </div>
  );
}
