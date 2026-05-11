import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/rancho.css";
import logo from "../assets/img/agro.png";

const API_URL = import.meta.env.VITE_API;

const ClientRancho = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem("agroSession");
    sessionStorage.removeItem("agroSession");
    navigate("/login");
  };

  const getUser = () => {
    const session = localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession");
    return session ? JSON.parse(session) : null;
  };

  const user = getUser();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  const [ranchos, setRanchos] = useState<any[]>([]);

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
    id_usuario: user?.user.id_usuario || 0
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const fetchRanchos = async () => {
    try {
      const res = await axios.get(`${API_URL}rancho`);
      const propios = res.data.filter(
        (r: any) => r.id_usuario === user?.user.id_usuario
      );
      setRanchos(propios);
    } catch (error) {
      console.error("Error cargando ranchos:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRanchos();
    }
  }, []);

  const handleSubmit = async () => {
    try {
      if (!user) {
        navigate("/login");
        return;
      }
      await axios.post(`${API_URL}rancho` ,{
        ...form,
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        superficie_hectarias: parseFloat(form.superficie_hectarias),
        id_usuario: user.user.id_usuario,
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
        id_usuario: user.user.id_usuario
      });

      fetchRanchos();

    } catch (error) {
      console.error("ERROR BACKEND:", error);
      alert("Error al registrar rancho");
    }
  };

  return (
    <div className="layout">
      {/* SIDEBAR */}
      <aside className={`sidebar ${collapsed ? "collapsed":""}`}>
        <div className="logo-container" onClick={() => setCollapsed(!collapsed)}>
          <img src={logo} className="logo-img" alt="logo"/>
          {!collapsed && <span className="logo-text">AgroTech</span>}
        </div>

        <ul className="menu">
          <li><Link to="/indexscreen">🏠 {!collapsed && "Inicio"}</Link></li>
          <li><Link to="/areaCliente">📊 {!collapsed && "Dashboard"}</Link></li>
          <li><Link to="/mis-pedidos">📦 {!collapsed && "Mis pedidos"}</Link></li>
       
          <li><Link to="/marketplace">🛒 {!collapsed && "Marketplace"}</Link></li>
          <li>
              <Link to="/mis-productos">📦 {!collapsed && "Publicar Productos"}</Link>
              </li>
          <li><Link to="/perfil">👤 {!collapsed && "Mi perfil"}</Link></li>
          <li className="active"><Link to="/rancho">🌱 {!collapsed && "Rancho"}</Link></li>
          <li><Link to="/trazabilidad">📍 {!collapsed && "Trazabilidad"}</Link></li>

          <li className="logout" style={{marginTop: 'auto'}}>
            <button onClick={logout}>
              ❌ {!collapsed && "Cerrar sesión"}
            </button>
          </li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="main">
        {/* PANEL REGISTRO */}
        <div className="panel">
          <h2>🌱 Registrar Nuevo Rancho</h2>
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
        <div className="panel">
          <h2>📂 Mis Ranchos Registrados</h2>
          <div className="cards-container">
            {ranchos.map((r) => (
              <div className="rancho-card" key={r.id_rancho}>
                <h3>{r.nombre}</h3>
                <p>📍 {r.ubicacion}</p>
                <p>📐 {r.superficie_hectarias} Hectáreas</p>
                <p>📞 {r.telefono}</p>
                <p>📧 {r.correo}</p>
                <span className={`status-badge ${r.estatus === 'Activo' ? 'status-active' : 'status-inactive'}`}>
                  {r.estatus}
                </span>
              </div>
            ))}

            {ranchos.length === 0 && (
              <p style={{ color: '#94a3b8', gridColumn: '1/-1', textAlign: 'center', padding: '20px' }}>
                No tienes ranchos registrados actualmente.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientRancho;