import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // Nota: Asegúrate de que use 'axios' si es la librería HTTP standard, en tu prompt importaba axios.
import axiosOriginal from "axios"; 
import "../css/clientDashboard.css";
import logo from "../assets/img/agro.png";
import { FaWarehouse, FaShoppingCart, FaHistory, FaLeaf, FaUser, FaMapMarkerAlt } from "react-icons/fa";

const axiosInstance = axiosOriginal; // Usamos el axios estándar de HTTP
const API_URL = import.meta.env.VITE_API;

// Interfaces estructuradas
interface Pedido {
  id_pedido: number | string;
  producto_nombre: string;
  estado: "Enviado" | "Procesando" | "Entregado" | "Completado";
  fecha: string;
  monto?: string | number;
}

interface CartItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Rancho {
  id_rancho: number;
  nombre: string;
  ubicacion: string;
  superficie_hectarias: number;
  tipo_rancho: string;
  estatus: string;
}

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [ranchos, setRanchos] = useState<Rancho[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Datos de sesión compartidos
  const sessionStr = localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession");
  const sessionData = sessionStr ? JSON.parse(sessionStr) : null;
  const userData = sessionData?.user || sessionData?.usuario;

  // URL de imágenes dinámica idéntica al Marketplace
  const getImageUrl = (img: string) => {
    if (!img) return "https://via.placeholder.com/150?text=Sin+Imagen";
    if (img.startsWith("http")) return img;
    return API_URL.replace("api/", "") + `products/${img}`;
  };

  // Sincronización del carrito local
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
        // 🔥 CORRECCIÓN: Se envía el id_usuario en la URL tal como en Trazabilidad
        const resRanchos = await axiosInstance.get(`${API_URL}rancho?id_usuario=${userData?.id_usuario}`);
        setRanchos(resRanchos.data);

        // 2. Cargar Historial de pedidos/compras
        const resPedidos = await axiosInstance.get(`${API_URL}mis-pedidos`);
        const apiPedidos = resPedidos.data;

        // Recuperar pedidos completados localmente en caché (PayPal, etc.) para asegurar inmediatez
        const pedidosLocales = JSON.parse(localStorage.getItem("agroPedidosRecientes") || "[]");
        const filtradosLocales = pedidosLocales.filter((lp: Pedido) => 
          !apiPedidos.some((ap: Pedido) => String(ap.id_pedido) === String(lp.id_pedido))
        );

        setPedidos([...filtradosLocales, ...apiPedidos]);
      } catch (error) {
        console.error("Error al cargar datos del dashboard:", error);
        // Respaldo local por si la API falla temporalmente
        const pedidosLocales = JSON.parse(localStorage.getItem("agroPedidosRecientes") || "[]");
        if (pedidosLocales.length > 0) setPedidos(pedidosLocales);
      }
    };

    fetchData();
    syncCart();

    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  // Cálculos financieros globales
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const envio = subtotal > 300 || subtotal === 0 ? 0 : 150;
  const total = subtotal + envio;

  return (
    <div className="client-dashboard">
      {/* SIDEBAR DE NAVEGACIÓN */}
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img src={logo} className="logo-img" alt="logo" />
          {!collapsed && <span className="logo-text">AgroTech</span>}
        </div>
        <ul className="menu">
          <li><Link to="/indexscreen">🏠 {!collapsed && "Inicio"}</Link></li>
          <li className="active"><Link to="/areacliente">🏠 {!collapsed && "Dashboard"}</Link></li>
          <li><Link to="/mis-pedidos">📦 {!collapsed && "Mis pedidos"}</Link></li>
          <li><Link to="/mis-productos">📦 {!collapsed && "Publicar Productos"}</Link></li>
          <li><Link to="/marketplace">🛒 {!collapsed && "Marketplace"}</Link></li>
          <li><Link to="/perfil">👤 {!collapsed && "Mi perfil"}</Link></li>
          <li><Link to="/rancho">🌱 {!collapsed && "Rancho"}</Link></li>
          <li><Link to="/trazabilidad">📍 {!collapsed && "Trazabilidad"}</Link></li>
          <li className="logout">
            <button onClick={() => { localStorage.clear(); sessionStorage.clear(); navigate("/login"); }}>
              ❌ {!collapsed && "Cerrar sesión"}
            </button>
          </li>
        </ul>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className={`main ${collapsed ? "expanded" : ""}`}>
        <header className="header">
          <div className="user-info">
            <button className="menu-btn" onClick={() => setCollapsed(!collapsed)}>☰</button>
            <h2 style={{ marginLeft: "15px" }}>Resumen de Actividad</h2>
          </div>
          <div className="user-info" onClick={() => navigate("/perfil")} style={{ cursor: "pointer" }}>
            <span>{userData?.nombre} {userData?.apellido}</span>
            <img src={logo} alt="user" />
          </div>
        </header>

        {/* TARJETAS ESTADÍSTICAS SUPERIORES */}
        <section className="stats">
          <div className="stat-card" onClick={() => navigate("/rancho")} style={{ cursor: "pointer" }}>
            <FaWarehouse style={{ color: "#A5D6A7" }} />
            <p>Ranchos</p>
            <h3>{ranchos.length}</h3>
          </div>
          <div className="stat-card" onClick={() => navigate("/mis-pedidos")} style={{ cursor: "pointer" }}>
            <FaHistory style={{ color: "#A5D6A7" }} />
            <p>Pedidos</p>
            <h3>{pedidos.length}</h3>
          </div>
          <div className="stat-card" onClick={() => navigate("/marketplace")} style={{ cursor: "pointer" }}>
            <FaShoppingCart style={{ color: "#A5D6A7" }} />
            <p>En Carrito</p>
            <h3>{cartItems.length}</h3>
          </div>
          <div className="stat-card" onClick={() => navigate("/mis-pedidos")} style={{ cursor: "pointer" }}>
            <FaLeaf style={{ color: "#A5D6A7" }} />
            <p>Total a Pagar</p>
            <h3>${total.toLocaleString()}</h3>
          </div>
        </section>

        {/* MALLA DE COMPONENTES INTERACTIVOS */}
        <div className="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px', marginTop: '20px' }}>
          
          {/* 1. TARJETA DE PERFIL */}
          <section className="orders" onClick={() => navigate("/perfil")} style={{ cursor: 'pointer', transition: 'transform 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3>👤 Mi Perfil</h3>
              <span style={{ fontSize: '12px', color: '#A5D6A7' }}>Editar →</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px 0' }}>
              <img src={logo} alt="avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#22343c', padding: '5px' }} />
              <div>
                <h4 style={{ margin: 0, fontSize: '18px' }}>{userData?.nombre || "Usuario"} {userData?.apellido || ""}</h4>
                <p style={{ margin: '4px 0', color: '#888', fontSize: '13px' }}>{userData?.email || "Sin correo registrado"}</p>
                <p style={{ margin: 0, color: '#888', fontSize: '13px' }}>📞 {userData?.telefono || "Teléfono no registrado"}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', borderTop: '1px solid #22343c', paddingTop: '10px' }}>
              <div style={{ flex: 1, background: '#22343c', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>Estado</span>
                <h5 style={{ margin: '2px 0', color: '#A5D6A7' }}>{userData?.estado_cuenta || "Activo"}</h5>
              </div>
              <div style={{ flex: 1, background: '#22343c', padding: '8px', borderRadius: '6px', textAlign: 'center' }}>
                <span style={{ fontSize: '11px', color: '#aaa' }}>Reputación</span>
                <h5 style={{ margin: '2px 0', color: '#ffb74d' }}>{userData?.reputacion || "Normal"}</h5>
              </div>
            </div>
          </section>

          {/* 2. COMPONENTE DE RANCHOS EN TARJETAS */}
          <section className="orders" onClick={() => navigate("/rancho")} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
              <h3>🌱 Mis Ranchos Registrados</h3>
              <span style={{ fontSize: '12px', color: '#A5D6A7' }}>Administrar →</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '230px', overflowY: 'auto', paddingRight: '5px' }}>
              {ranchos.slice(0, 3).map((r) => (
                <div key={r.id_rancho} style={{ background: '#22343c', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '14px', color: '#fff' }}>{r.nombre}</h4>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#94a3b8' }}><FaMapMarkerAlt size={10} /> {r.ubicacion}</p>
                  </div>
                  <span style={{ fontSize: '11px', background: r.estatus?.toLowerCase() === 'activo' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)', color: r.estatus?.toLowerCase() === 'activo' ? '#A5D6A7' : '#ef5350', padding: '3px 8px', borderRadius: '12px' }}>
                    {r.tipo_rancho}
                  </span>
                </div>
              ))}
              {ranchos.length === 0 && (
                <p style={{ color: '#666', textAlign: 'center', padding: '20px 0' }}>No tienes ranchos registrados aún.</p>
              )}
            </div>
          </section>

          {/* 3. HISTORIAL DE ÚLTIMOS PEDIDOS Y COMPRAS */}
          <section className="orders" onClick={() => navigate("/mis-pedidos")} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h3>📦 Últimas Compras y Pedidos</h3>
              <span style={{ fontSize: '12px', color: '#A5D6A7' }}>Ver todo →</span>
            </div>
            <table style={{ pointerEvents: 'none' }}>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Monto</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.slice(0, 4).map((p, i) => (
                  <tr key={i}>
                    <td>{p.producto_nombre}</td>
                    <td>{p.monto ? `$${p.monto}` : "—"}</td>
                    <td>
                      <span className={`badge ${p.estado === "Enviado" ? "shipped" : p.estado === "Procesando" ? "pending" : "delivered"}`}>
                        {p.estado}
                      </span>
                    </td>
                  </tr>
                ))}
                {pedidos.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', color: '#666', padding: '15px' }}>No hay compras previas.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>

          {/* 4. SECCIÓN INTERACTIVA DE CARRITO ACTUAL */}
          <section className="recommendations" style={{ transition: 'transform 0.2s' }}>
            <div onClick={() => navigate("/marketplace")} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px', cursor: 'pointer' }}>
              <h3>🛒 Carrito Actual</h3>
              <span style={{ fontSize: '12px', color: '#A5D6A7' }}>Ir a Tienda →</span>
            </div>
            {cartItems.length > 0 ? (
              <div className="cart-preview">
                <div style={{ maxHeight: '140px', overflowY: 'auto', marginBottom: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {cartItems.map((item, index) => (
                    <div className="product" key={index} style={{ marginBottom: 0, padding: '5px', background: '#22343c', borderRadius: '6px' }}>
                      <img src={getImageUrl(item.image)} alt={item.name} style={{ width: '40px', height: '40px' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '13px' }}>{item.name}</h4>
                        <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>${item.price} x {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop: '1px solid #22343c', paddingTop: '10px', marginTop: '5px' }}>
                  <p style={{ display: 'flex', justifyContent: 'space-between', margin: '0 0 10px 0', fontSize: '14px' }}>
                    <span>Total estimado:</span> <strong>${total.toFixed(2)}</strong>
                  </p>
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      navigate("/resumen-compra"); 
                    }} 
                    style={{ width: '100%', background: '#2e7d32', color: 'white', border: 'none', padding: '10px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    🚀 Finalizar Compra
                  </button>
                </div>
              </div>
            ) : (
              <div onClick={() => navigate("/marketplace")} style={{ textAlign: 'center', padding: '30px 0', cursor: 'pointer' }}>
                <p style={{ color: '#666', margin: '0 0 10px 0' }}>El carrito está vacío</p>
                <span style={{ color: '#A5D6A7', fontSize: '13px' }}>Explorar Marketplace</span>
              </div>
            )}
          </section>

        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;