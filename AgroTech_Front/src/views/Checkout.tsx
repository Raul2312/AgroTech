import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/clientDashboard.css"; 
import logo from "../assets/img/agro.png";

const Checkout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const subtotal = savedCart.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const envio = subtotal > 0 ? 150 : 0;
    setTotal(subtotal + envio);
  }, []);

  const logout = () => {
    localStorage.removeItem("agroSession");
    sessionStorage.removeItem("agroSession");
    navigate("/login");
  };

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
          <li><Link to="/mis-pedidos">📦 {!collapsed && "Mis pedidos"}</Link></li>
          <li><Link to="/favoritos">⭐ {!collapsed && "Favoritos"}</Link></li>
          <li><Link to="/marketplace">🛒 {!collapsed && "Marketplace"}</Link></li>
          <li><Link to="/perfil">👤 {!collapsed && "Mi perfil"}</Link></li>
          <li className="logout">
            <button onClick={logout}>❌ {!collapsed && "Cerrar sesión"}</button>
          </li>
        </ul>
      </aside>

      <div className={`main ${collapsed ? "expanded" : ""}`} style={{ paddingTop: '40px' }}>
        <section className="checkout-content" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ color: '#fff', marginBottom: '25px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            💳 Payment Method
          </h2>
          
          <div style={{ background: '#112229', borderRadius: '12px', padding: '30px', border: '1px solid #22343c' }}>
            {/* Tabs de Pago */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
              <button style={tabActiveStyle}>💳 Card</button>
              <button style={tabInactiveStyle}>🅿️ PayPal</button>
            </div>

            {/* Tarjeta Visual */}
            <div style={visualCardStyle}>
              <div style={{ fontSize: '22px', letterSpacing: '3px', marginBottom: '40px' }}>•••• •••• •••• ••••</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', opacity: 0.8 }}>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase' }}>Cardholder Name</div>
                  <div style={{ fontSize: '14px' }}>YOUR NAME</div>
                </div>
                <div>
                  <div style={{ fontSize: '10px', textTransform: 'uppercase' }}>Expires</div>
                  <div style={{ fontSize: '14px' }}>MM/YY</div>
                </div>
              </div>
            </div>

            {/* Formulario */}
            <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Cardholder Name</label>
                <input type="text" placeholder="John Doe" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Card Number</label>
                <input type="text" placeholder="•••• •••• •••• ••••" style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Expiry</label>
                  <input type="text" placeholder="MM/YY" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>CVV</label>
                  <input type="password" placeholder="•••" style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Billing Address</label>
                <input type="text" placeholder="123 Farm Lane" style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input type="text" placeholder="Springfield" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>ZIP Code</label>
                  <input type="text" placeholder="10001" style={inputStyle} />
                </div>
              </div>

              <button type="button" style={checkoutBtnStyle}>
                🔒 Complete Purchase — ${total.toLocaleString()} MXN
              </button>
              
              <p style={{ color: '#556b73', fontSize: '12px', textAlign: 'center', marginTop: '10px' }}>
                By completing this purchase you agree to our Terms & Conditions
              </p>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

// --- ESTILOS EN LÍNEA PARA MANTENER EL DISEÑO EXACTO ---

const labelStyle: React.CSSProperties = {
  display: 'block',
  color: '#8ba2ad',
  fontSize: '13px',
  marginBottom: '8px'
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  background: '#0d1a1f',
  border: '1px solid #22343c',
  borderRadius: '8px',
  color: 'white',
  outline: 'none'
};

const visualCardStyle: React.CSSProperties = {
  background: 'linear-gradient(135deg, #0f3443 0%, #1a2a33 100%)',
  borderRadius: '12px',
  padding: '25px',
  color: 'white',
  marginBottom: '30px',
  border: '1px solid rgba(255,255,255,0.05)',
  boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
};

const tabActiveStyle: React.CSSProperties = {
  background: '#1a2a33',
  border: '1px solid #2e7d32',
  color: 'white',
  padding: '8px 20px',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const tabInactiveStyle: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid #22343c',
  color: '#8ba2ad',
  padding: '8px 20px',
  borderRadius: '8px',
  cursor: 'pointer'
};

const checkoutBtnStyle: React.CSSProperties = {
  background: '#2e7d32',
  color: 'white',
  padding: '16px',
  borderRadius: '8px',
  border: 'none',
  fontSize: '16px',
  fontWeight: 'bold',
  cursor: 'pointer',
  marginTop: '15px',
  transition: 'background 0.3s'
};

export default Checkout;