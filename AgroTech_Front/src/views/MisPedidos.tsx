import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/clientDashboard.css";
import logo from "../assets/img/agro.png";

interface Pedido {
  id_pedido: number;
  producto_nombre: string;
  estado: "Enviado" | "Procesando" | "Entregado";
  fecha: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const apiUrl = import.meta.env.VITE_API;

const MisPedidos = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await axios.get(`${apiUrl}mis-pedidos`);
        setPedidos(res.data);
      } catch (err) {
        console.error("Error cargando historial:", err);
      }
    };

    // Leer carrito del localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
    
    fetchHistorial();
  }, []);

  const logout = () => {
    localStorage.removeItem("agroSession");
    sessionStorage.removeItem("agroSession");
    navigate("/login");
  };

  // Función para eliminar un producto del carrito
  const removeItem = (id: number) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Cálculos dinámicos
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const envio = subtotal > 0 ? 150 : 0;
  const total = subtotal + envio;

  return (
    <div className="client-dashboard">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img src={logo} className="logo-img" alt="Logo" />
          {!collapsed && <span className="logo-text">AgroTech</span>}
        </div>
        <ul className="menu">
          <li><Link to="/areacliente">🏠 {!collapsed && "Dashboard"}</Link></li>
          <li><Link to="/indexscreen">🏠 {!collapsed && "Inicio"}</Link></li>
          <li className="active"><Link to="/mis-pedidos">📦 {!collapsed && "Mis pedidos"}</Link></li>
          <li><Link to="/favoritos">⭐ {!collapsed && "Favoritos"}</Link></li>
          <li><Link to="/marketplace">🛒 {!collapsed && "Marketplace"}</Link></li>
          <li><Link to="/perfil">👤 {!collapsed && "Mi perfil"}</Link></li>
          <li><Link to="/rancho">👤 {!collapsed && "Rancho"}</Link></li>
          <li><Link to="/trazabilidad">👤 {!collapsed && "Trazabilidad"}</Link></li>
          <li className="logout">
            <button onClick={logout}>❌ {!collapsed && "Cerrar sesión"}</button>
          </li>
        </ul>
      </aside>

      <div className={`main ${collapsed ? "expanded" : ""}`}>
        <header className="header">
          <div className="left-header">
            <button className="menu-btn" onClick={() => setCollapsed(!collapsed)}>☰</button>
            <h2>Mis Pedidos</h2>
          </div>
          <div className="user-info">
            <div className="notification">🔔<span>{pedidos.length}</span></div>
            <span>Cliente</span>
            <img src={logo} alt="User" />
          </div>
        </header>

        <section className="stats">
          <div className="stat-card">
            <span>Pedidos Totales</span>
            <h3>{pedidos.length}</h3>
          </div>
          <div className="stat-card">
            <span>En carrito</span>
            <h3>{cartItems.length}</h3>
          </div>
          <div className="stat-card">
            <span>Subtotal</span>
            <h3>${subtotal.toLocaleString()}</h3>
          </div>
          <div className="stat-card">
            <span>Total con Envío</span>
            <h3>${total.toLocaleString()}</h3>
          </div>
        </section>

        <section className="grid">
          {/* TABLA DE HISTORIAL (DATOS DE LA DB) */}
          <div className="orders">
            <h3>Historial de Compras</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Producto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id_pedido}>
                    <td>#{p.id_pedido}</td>
                    <td>{p.producto_nombre}</td>
                    <td>
                      <span className={`badge ${p.estado === "Enviado" ? "shipped" : p.estado === "Procesando" ? "pending" : "delivered"}`}>
                        {p.estado}
                      </span>
                    </td>
                    <td>{p.fecha}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SECCIÓN DINÁMICA DEL CARRITO (DATOS DEL LOCALSTORAGE) */}
          <div className="recommendations">
            <h3>Tu Carrito Actual</h3>
            <div className="cart-list">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item) => (
                    <div key={item.id} className="product">
                      <img src={item.image || "https://via.placeholder.com/70"} alt={item.name} />
                      <div style={{ flex: 1 }}>
                        <h4>{item.name}</h4>
                        <p>${item.price} x {item.quantity}</p>
                        <button 
                          onClick={() => removeItem(item.id)}
                          style={{ background: '#e53935', padding: '4px 8px', fontSize: '12px' }}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                  <div className="checkout-summary" style={{ marginTop: '20px', borderTop: '1px solid #22343c', paddingTop: '15px' }}>
                    <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span>Envío:</span>
                      <span>${envio.toFixed(2)}</span>
                    </div>
                    <div className="price-row" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px' }}>
                      <span>Total:</span>
                      <span style={{ color: '#A5D6A7' }}>${total.toFixed(2)} MXN</span>
                    </div>
                    <button className="checkout-btn" style={{ width: '100%', marginTop: '15px' }}>
                      Pagar ahora
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p>No hay productos seleccionados.</p>
                  <Link to="/marketplace" style={{ color: '#A5D6A7', fontSize: '14px' }}>Ir al Marketplace</Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MisPedidos;