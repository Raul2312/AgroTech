import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/clientDashboard.css";
import logo from "../assets/img/agro.png";

// Interface adaptada a tu migración de Laravel
interface Pedido {
  id_compra: number;
  id_transaccion: string | number;
  id_producto: number;
  total: string | number;
  created_at?: string;
  producto?: {
    nombre?: string;
  };
  estado?: string;
}

// Interface para el carrito (LocalStorage - Sincronizado con Marketplace)
interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const apiUrl = import.meta.env.VITE_API;

const MisPedidos = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<any>(null);

  // Función para obtener la URL de la imagen
  const getImageUrl = (img: string) => {
    if (!img) return "https://via.placeholder.com/150?text=Sin+Imagen";
    if (img.startsWith("http")) return img;
    return apiUrl.replace("api/", "") + `products/${img}`;
  };

  useEffect(() => {
    // 1. Extraer la sesión del usuario para obtener el ID y el Token
    const sessionStr = localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession");
    let currentUserId = null;
    let token = "";

    if (sessionStr) {
      try {
        const userData = JSON.parse(sessionStr);
        currentUserId = userData?.user?.id_usuario || userData?.user?.id || userData?.id_usuario;
        token = userData?.token || "";
        setUserId(currentUserId);
      } catch (error) {
        console.error("Error leyendo sesión:", error);
      }
    }

    const fetchHistorial = async () => {
      if (!currentUserId) return; // Si no hay usuario, cancelamos la petición

      try {
        // 2. Mandamos la petición con el token de autorización y el ID del usuario
        const config = {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        };
        
        const res = await axios.get(`${apiUrl}compras?id_usuario=${currentUserId}`, config);
        setPedidos(res.data);
      } catch (err) {
        console.error("Error cargando historial desde la BD:", err);
      }
    };

    // Leer el carrito del localStorage
    const savedCart = JSON.parse(localStorage.getItem("agroCart") || "[]");
    setCartItems(savedCart);
    
    fetchHistorial();
  }, []);

  const logout = () => {
    localStorage.removeItem("agroSession");
    sessionStorage.removeItem("agroSession");
    navigate("/login");
  };

  // Función para eliminar un producto del carrito
  const removeItem = (name: string) => {
    const updatedCart = cartItems.filter(item => item.name !== name);
    setCartItems(updatedCart);
    // Guardar con la misma clave para que el Marketplace se entere
    localStorage.setItem("agroCart", JSON.stringify(updatedCart));
  };

  // Cálculos dinámicos basados en el carrito
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const envio = subtotal > 300 ? 0 : subtotal === 0 ? 0 : 150;
  const total = subtotal + envio;

  return (
    <div className="client-dashboard">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img src={logo} className="logo-img" alt="Logo" />
          {!collapsed && <span className="logo-text">AgroTech</span>}
        </div>
        <ul className="menu">
          <li><Link to="/indexscreen">🏠 {!collapsed && "Inicio"}</Link></li>
          <li><Link to="/areacliente">🏠 {!collapsed && "Dashboard"}</Link></li>
          <li className="active"><Link to="/mis-pedidos">📦 {!collapsed && "Mis pedidos"}</Link></li>
          <li><Link to="/mis-productos">📦 {!collapsed && "Publicar Productos"}</Link></li>
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
            <span>Pedidos Históricos</span>
            <h3>{pedidos.length}</h3>
          </div>
          <div className="stat-card">
            <span>Items en Carrito</span>
            <h3>{cartItems.length}</h3>
          </div>
          <div className="stat-card">
            <span>Subtotal</span>
            <h3>${subtotal.toLocaleString()}</h3>
          </div>
          <div className="stat-card">
            <span>Total a Pagar</span>
            <h3>${total.toLocaleString()}</h3>
          </div>
        </section>

        <section className="grid">
          {/* TABLA DE HISTORIAL TOTALMENTE CONECTADA A LA BD */}
          <div className="orders">
            <h3>Historial de Compras</h3>
            <table>
              <thead>
                <tr>
                  <th>ID Transacción</th>
                  <th>Producto</th>
                  <th>Monto</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.length > 0 ? pedidos.map((p) => (
                  <tr key={p.id_compra}>
                    <td style={{ fontFamily: 'monospace', fontSize: '12px', color: '#A5D6A7' }}>
                      {p.id_transaccion}
                    </td>
                    <td>{p.producto?.nombre || `Producto ID: ${p.id_producto}`}</td>
                    <td>${p.total} MXN</td>
                    <td>
                      <span className="badge delivered">
                        {p.estado || "Completado"}
                      </span>
                    </td>
                    <td>{p.created_at ? p.created_at.substring(0, 10) : "—"}</td>
                  </tr>
                )) : (
                  <tr><td colSpan={5} style={{textAlign: 'center', padding: '20px', color: '#888'}}>No tienes pedidos anteriores en tu cuenta.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* SECCIÓN DEL CARRITO PROVENIENTE DEL MARKETPLACE */}
          <div className="recommendations">
            <h3>Carrito Actual (Marketplace)</h3>
            <div className="cart-list">
              {cartItems.length > 0 ? (
                <>
                  {cartItems.map((item, index) => (
                    <div key={index} className="product">
                      <img src={getImageUrl(item.image)} alt={item.name} />
                      <div style={{ flex: 1 }}>
                        <h4>{item.name}</h4>
                        <p>${item.price.toFixed(2)} x {item.quantity}</p>
                        <button 
                          onClick={() => removeItem(item.name)}
                          style={{ background: '#e53935', padding: '4px 8px', fontSize: '11px', marginTop: '5px', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="checkout-summary" style={{ marginTop: '20px', borderTop: '1px solid #22343c', paddingTop: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '5px' }}>
                      <span>Envío:</span>
                      <span>{envio === 0 ? "GRATIS" : `$${envio}.00`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', color: '#A5D6A7' }}>
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                    <button 
                      className="checkout-btn" 
                      onClick={() => navigate("/resumen-compra")}
                      style={{ width: '100%', marginTop: '15px', padding: '10px', background: '#2e7d32', color: 'white', borderRadius: '8px', cursor: 'pointer', border: 'none' }}
                    >
                      Finalizar y Pagar
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                  <p style={{color: '#888'}}>Tu carrito está vacío.</p>
                  <Link to="/marketplace" style={{ color: '#A5D6A7', textDecoration: 'none', fontSize: '14px' }}>Ver productos</Link>
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