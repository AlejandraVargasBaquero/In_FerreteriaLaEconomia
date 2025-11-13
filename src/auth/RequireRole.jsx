// src/auth/RequireRole.jsx
import { Navigate } from "react-router-dom";

/* ===============================
   ✅ Normalizador de Roles
   =============================== */
const normalizeRole = (raw) => {
  if (!raw) return "";
  const s = String(raw).toUpperCase();

  if (s.includes("ADMIN")) return "ADMIN";
  if (s.includes("EMPLEADO") || s.includes("EMP")) return "EMPLEADO";

  if (s.startsWith("ROL_")) return s.replace("ROL_", "");
  if (s.startsWith("ROLE_")) return s.replace("ROLE_", "");

  if (s === "1") return "ADMIN";
  if (s === "2") return "EMPLEADO";

  return s;
};

/* ===============================
   ✅ Obtiene el rol guardado
   =============================== */
const getStoredRole = () => {
  const r = localStorage.getItem("role") || localStorage.getItem("rol") || "";
  return normalizeRole(r);
};

/* ===============================
   ✅ Componente de protección
   =============================== */
export default function RequireRole({ allow = [], children, redirectTo = "/login" }) {
  const role = getStoredRole();
  const token = localStorage.getItem("authToken") || localStorage.getItem("token");

  // Si no hay token ni rol => redirige a login
  if (!role && !token) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si la ruta requiere ciertos roles, validamos
  const ok = allow.length === 0 ? true : allow.map(normalizeRole).includes(role);

  // Si cumple el rol, muestra el contenido; si no, lo devuelve al login
  return ok ? children : <Navigate to={redirectTo} replace />;
}
