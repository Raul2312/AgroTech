import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/rancho.css";
import logo from "../assets/img/agro.png";

const API_URL = import.meta.env.VITE_API;

interface Rancho {
  id_rancho: number | string;
  nombre: string;
  ubicacion: string;
  superficie_hectarias: number | string;
  telefono: string;
  correo: string;
  estatus: string;
  tipo_rancho: string;
  id_usuario: number;
}

const ClientRancho = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [ranchos, setRanchos] = useState<Rancho[]>([]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Obtener datos de sesión unificados
  const sessionStr = localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession");
  const sessionData = sessionStr ? JSON.parse(sessionStr) : null;
  const userData = sessionData?.user || sessionData?.usuario;

  const [form, setForm] = useState({
    nombre: "",
    ubicacion: "",
    latitud: "",
    longitud: "",
    superficie_hectarias: "",
    telefono: "",
    correo: "",
    tipo_rancho: "Ganadero",
    estatus: "Activo",
    id_usuario: userData?.id_usuario || 0
  });

  const logout = () => {
    localStorage.removeItem("agroSession");
    sessionStorage.removeItem("agroSession");
    navigate("/login");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Función para traer ranchos usando useCallback para evitar re-renders infinitos
  const fetchRanchos = useCallback(async () => {
    if (!userData?.id_usuario) return;
    try {
      // 🔥 Se envía el id_usuario en la URL como parámetro de consulta
      const res = await axios.get(`${API_URL}rancho?id_usuario=${userData.id_usuario}`);
      
      // Filtro de seguridad doble (por si la API devuelve todos los ranchos)
      const propios = res.data.filter(
        (r: Rancho) => String(r.id_usuario) === String(userData.id_usuario)
      );
      setRanchos(propios);
    } catch (error) {
      console.error("Error cargando ranchos:", error);
    }
  }, [userData?.id_usuario]);

  useEffect(() => {
    if (!userData) {
      navigate("/login");
    } else {
      fetchRanchos();
    }
  }, [userData, navigate, fetchRanchos]);

  const handleSubmit = async () => {
    try {
      if (!userData) {
        navigate("/login");
        return;
      }
      
      if (!form.nombre || !form.ubicacion) {
        alert("Por favor completa los campos principales del rancho.");
        return;
      }

      await axios.post(`${API_URL}rancho`, {
        ...form,
        latitud: parseFloat(form.latitud) || 0,
        longitud: parseFloat(form.longitud) || 0,
        superficie_hectarias: parseFloat(form.superficie_hectarias) || 0,
        id_usuario: userData.id_usuario,
        fecha_registro: new Date().toISOString().split("T")[0]
      });

      alert("Rancho registrado correctamente 🔥");

      setForm({
        nombre: "",
        ubicacion: "",
        latitud: "",
        longitud: "",
        superficie_hectarias: "",
        telefono: "",
        correo: "",
        tipo_rancho: "Ganadero",
        estatus: "Activo",
        id_usuario: userData.id_usuario
      });

      fetchRanchos();

    } catch (error) {
      console.error("ERROR BACKEND:", error);
      alert("Error al registrar rancho");
    }
  };

  return (
    <div className="client-rancho">
      {/* SIDEBAR */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img src={logo} className="logo-img" alt="logo" />
          {!collapsed && <span className="logo-text">AgroTech</span>}
        </div>

        <ul className="menu">
          <li><Link to="/indexscreen">🏠 {!collapsed && "Inicio"}</Link></li>
          <li><Link to="/areaCliente">📊 {!collapsed && "Dashboard"}</Link></li>
          <li><Link to="/mis-pedidos">📦 {!collapsed && "Mis pedidos"}</Link></li>
          <li><Link to="/mis-productos">📦 {!collapsed && "Publicar Productos"}</Link></li> 
          <li><Link to="/marketplace">🛒 {!collapsed && "Marketplace"}</Link></li>
          <li><Link to="/perfil">👤 {!collapsed && "Mi perfil"}</Link></li>
          <li className="active"><Link to="/rancho">🌱 {!collapsed && "Rancho"}</Link></li>
          <li><Link to="/trazabilidad">📍 {!collapsed && "Trazabilidad"}</Link></li>

          <li className="logout">
            <button onClick={logout}>
              ❌ {!collapsed && "Cerrar sesión"}
            </button>
          </li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className={`main ${collapsed ? "expanded" : ""}`}>
        {/* HEADER CON EL DISEÑO DEL PERFIL */}
        <header className="header">
          <div className="left-header">
            <button className="menu-btn" onClick={toggleSidebar}>
              ☰
            </button>
            <h2>Gestión de Ranchos</h2>
          </div>

          <div className="user-info">
            <div className="notification">
              🔔<span>2</span>
            </div>
            <span className="user-display-name">{userData?.nombre || "Usuario"} {userData?.apellido || ""}</span>
            <img src={logo} className="nav-avatar" alt="user" />
          </div>
        </header>

        {/* PANEL REGISTRO COMO CONTENEDOR BOX */}
        <div className="rancho-box">
          <h3>🌱 Registrar Nuevo Rancho</h3>
          <div className="form-grid">
            <input name="nombre" value={form.nombre} placeholder="Nombre del rancho" onChange={handleChange} />
            <input name="ubicacion" value={form.ubicacion} placeholder="Ubicación (Ciudad/Estado)" onChange={handleChange} />
            <input name="latitud" value={form.latitud} placeholder="Latitud" onChange={handleChange} />
            <input name="longitud" value={form.longitud} placeholder="Longitud" onChange={handleChange} />
            <input name="superficie_hectarias" value={form.superficie_hectarias} placeholder="Superficie (ha)" onChange={handleChange} />
            <input name="telefono" value={form.telefono} placeholder="Teléfono de contacto" onChange={handleChange} />
            <input name="correo" value={form.correo} placeholder="Email de contacto" onChange={handleChange} />

            <select name="tipo_rancho" value={form.tipo_rancho} onChange={handleChange}>
              <option value="Ganadero">Ganadero</option>
              <option value="Agrícola">Agrícola</option>
              <option value="Mixto">Mixto</option>
            </select>

            <select name="estatus" value={form.estatus} onChange={handleChange}>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>

          <div className="preview">
            <h3>Coordenadas Registradas</h3>
            <p>LAT: {form.latitud || "--"} | LNG: {form.longitud || "--"}</p>
          </div>

          <button className="btn-save" onClick={handleSubmit}>
            + Guardar en AgroTech
          </button>
        </div>

        {/* PANEL LISTA */}
        <div className="rancho-box">
          <h3>📂 Mis Ranchos Registrados ({ranchos.length})</h3>
          <div className="cards-container">
            {ranchos.map((r) => (
              <div className="rancho-card" key={r.id_rancho}>
                <h3>{r.nombre}</h3>
                <p>📍 {r.ubicacion}</p>
                <p>📐 {r.superficie_hectarias} Hectáreas</p>
                <p>📞 {r.telefono || "Sin teléfono"}</p>
                <p>📧 {r.correo || "Sin correo"}</p>
                <span className={`status-badge ${r.estatus?.toLowerCase() === 'activo' ? 'status-active' : 'status-inactive'}`}>
                  {r.estatus}
                </span>
              </div>
            ))}

            {ranchos.length === 0 && (
              <p style={{ color: '#94a3b8', gridColumn: '1/-1', textAlign: 'center', padding: '20px', margin: 0 }}>
                No tienes ranchos registrados actualmente.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRancho;