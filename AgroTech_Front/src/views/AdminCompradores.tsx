import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/adminCompradores.css";
import logo from "../assets/img/agro.png";

interface CompradorPayPal {
  id_pedido: string | number;
  usuario_nombre: string;
  usuario_email: string;
  paypal_email: string; // Correo asociado al pago de PayPal
  producto_nombre: string;
  monto: string | number;
  fecha: string;
  estado: string;
}

const apiUrl = import.meta.env.VITE_API;

const AdminCompradores = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [compradores, setCompradores] = useState<CompradorPayPal[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchCompradoresPayPal = async () => {
      try {
        // Petición a tu API de administración para obtener ventas completadas por PayPal
        const res = await axios.get(`${apiUrl}admin/compradores-paypal`);
        setCompradores(res.data);
      } catch (err) {
        console.error("Error cargando compradores de PayPal:", err);
        
        // Simulación de respaldo (MockData) con la estructura para que puedas probar el diseño de inmediato
        const mockData: CompradorPayPal[] = [
          {
            id_pedido: "PAYID-MNA726384HD92",
            usuario_nombre: "RAÚL ANDRÉS MADRID",
            usuario_email: "raul.madrid@agrotech.com",
            paypal_email: "raul.andres.pay@gmail.com",
            producto_nombre: "Sensor de Humedad Suelo ESP32",
            monto: "1450.00",
            fecha: "2026-05-15",
            estado: "Completado"
          },
          {
            id_pedido: "PAYID-LKB918273KJ41",
            usuario_nombre: "SEBASTIÁN GÓMEZ",
            usuario_email: "seb.gomez@gmail.com",
            paypal_email: "seb.gomez.checkout@gmail.com",
            producto_nombre: "Kit de Riego Automatizado Profesional",
            monto: "4200.00",
            fecha: "2026-05-14",
            estado: "Completado"
          },
          {
            id_pedido: "PAYID-POX384729QM11",
            usuario_nombre: "JAVIER LÓPEZ",
            usuario_email: "javi.lopez@outlook.com",
            paypal_email: "javi.lopez@outlook.com",
            producto_nombre: "Microcontrolador Arduino Uno R4",
            monto: "680.00",
            fecha: "2026-05-10",
            estado: "Completado"
          }
        ];
        setCompradores(mockData);
      }
    };

    fetchCompradoresPayPal();
  }, []);

  const logout = () => {
    localStorage.removeItem("agroSession");
    sessionStorage.removeItem("agroSession");
    navigate("/login");
  };

  // Filtrar compradores dinámicamente por nombre, email o ID de transacción
  const compradoresFiltrados = compradores.filter((c) =>
    c.usuario_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.paypal_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(c.id_pedido).toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Cálculos de métricas de administración
  const ingresosTotales = compradores.reduce((acc, curr) => acc + parseFloat(String(curr.monto)), 0);
  const usuariosUnicos = Array.from(new Set(compradores.map((c) => c.usuario_email))).length;

  return (
    <div className="client-dashboard admin-compradores-page">
      {/* SIDEBAR ADAPTADO AL DISEÑO OSCURO */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img src={logo} className="logo-img" alt="Logo" />
          {!collapsed && <span className="logo-text">AgroTech</span>}
        </div>
         <ul className="menu">
                <li><Link to="/indexscreen">🏠 {!collapsed && "Inicio"}</Link></li>
        
                <li className={location.pathname === "/dashboard" ? "active" : ""}>
                  <Link to="/dashboard">📊 {!collapsed && "Dashboard"}</Link>
                </li>
        
                <li className={location.pathname === "/usuarios" ? "active" : ""}>
                  <Link to="/usuarios">👥 {!collapsed && "Usuarios"}</Link>
                </li>
        
                <li className={location.pathname === "/productores" ? "active" : ""}>
                  <Link to="/productores">🚜 {!collapsed && "Productores"}</Link>
                </li>
        
                <li className={location.pathname === "/admin/compradores" ? "active" : ""}>
                  <Link to="/admin/compradores">🛒 {!collapsed && "Compradores"}</Link>
                </li>
        
                <li className={location.pathname === "/marketplace" ? "active" : ""}>
                  <Link to="/marketplace">👥 {!collapsed && "Marketplace"}</Link>
                </li>
        
                <li className={location.pathname === "/productos" ? "active" : ""}>
                  <Link to="/productos">📦 {!collapsed && "Productos"}</Link>
                </li>
        
               
        
                <li className="logout">
                  <button onClick={logout}>
                    ❌ {!collapsed && "Cerrar sesión"}
                  </button>
                </li>
              </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <div className={`main ${collapsed ? "expanded" : ""}`}>
        <header className="header">
          <div className="left-header">
            <button className="menu-btn" onClick={() => setCollapsed(!collapsed)}>☰</button>
            <h2>Panel de Ventas (PayPal)</h2>
          </div>
          <div className="user-info">
            <span>Administrador</span>
            <img src={logo} alt="User" />
          </div>
        </header>

        {/* METRICAS DE NEGOCIO */}
        <section className="stats">
          <div className="stat-card">
            <span>Ingresos por PayPal</span>
            <h3 className="highlight-text">${ingresosTotales.toLocaleString("es-MX", { minimumFractionDigits: 2 })} MXN</h3>
          </div>
          <div className="stat-card">
            <span>Clientes Únicos</span>
            <h3>{usuariosUnicos}</h3>
          </div>
          <div className="stat-card">
            <span>Transacciones PayPal</span>
            <h3>{compradores.length}</h3>
          </div>
        </section>

        {/* BARRA DE BÚSQUEDA Y CONTROL */}
        <div className="admin-actions-bar">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Buscar por comprador, email de PayPal o ID de Pago..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* CONTENEDOR DE LA TABLA */}
        <section className="grid-admin">
          <div className="orders admin-table-container">
            <h3>Usuarios con Compras Completadas</h3>
            <table>
              <thead>
                <tr>
                  <th>ID Transacción PayPal</th>
                  <th>Comprador / Cuenta</th>
                  <th>Email PayPal</th>
                  <th>Producto Adquirido</th>
                  <th>Monto</th>
                  <th>Fecha</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {compradoresFiltrados.length > 0 ? (
                  compradoresFiltrados.map((c, idx) => (
                    <tr key={idx}>
                      <td className="paypal-id">{c.id_pedido}</td>
                      <td>
                        <div className="user-cell">
                          <strong className="user-name">{c.usuario_nombre}</strong>
                          <span className="user-subtext">{c.usuario_email}</span>
                        </div>
                      </td>
                      <td>{c.paypal_email}</td>
                      <td>{c.producto_nombre}</td>
                      <td className="amount-cell">${parseFloat(String(c.monto)).toFixed(2)}</td>
                      <td>{c.fecha}</td>
                      <td>
                        <span className="badge-paypal">
                          {c.estado}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} style={{ textAlign: "center", color: "#64748b", padding: "30px" }}>
                      No se encontraron compradores que coincidan con la búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminCompradores;