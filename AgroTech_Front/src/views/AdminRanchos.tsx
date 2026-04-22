import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/admin.css";
import logo from "../assets/img/agro.png";

const API_URL = import.meta.env.VITE_API;

const AdminRanchos = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [ranchos, setRanchos] = useState<any[]>([]);
  const [busqueda, setBusqueda] = useState("");

  const toggleSidebar = () => setCollapsed(!collapsed);

  useEffect(() => {
    cargarRanchos();
  }, []);

  const cargarRanchos = async () => {
    try {
      // Endpoint para obtener los datos mostrados en la imagen
      const res = await axios.get(`${API_URL}rancho`); 
      setRanchos(res.data);
    } catch (error) {
      console.log("Error al cargar los datos de los ranchos", error);
    }
  };

  const pillButtonStyle = {
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "13px",
    transition: "0.3s"
  };

  return (
    <div className="admin-page">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img src={logo} className="logo-img" alt="Logo" />
          {!collapsed && <span className="logo-text">AgroTech</span>}
        </div>
        <ul className="menu">
          <li><Link to="/dashboard">📊 {!collapsed && "Dashboard"}</Link></li>
          <li><Link to="/usuarios">👥 {!collapsed && "Usuarios"}</Link></li>
          <li className="active"><Link to="/productores">🚜 {!collapsed && "Productores"}</Link></li>
          <li><Link to="/compradores">🛒 {!collapsed && "Compradores"}</Link></li>
          <li><Link to="/marketplace">🛒 {!collapsed && "Marketplace"}</Link></li>
          <li><Link to="/productos">📦 {!collapsed && "Productos"}</Link></li>
          <li><Link to="/reportes">📈 {!collapsed && "Reportes"}</Link></li>
          <li className="logout">
            <button onClick={() => navigate("/login")}>❌ {!collapsed && "Cerrar sesión"}</button>
          </li>
        </ul>
      </aside>

      <div className={`main ${collapsed ? "expanded" : ""}`}>
        <header className="admin-header">
          <div className="left-header">
            <button className="menu-btn" onClick={toggleSidebar}>☰</button>
            <h2>Panel de Control de Ranchos</h2>
          </div>
          <input 
            className="search" 
            placeholder="Buscar por nombre, correo o tipo..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </header>

        <section className="table-section">
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Ubicación</th>
                  <th>Coordenadas</th>
                  <th>Superficie</th>
                  <th>Contacto</th>
                  <th>Tipo</th>
                  <th>Estatus</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ranchos
                  .filter(r => 
                    r.nombre.toLowerCase().includes(busqueda.toLowerCase()) || 
                    r.correo.toLowerCase().includes(busqueda.toLowerCase())
                  )
                  .map((r) => (
                    <tr key={r.id_rancho}>
                      <td>{r.id_rancho}</td>
                      <td><strong>{r.nombre}</strong></td>
                      <td>{r.ubicacion}</td>
                      <td>
                        <small>{r.latitud},</small><br/>
                        <small>{r.longitud}</small>
                      </td>
                      <td>{r.superficie_hectarias} ha</td>
                      <td>
                        <small>📞 {r.telefono}</small><br/>
                        <small>📧 {r.correo}</small>
                      </td>
                      <td>{r.tipo_rancho}</td>
                      <td>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '15px', 
                          fontSize: '11px',
                          background: r.estatus.toLowerCase() === 'activo' ? '#e8f5e9' : '#ffebee',
                          color: r.estatus.toLowerCase() === 'activo' ? '#2e7d32' : '#c62828'
                        }}>
                          {r.estatus.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <button 
                          style={{ ...pillButtonStyle, background: "#2e7d32" }}
                          onClick={() => navigate(`/monitoreo/${r.id_rancho}`)}
                        >
                          Monitorear
                        </button>
                        <button 
                          style={{ ...pillButtonStyle, background: "#f39c12" }}
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminRanchos;