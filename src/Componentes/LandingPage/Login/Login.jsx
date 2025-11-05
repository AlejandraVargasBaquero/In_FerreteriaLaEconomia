import React, { useState, useEffect } from 'react';
import './Login.css';
import { FaUserCircle } from "react-icons/fa";
import logo from './logo.png';
import { useLocation, useNavigate } from 'react-router-dom';

const decodeJwt = (t) => {
  try {
    const base = t.split('.')[1];
    const json = atob(base.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
};

const fetchRoleFallback = async (token, identifier) => {
  try {
    const url = `http://localhost:8080/api/usuarios/rol?usernameOrEmail=${encodeURIComponent(identifier)}`;
    const res = await fetch(url, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
    const data = await res.json().catch(async () => ({ role: await res.text() }));
    return data?.rol || data?.role || data?.nombre || data || null;
  } catch {
    return null;
  }
};

const mapPermisos = (role) => {
  const esAdmin = /admin/i.test(role) || /administrativo/i.test(role);
  if (esAdmin) {
    return {
      rol: 'Administrativo',
      verProductos: true,
      modificarProductos: true,
      verProveedores: true,
      modificarProveedores: true,
      remisiones: true,
      crearUsuario: true,
      reportes: true
    };
  }
  return {
    rol: 'Empleado',
    verProductos: true,
    modificarProductos: false,
    verProveedores: true,
    modificarProveedores: false,
    remisiones: true,
    crearUsuario: false,
    reportes: false
  };
};

const inferRole = async (token, identifier) => {
  const payload = token ? decodeJwt(token) : null;
  let role =
    payload?.rol ||
    payload?.role ||
    (Array.isArray(payload?.roles) ? payload.roles[0] : null) ||
    (Array.isArray(payload?.authorities) ? payload.authorities[0] : null) ||
    null;
  if (!role) role = await fetchRoleFallback(token, identifier);
  return (role || 'Empleado').toString();
};

const Login = () => {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:8080/api/login/prueba", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usernameOrEmail: correo, password })
    })
      .then(r => { if (!r.ok) throw new Error("Credenciales inválidas"); return r.text(); })
      .then(async (token) => {
        if (token) localStorage.setItem('authToken', token);
        const role = await inferRole(token, correo);
        const permisos = mapPermisos(role);
        localStorage.setItem('rol', permisos.rol);
        localStorage.setItem('permisos', JSON.stringify(permisos));
        window.location.href = "http://localhost:3000/Panel";
      })
      .catch(err => alert(err.message));
  };

  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get('token');
  const hasToken = !!token;

  const [showForgot, setShowForgot] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpMsg, setFpMsg] = useState(null);
  const [fpErr, setFpErr] = useState(null);

  useEffect(() => {
    if (hasToken) {
      setShowForgot(true);
      setIdentifier(prev => prev || correo || '');
    }
  }, [hasToken, correo]);

  const openForgot = (e) => {
    e.preventDefault();
    setShowForgot(true);
    setIdentifier(correo || '');
    setFpMsg(null);
    setFpErr(null);
  };
  const closeForgot = () => {
    setShowForgot(false);
    if (hasToken) navigate('/login', { replace: true });
  };

  const submitForgot = async () => {
    if (!identifier.trim()) { setFpErr('Escribe tu correo o usuario'); return; }
    setFpLoading(true); setFpMsg(null); setFpErr(null);
    try {
      const res = await fetch("http://localhost:8080/api/password/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail: identifier.trim() })
      });
      const data = await res.json().catch(async () => ({ message: await res.text() }));
      if (!res.ok) throw new Error(data?.error || data?.message || `Error ${res.status}`);
      setFpMsg(data?.message || "Si el correo/usuario existe, te enviamos instrucciones.");
    } catch (err) {
      setFpErr(err.message || "No se pudo solicitar la recuperación.");
    } finally {
      setFpLoading(false);
    }
  };

  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [rpLoading, setRpLoading] = useState(false);
  const [rpMsg, setRpMsg] = useState(null);
  const [rpErr, setRpErr] = useState(null);

  const submitReset = async () => {
    setRpErr(null); setRpMsg(null);
    if (newPwd.length < 4) return setRpErr('Mínimo 4 caracteres');
    if (newPwd !== confirmPwd) return setRpErr('Las contraseñas no coinciden');
    setRpLoading(true);
    try {
      const res = await fetch('http://localhost:8080/api/password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: newPwd })
      });
      const data = await res.json().catch(async () => ({ message: await res.text() }));
      if (!res.ok) throw new Error(data?.error || data?.message || `Error ${res.status}`);
      setRpMsg('Contraseña actualizada. Inicia sesión de nuevo.');
      setTimeout(() => { navigate('/login', { replace: true }); setShowForgot(false); }, 1500);
    } catch (err) {
      setRpErr(err.message || 'No se pudo restablecer la contraseña.');
    } finally {
      setRpLoading(false);
    }
  };

  return (
    <div className='clase1r contenedor-loginr'>
      <form className="col-izqr" onSubmit={handleSubmit}>
        <img className='logor' src={logo} alt="logo" />
        <div className='imagenr'><FaUserCircle /></div>

        <div className='login-registrorr'>
          <h3>Usuario</h3>
          <input type="text" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
        </div>
        <div className='login-registrorr'>
          <h3>Contraseña</h3>
          <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <div className='recuperarcontrasenar'>
          <a href="#" onClick={openForgot}>¿Olvidaste tu contraseña?</a>
        </div>

        <div className='botonr'>
          <button type="submit">Login</button>
        </div>
      </form>

      {showForgot && (
        <aside className="col-derr forgot-panelr">
          <h3>Recuperar contraseña</h3>
          <p>Ingresa tu correo o usuario y te enviaremos un enlace para restablecerla.</p>

          <input
            type="text"
            placeholder="correo@dominio.com o usuario"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={hasToken}
          />

          <div className="modal-actionsr">
            <button type="button" onClick={closeForgot} disabled={fpLoading || rpLoading}>Cancelar</button>
            <button type="button" onClick={submitForgot} disabled={fpLoading || hasToken}>
              {fpLoading ? "Enviando..." : "Enviar"}
            </button>
          </div>

          {fpMsg && <div className="alertr success">{fpMsg}</div>}
          {fpErr && <div className="alertr error">{fpErr}</div>}

          {hasToken && (
            <>
              <hr className="sepr" />
              <h4>Contraseña nueva</h4>
              <input
                type="password"
                placeholder="Nueva contraseña"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirmar contraseña"
                value={confirmPwd}
                onChange={(e) => setConfirmPwd(e.target.value)}
                style={{ marginTop: 8 }}
              />
              <div className="modal-actionsr" style={{ marginTop: 10 }}>
                <button type="button" onClick={submitReset} disabled={rpLoading}>
                  {rpLoading ? 'Guardando…' : 'Guardar'}
                </button>
              </div>
              {rpMsg && <div className="alertr success">{rpMsg}</div>}
              {rpErr && <div className="alertr error">{rpErr}</div>}
            </>
          )}
        </aside>
      )}
    </div>
  );
};

export default Login;
