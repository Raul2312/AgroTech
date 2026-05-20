import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/marketplace.css";
import logo from "../assets/img/agro.png";
import DailySpin from "../components/DailySpin";

import {
  FaShoppingCart,
  FaSearch,
  FaUserCircle,
  FaTruck,
  FaShieldAlt,
  FaStar,
  FaFire,
  FaBars,
  FaTimes,
  FaTag,
  FaLeaf,
  FaTrashAlt,
  FaArrowRight,
  FaCrown,
  FaCheckCircle,
  FaPercent,
  FaArrowLeft,
  FaTags,
  FaIdCard,
  FaCalendarAlt
} from "react-icons/fa";

type CartItem = {
  id_productos: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type Producto = {
  id_productos: number;
  nombre: string;
  descripcion: string;
  precio: string;
  moneda: string;
  stock: number;
  imagen: string;
  id_usuario: number;
  id_categoria: number;
  fecha_publicacion: string;
  estado: string;
};

type Categoria = {
  id: number;
  nombre: string;
  descripcion: string;
  estado: string;
};

const apiUrl = import.meta.env.VITE_API;

const getImageUrl = (img: string) => {
  if (!img) return "https://via.placeholder.com/250?text=Sin+Imagen";
  if (img.startsWith("http")) return img;
  return apiUrl.replace("api/", "") + `products/${img}`;
};

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("agroCart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [discount, setDiscount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Control de la vista dedicada de detalles
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [detailQuantity, setDetailQuantity] = useState(1);

  const adminEmails = [
    "22cg0095@itsncg.edu.mx",
    "sebastiannn231@gmail.com",
    "raulmadridflores202@gmail.com"
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem("agroCart", JSON.stringify(cart));
  }, [cart]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(apiUrl + "productos");
      setProducts(res.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(apiUrl + "categorias");
      setCategories(res.data);
    } catch (error) {
      console.error("Error cargando categorias:", error);
    }
  };

  const checkSession = () => {
    const session = localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession");
    return session ? true : false;
  };

  const goPanel = () => {
    const sessionStr = localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession");
    if (!sessionStr) {
      navigate("/login");
      return;
    }
    try {
      const sessionData = JSON.parse(sessionStr);
      const userEmail = sessionData.user?.email;
      if (userEmail && adminEmails.includes(userEmail)) {
        navigate("/dashboard");
      } else {
        navigate("/areacliente");
      }
    } catch (error) {
      console.error("Error al redirigir:", error);
      navigate("/login");
    }
  };

  const toggleCart = () => setIsOpen(!isOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);
  useEffect(() => {
  if (isOpen) {
    document.body.classList.add("cart-open");
  } else {
    document.body.classList.remove("cart-open");
  }
  
  // Limpieza al desmontar
  return () => document.body.classList.remove("cart-open");
}, [isOpen]);

  const addToCart = (
    id_productos: number,
    name: string,
    price: string | number,
    image: string,
    quantity: number = 1
  ) => {
    if (!checkSession()) {
      navigate("/login");
      return;
    }
    const priceNumber = Number(price);
    setCart((prev) => {
      const existing = prev.find((item) => item.name === name);
      if (existing) {
        return prev.map((item) =>
          item.name === name ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { id_productos, name, price: priceNumber, image, quantity }];
    });
    setIsOpen(true);
  };

  const changeQty = (index: number, change: number) => {
    setCart((prev) =>
      prev
        .map((item, i) =>
          i === index ? { ...item, quantity: Math.max(item.quantity + change, 0) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (index: number) => {
    setCart((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const applyCoupon = () => {
    if (couponInput === "AGRO10") {
      setDiscount(200);
    } else {
      setDiscount(0);
      alert("Cupón inválido");
    }
  };

  const filterByCategory = (id: number | null) => {
    setSelectedCategory(id);
  };

  const openDetails = (product: Producto) => {
    setSelectedProduct(product);
    setDetailQuantity(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const closeDetails = () => {
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === null || product.id_categoria === selectedCategory)
  );

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 300 ? 0 : subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping - discount;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="marketplace-page animated-reveal">
      <div className="ambient-glow glow-1"></div>
      <div className="ambient-glow glow-2"></div>

      {/* HEADER GLOBAL */}
      <header className="marketplace-header glassmorphism">
        <div className="header-left">
          <div className="logo-section">
            <div className="logo-glow-wrapper">
              <img src={logo} alt="AgroTech Logo" className="pulse-logo" />
            </div>
            <div>
              <h1 className="typing-title">AgroTech <span className="gradient-text">Premium</span></h1>
              <span className="subtitle-tag">Sistemas Avanzados para el Campo</span>
            </div>
          </div>
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <nav className={`main-nav-premium ${menuOpen ? "active" : ""}`}>
          <a href="/indexScreen" className="nav-link-modern"><span>Inicio</span></a>
          <a href="/trazabilidad" className="nav-link-modern"><span>Trazabilidad</span></a>
          <a onClick={goPanel} className="nav-link-modern highlight"><span>Panel de Control</span></a>
          {!(localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession")) && (
            <a href="/Login" className="nav-link-modern login-btn-nav">Ingresar</a>
          )}
        </nav>

        <div className="header-actions">
          <button className="premium-profile-btn" onClick={goPanel}>
            <FaUserCircle className="icon" />
            <span>Mi Cuenta</span>
          </button>

          <div className="premium-cart-trigger" onClick={toggleCart}>
            <div className="icon-badge-container">
              <FaShoppingCart className="cart-icon-svg" />
              {cartCount > 0 && <span className="premium-badge pulse-badge">{cartCount}</span>}
            </div>
          </div>
        </div>
      </header>

      {/* RENDERIZADO CONDICIONAL DE VISTAS */}
      {selectedProduct ? (
        /* VISTA 1: DETALLES DEDICADOS DEL PRODUCTO (PÁGINA COMPLETA) */
        <div className="product-view-dedicated animated-reveal">
          <button className="premium-back-btn" onClick={closeDetails}>
            <FaArrowLeft /> <span>Volver al Catálogo</span>
          </button>

          <div className="dedicated-layout-grid">
            {/* PANEL IZQUIERDO: VISUALIZACIÓN MÁXIMA DE IMAGEN */}
            <div className="dedicated-visual-showcase">
              <span className="showcase-badge-floating"><FaStar /> Producto Homologado</span>
              <div className="dedicated-image-container">
                <img
                  className="dedicated-image-main"
                  src={getImageUrl(selectedProduct.imagen)}
                  alt={selectedProduct.nombre}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "https://via.placeholder.com/250?text=Sin+Imagen";
                  }}
                />
              </div>
            </div>

            {/* PANEL DERECHO: PANEL DE DATOS TÉCNICOS INTEGRAL */}
            <div className="dedicated-specs-showcase">
              <div className="header-specs-title">
                <span className="brand-label-specs"><FaTags /> AgroTech Premium Line</span>
                <h1>{selectedProduct.nombre}</h1>
                <div className="badge-row-specs" style={{ display: "flex", gap: "15px" }}>
                  <span className="condition-badge"><FaCheckCircle /> {selectedProduct.estado || "Excelente"}</span>
                  <span className={`stock-badge-specs ${selectedProduct.stock > 0 ? "in" : "out"}`}>
                    {selectedProduct.stock > 0 ? `Unidades Disponibles: ${selectedProduct.stock}` : "Agotado Temporalmente"}
                  </span>
                </div>
              </div>

              <div className="dedicated-price-box">
                <span className="price-tag-label">Costo Operativo Especial</span>
                <p className="price-value-specs">
                  ${Number(selectedProduct.precio).toLocaleString('es-MX', { minimumFractionDigits: 2 })} 
                  <span className="currency-type-specs">{selectedProduct.moneda || "MXN"}</span>
                </p>
              </div>

              <div className="technical-scroll-description">
                <h3>Ficha Descriptiva</h3>
                <p className="dedicated-desc-text">
                  {selectedProduct.descripcion || "Este producto cuenta con las certificaciones estándar de AgroTech. No se ha adjuntado descripción complementaria."}
                </p>
              </div>

              <div className="metadata-specs-grid">
                <div className="meta-spec-item">
                  <div className="meta-icon"><FaIdCard /></div>
                  <div className="meta-label">
                    <span>ID Registro</span>
                    <strong>#00{selectedProduct.id_productos}</strong>
                  </div>
                </div>

                <div className="meta-spec-item">
                  <div className="meta-icon"><FaCalendarAlt /></div>
                  <div className="meta-label">
                    <span>Alta en Red</span>
                    <strong>{selectedProduct.fecha_publicacion || "Reciente"}</strong>
                  </div>
                </div>
              </div>

              <div className="interactive-checkout-specs-row">
                <div className="quantity-panel-specs">
                  <span className="quantity-panel-label">Volumen</span>
                  <div className="quantity-stepper-premium">
                    <button type="button" onClick={() => setDetailQuantity((prev) => Math.max(prev - 1, 1))}>−</button>
                    <span className="stepper-value">{detailQuantity}</span>
                    <button type="button" onClick={() => setDetailQuantity((prev) => prev + 1)}>+</button>
                  </div>
                </div>

                <button
                  className="specs-add-to-cart-action-btn"
                  disabled={selectedProduct.stock <= 0}
                  onClick={() => {
                    addToCart(selectedProduct.id_productos, selectedProduct.nombre, selectedProduct.precio, selectedProduct.imagen, detailQuantity);
                  }}
                >
                  <FaShoppingCart />
                  <span>Incorporar a la Orden</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* VISTA 2: HOME Y CATÁLOGO PRINCIPAL */
        <>
          <section className="hero-epic">
            <div className="hero-video-overlay"></div>
            <div className="hero-grid-overlay"></div>

            <div className="hero-content-epic">
              <div className="hero-badge-premium floating-badge">
                <FaCrown className="crown-icon" />
                <span>El Mercado Agropecuario del Futuro</span>
              </div>

              <h1 className="epic-title">
                Potencia Tu Producción <br /> Con Tecnología <span className="gradient-text-alt">Líder</span>
              </h1>

              <p className="epic-subtitle">
                Maquinaria industrial, biotecnología avanzada y herramientas de precisión certificadas con envíos inmediatos y rastreables.
              </p>

              <div className="search-container-epic">
                <div className="search-wrapper-epic">
                  <FaSearch className="search-icon-epic" />
                  <input
                    type="text"
                    className="search-input-epic"
                    placeholder="Buscar insumos, vacunas, tractores, tecnología..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button className="search-button-epic">
                    <span>Buscar Catálogo</span>
                    <FaArrowRight />
                  </button>
                </div>
              </div>

              <div className="hero-live-stats">
                <div className="stat-pill"><FaCheckCircle className="green" /> +15k Ganaderos Activos</div>
                <div className="stat-pill"><FaTruck className="blue" /> Entregas Express Monitoreadas</div>
              </div>
            </div>
          </section>

          <section className="premium-benefits">
            <div className="benefit-card-epic glass-card card-hover-3d">
              <div className="icon-wrapper-epic bg-gradient-green"><FaTruck /></div>
              <div className="benefit-text">
                <h4>Logística Avanzada</h4>
                <p>Envío sin costo en compras desde $300 MXN</p>
              </div>
            </div>

            <div className="benefit-card-epic glass-card card-hover-3d">
              <div className="icon-wrapper-epic bg-gradient-blue"><FaShieldAlt /></div>
              <div className="benefit-text">
                <h4>Transacciones Encriptadas</h4>
                <p>Garantía de protección total al comprador</p>
              </div>
            </div>

            <div className="benefit-card-epic glass-card card-hover-3d">
              <div className="icon-wrapper-epic bg-gradient-gold"><FaFire /></div>
              <div className="benefit-text">
                <h4>Precios Directos de Fábrica</h4>
                <p>Descuentos por volumen y promociones activas</p>
              </div>
            </div>
          </section>

          {(localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession")) && (
            <div className="spin-wrapper-premium">
              <DailySpin />
            </div>
          )}

          <section className="categories-premium-section">
            <div className="premium-section-header">
              <div className="tag-decor">EXPLORA</div>
              <h2>Categorías Especializadas</h2>
            </div>

            <div className="category-scroll-container">
              <div
                className={`category-pill-premium ${selectedCategory === null ? "active-premium" : ""}`}
                onClick={() => filterByCategory(null)}
              >
                <span className="pill-dot"></span>
                🌎 Todas las Soluciones
              </div>

              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`category-pill-premium ${selectedCategory === cat.id ? "active-premium" : ""}`}
                  onClick={() => filterByCategory(cat.id)}
                >
                  <span className="pill-dot"></span>
                  {cat.nombre}
                </div>
              ))}
            </div>
          </section>

          <section className="products-premium-section">
            <div className="premium-section-header">
              <div className="tag-decor">PRODUCTOS</div>
              <h2>Línea de Alta Disponibilidad</h2>
              <p className="count-indicator">{filteredProducts.length} Equipos listos para despacho inmediato</p>
            </div>

            <div className="product-grid-premium">
              {filteredProducts.map((product) => (
                <div
                  key={product.id_productos}
                  className="product-card-premium glass-card"
                  onClick={() => openDetails(product)}
                >
                  <div className="product-img-frame">
                    <div className="badge-ribbon">Premium</div>
                    <img
                      src={getImageUrl(product.imagen)}
                      alt={product.nombre}
                      className="zoom-image"
                    />
                    <div className="img-overlay-actions">
                      <span className="action-view-tag">Ver Ficha Técnica</span>
                    </div>
                  </div>

                  <div className="product-details-frame">
                    <span className="product-brand-tag"><FaCrown /> AgroTech Oficial</span>
                    <h3>{product.nombre}</h3>

                    <div className="rating-stars-premium">
                      <div className="stars"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
                      <span className="rating-value">5.0 Certificado</span>
                    </div>

                    <p className="product-short-desc">
                      {product.descripcion?.slice(0, 95)}...
                    </p>

                    <div className="product-price-row-premium">
                      <div className="price-box">
                        <span className="currency-label">Precio Neto</span>
                        <p className="main-price">${Number(product.precio).toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="mxn-tag">MXN</span></p>
                      </div>
                      <div className={`stock-indicator-pill ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
                        <span className="indicator-circle"></span>
                        {product.stock > 0 ? `Stock: ${product.stock} un.` : "Agotado"}
                      </div>
                    </div>

                    <div className="product-btn-group-premium">
                      <button
                        className="premium-btn-secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetails(product);
                        }}
                      >
                        Ficha Técnica
                      </button>

                      <button
                        className="premium-btn-primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product.id_productos, product.nombre, product.precio, product.imagen);
                        }}
                      >
                        <span>Añadir</span>
                        <FaShoppingCart />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="ad-banner-epic">
            <div className="banner-bg-graphics">
              <div className="circle-graphic visual-1"></div>
              <div className="circle-graphic visual-2"></div>
            </div>
            <div className="ad-banner-content">
              <h2>Conviértete en Proveedor Homologado</h2>
              <p>Integra tu catálogo de productos ganaderos y llega a toda la red nacional de distribución de AgroTech.</p>
              <button className="banner-cta-btn">
                <span>Iniciar Registro de Empresa</span>
                <FaArrowRight />
              </button>
            </div>
          </section>
        </>
      )}

      {/* FOOTER PREMIUM */}
      <footer className="footer-premium">
        <div className="footer-top-grid">
          <div className="footer-brand-info">
            <h3>AgroTech <span className="gradient-text">Marketplace</span></h3>
            <p>Ecosistema digital avanzado enfocado en la trazabilidad, optimización y comercio tecnológico para el sector agropecuario mexicano.</p>
          </div>
          <div className="footer-links-group">
            <h4>Infraestructura</h4>
            <a href="/trazabilidad">Plataforma de Trazabilidad</a>
            <a href="/indexScreen">Portal de Inicio</a>
          </div>
        </div>
        <div className="footer-bottom-bar">
          <p>© 2026 AgroTech Industrial S.A. de C.V. — Ecosistema de Comercio Seguro Profesional.</p>
        </div>
      </footer>

      {/* OVERLAY Y SIDEBAR DEL CARRITO (GLOBALES) */}
      {isOpen && <div className="premium-sidebar-overlay active" onClick={toggleCart}></div>}

      <div className={`premium-cart-sidebar ${isOpen ? "active" : ""}`}>
        <div className="cart-sidebar-header">
          <div className="title-area">
            <FaShoppingCart className="icon-cart" />
            <h3>Carro de Distribución</h3>
          </div>
          <button className="close-sidebar-btn" onClick={toggleCart}>✕</button>
        </div>

        <div className="cart-sidebar-body">
          {cart.length === 0 ? (
            <div className="empty-cart-state">
              <div className="animated-box-icon">🛒</div>
              <h4>El carro se encuentra vacío</h4>
              <p>Explora el catálogo y añade soluciones tecnológicas a tu orden.</p>
            </div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="premium-cart-item-card">
                <div className="item-image-holder">
                  <img src={getImageUrl(item.image)} alt={item.name} />
                </div>
                <div className="item-details-holder">
                  <h4>{item.name}</h4>
                  <p className="item-computed-price">${(item.price * item.quantity).toFixed(2)} MXN</p>
                  <div className="item-interactive-row">
                    <div className="premium-qty-selector">
                      <button onClick={() => changeQty(index, -1)}>−</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button onClick={() => changeQty(index, 1)}>+</button>
                    </div>
                    <button className="premium-trash-btn" onClick={() => removeItem(index)}>
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-sidebar-footer-premium">
            <div className="coupon-premium-box">
              <div className="input-with-icon">
                <FaPercent className="coupon-icon-label" />
                <input
                  type="text"
                  placeholder="Insertar Código Promocional"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                />
              </div>
              <button onClick={applyCoupon}>Validar</button>
            </div>

            <div className="financial-summary-sheet">
              <div className="summary-row-sheet">
                <span>Subtotal Neto:</span>
                <span>${subtotal.toFixed(2)} MXN</span>
              </div>
              <div className="summary-row-sheet">
                <span>Costo Logístico (Envío):</span>
                <span>{shipping === 0 ? <strong className="free-shipping-label">GRATIS</strong> : `$${shipping.toFixed(2)} MXN`}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row-sheet discount">
                  <span>Descuento Aplicado:</span>
                  <span>-${discount.toFixed(2)} MXN</span>
                </div>
              )}
              <div className="summary-row-sheet final-total-row">
                <span>Total de la Orden:</span>
                <span className="total-numeric">${total.toFixed(2)} MXN</span>
              </div>
            </div>

            <button className="premium-checkout-action-btn" onClick={() => navigate("/resumen-compra")}>
              <span>Proceder con la Compra</span>
              <FaArrowRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;