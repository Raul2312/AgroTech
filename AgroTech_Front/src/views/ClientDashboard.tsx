import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/clientDashboard.css";
import logo from "../assets/img/agro.png";
import { FaWarehouse, FaShoppingCart, FaHistory, FaLeaf } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API;

// Interfaces alineadas con Marketplace
interface Pedido {
  id_pedido: number;
  producto_nombre: string;
  estado: "Enviado" | "Procesando" | "Entregado";
  fecha: string;
}

interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [ranchosCount, setRanchosCount] = useState(0);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Datos de sesión
  const sessionStr = localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession");
  const sessionData = sessionStr ? JSON.parse(sessionStr) : null;
  const userData = sessionData?.user || sessionData?.usuario;

  // URL de imágenes idéntica a Marketplace
  const getImageUrl = (img: string) => {
    if (!img) return "https://via.placeholder.com/150?text=Sin+Imagen";
    if (img.startsWith("http")) return img;
    return API_URL.replace("api/", "") + `products/${img}`;
  };

  // Función para sincronizar carrito
  const syncCart = () => {
    const savedCart = localStorage.getItem("agroCart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      setCartItems([]);
    }
  };

  useEffect(() => {
    if (!userData) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        // Cargar Ranchos
        const resRanchos = await axios.get(`${API_URL}rancho`);
        const misRanchos = resRanchos.data.filter((r: any) => r.id_usuario === userData.id_usuario);
        setRanchosCount(misRanchos.length);

        // Cargar Historial
        const resPedidos = await axios.get(`${API_URL}mis-pedidos`);
        setPedidos(resPedidos.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
    syncCart();

    // ESCUCHADOR CRÍTICO: Detecta cambios en otras pestañas o componentes
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  // Cálculos financieros dinámicos
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const envio = subtotal > 300 || subtotal === 0 ? 0 : 150;
  const total = subtotal + envio;

  return (
    <div className="client-dashboard">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img src={logo} className="logo-img" alt="logo" />
          {!collapsed && <span className="logo-text">AgroTech</span>}
        </div>
        <ul className="menu">
         <li className="active"><Link to="/areacliente">🏠 {!collapsed && "Dashboard"}</Link></li>
          <li><Link to="/indexscreen">🏠 {!collapsed && "Inicio"}</Link></li>
          
          <li><Link to="/mis-pedidos">📦 {!collapsed && "Mis pedidos"}</Link></li>
          <li><Link to="/marketplace">🛒 {!collapsed && "Marketplace"}</Link></li>
          <li><Link to="/perfil">👤 {!collapsed && "Mi perfil"}</Link></li>
          <li><Link to="/rancho">👤 {!collapsed && "Rancho"}</Link></li>
          <li><Link to="/trazabilidad">👤 {!collapsed && "Trazabilidad"}</Link></li>
          <li className="logout">
            <button onClick={() => { localStorage.clear(); sessionStorage.clear(); navigate("/login"); }}>
              ❌ {!collapsed && "Cerrar sesión"}
            </button>
          </li>
        </ul>
      </aside>

      <main className={`main ${collapsed ? "expanded" : ""}`}>
        <header className="header">
          <div className="user-info">
            <button className="menu-btn" onClick={() => setCollapsed(!collapsed)}>☰</button>
            <h2 style={{ marginLeft: "15px" }}>Resumen de Actividad</h2>
          </div>
          <div className="user-info">
            <span>{userData?.nombre}</span>
            <img src={logo} alt="user" />
          </div>
        </header>

        <section className="stats">
          <div className="stat-card">
            <FaWarehouse style={{ color: "#A5D6A7" }} />
            <p>Ranchos</p>
            <h3>{ranchosCount}</h3>
          </div>
          <div className="stat-card">
            <FaHistory style={{ color: "#A5D6A7" }} />
            <p>Pedidos</p>
            <h3>{pedidos.length}</h3>
          </div>
          <div className="stat-card">
            <FaShoppingCart style={{ color: "#A5D6A7" }} />
            <p>En Carrito</p>
            <h3>{cartItems.length}</h3>
          </div>
          <div className="stat-card">
            <FaLeaf style={{ color: "#A5D6A7" }} />
            <p>Total a Pagar</p>
            <h3>${total.toLocaleString()}</h3>
          </div>
        </section>

        <div className="grid">
          <section className="orders">
            <h3>Últimos Pedidos</h3>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.slice(0, 5).map((p, i) => (
                  <tr key={i}>
                    <td>{p.producto_nombre}</td>
                    <td>
                      <span className={`badge ${p.estado === "Enviado" ? "shipped" : p.estado === "Procesando" ? "pending" : "delivered"}`}>
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="recommendations">
            <h3>🛒 Carrito Actual</h3>
            {cartItems.length > 0 ? (
              <div className="cart-preview">
                {cartItems.map((item, index) => (
                  <div className="product" key={index} style={{ marginBottom: "10px" }}>
                    <img src={getImageUrl(item.image)} alt={item.name} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '14px' }}>{item.name}</h4>
                      <p style={{ margin: 0, fontSize: '12px' }}>${item.price} x {item.quantity}</p>
                    </div>
                  </div>
                ))}
                <div style={{ borderTop: '1px solid #333', paddingTop: '10px', marginTop: '10px' }}>
                  <p style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Total:</span> <strong>${total.toFixed(2)}</strong>
                  </p>
                  <button onClick={() => navigate("/resumen-compra")} style={{ width: '100%' }}>Finalizar Compra</button>
                </div>
              </div>
            ) : (
              <p>El carrito está vacío</p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;