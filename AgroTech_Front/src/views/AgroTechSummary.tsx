import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ShieldCheck, ShoppingBag, ArrowLeft} from 'lucide-react';
import '../css/AgroTechSummary.css';

// Definimos el tipo basado en tu Marketplace
type CartItem = {
  id_productos:number,
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const AgroTechSummary: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [method, setMethod] = useState<'paypal' | 'card'>('paypal');

  // URL base para las imágenes y para la redirección de pago
  const apiUrl = import.meta.env.VITE_API;

  const getImageUrl = (img: string) => {
    if (!img) return "https://via.placeholder.com/150?text=Sin+Imagen";
    if (img.startsWith("http")) return img;
    return apiUrl.replace("api/", "") + `products/${img}`;
  };

  useEffect(() => {
    // Recuperamos el carrito real del localStorage
    const savedCart = localStorage.getItem("agroCart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // --- CÁLCULOS ---
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 300 || subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping;

  // --- LÓGICA DE PAGO INTEGRADA ---
  const handlePayment = () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío.");
      return;
    }

    if (method === 'paypal') {
      // 🔥 CAMBIO: Ahora navegamos a la ruta interna de PayPalPayment pasándole el total
      navigate(`/checkout/${total.toFixed(2)}`);
    } else {
      // Placeholder para otros métodos
      alert("El pago directo con tarjeta estará disponible pronto. Por favor usa PayPal.");
    }
  };

  return (
    <div className="at-fullscreen-container">
      {/* HEADER VERDE CON FLECHA */}
      <header className="at-main-header">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button className="at-back-btn" onClick={() => navigate("/marketplace")}>
            <ArrowLeft size={22} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={24} />
            <h1>AgroTech Marketplace</h1>
          </div>
        </div>
        <div className="at-header-badge">RESUMEN DE PEDIDO</div>
      </header>

      <main className="at-workspace">
        {/* SECCIÓN IZQUIERDA: LISTA DINÁMICA DE PRODUCTOS */}
        <section className="at-products-section">
          <div className="at-section-head">
            <h2 style={{ fontSize: '32px', fontWeight: 800, letterSpacing: '-1px' }}>Tu Pedido</h2>
            <span style={{ color: '#64748b', fontWeight: 600 }}>
              {cart.length} {cart.length === 1 ? 'producto' : 'productos'}
            </span>
          </div>

          <div className="at-products-grid">
            {cart.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', gridColumn: '1/-1' }}>
                <p style={{ color: '#64748b' }}>No hay productos en el carrito.</p>
                <button 
                  onClick={() => navigate("/marketplace")}
                  style={{ color: '#059669', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Volver a la tienda
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div key={index} className="at-web-card">
                  <div className="at-img-box">
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '15px' }} 
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4 style={{ margin: 0, fontSize: '18px', fontWeight: 700 }}>{item.name}</h4>
                      <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>x{item.quantity}</span>
                    </div>
                    <p style={{ color: '#64748b', fontSize: '14px', margin: '4px 0 12px 0' }}>
                      Precio unitario: ${item.price.toFixed(2)}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#059669', fontWeight: 800, fontSize: '20px' }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* SECCIÓN DERECHA: TOTALES Y PAGO */}
        <aside className="at-payment-sidebar">
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '30px' }}>Finalizar Pago</h2>
          
          <div className="at-summary-box">
            <div className="at-line">
              <span>Subtotal (sin IVA)</span>
              <b>${subtotal.toFixed(2)}</b>
            </div>
            <div className="at-line">
              <span>Costo de envío</span>
              <b style={{ color: shipping === 0 ? '#059669' : 'inherit' }}>
                {shipping === 0 ? 'Gratis' : `$${shipping.toFixed(2)}`}
              </b>
            </div>
            
            <div className="at-total-big">
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: '#64748b', fontSize: '14px', fontWeight: 600 }}>Total Final</span>
                <span className="at-total-price">${total.toFixed(2)}</span>
                <small style={{ color: '#94a3b8', fontSize: '11px' }}>MXN (IVA Incluido)</small>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>
            Selecciona Método de Pago
          </p>
          
          <div className="at-pay-grid">
            <label onClick={() => setMethod('paypal')} style={{ cursor: 'pointer' }}>
              <input type="radio" name="p" style={{ display: 'none' }} checked={method === 'paypal'} readOnly />
              <div className={`at-pay-item ${method === 'paypal' ? 'at-active-method' : ''}`}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>💳</div>
                <div style={{ fontWeight: 800, fontSize: '14px' }}>PayPal</div>
              </div>
            </label>
            
            <label onClick={() => setMethod('card')} style={{ cursor: 'pointer' }}>
              <input type="radio" name="p" style={{ display: 'none' }} checked={method === 'card'} readOnly />
              <div className={`at-pay-item ${method === 'card' ? 'at-active-method' : ''}`}>
                <div style={{ fontSize: '28px', marginBottom: '8px' }}>💰</div>
                <div style={{ fontWeight: 800, fontSize: '14px' }}>Tarjeta</div>
              </div>
            </label>
          </div>

          <button 
            className="at-main-btn" 
            onClick={handlePayment}
            disabled={cart.length === 0}
          >
            {method === 'paypal' ? 'Pagar con PayPal' : 'Pagar con Tarjeta'} <Lock size={20} />
          </button>

          <div className="at-security-tag">
            <ShieldCheck size={28} color="#059669" style={{ flexShrink: 0 }} />
            <p style={{ margin: 0 }}>
              <strong>Transacción Encriptada.</strong> Tus datos bancarios están protegidos por AgroTech Security.
            </p>
          </div>
        </aside>
      </main>
    </div>
  );
};

export default AgroTechSummary;