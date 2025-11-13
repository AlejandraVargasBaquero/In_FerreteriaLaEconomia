// src/auth/roles.js
export const ROLE_ADMIN = "ADMIN";
export const ROLE_EMP   = "EMPLEADO";

export const normalizeRole = (raw) => {
  if (!raw) return "";
  const s = String(raw).toUpperCase();
  if (s.includes("ADMIN")) return ROLE_ADMIN;
  if (s.includes("EMP"))   return ROLE_EMP;
  // por si vienen como ROL_ADMIN / ROLE_ADMIN / 1 / 2
  if (s.includes("ROL_"))  return s.replace("ROL_", "");
  if (s.includes("ROLE_")) return s.replace("ROLE_", "");
  if (s === "1") return ROLE_ADMIN;
  if (s === "2") return ROLE_EMP;
  return s;
};

export const getStoredRole = () => {
  const r = localStorage.getItem("role");
  return r ? normalizeRole(r) : "";
};

export const isAdmin = () => getStoredRole() === ROLE_ADMIN;
export const isEmployee = () => getStoredRole() === ROLE_EMP;
