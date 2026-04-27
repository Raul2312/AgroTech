import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/marketplace.css";
import logo from "../assets/img/agro.png";
import ProductDetailsModal from "./ProductDetailsModal";

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
  FaTrashAlt
} from "react-icons/fa";

type CartItem = {
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
  if (!img) return "https://via.placeholder.com/150?text=Sin+Imagen";
  if (img.startsWith("http")) return img;
  return apiUrl.replace("api/", "") + `products/${img}`;
};

const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [couponInput, setCouponInput] = useState("");
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    // Cargar carrito del localStorage si existe
    const savedCart = localStorage.getItem("agroCart");
    if (savedCart) setCart(JSON.parse(savedCart));
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
    const session =
      localStorage.getItem("agroSession") ||
      sessionStorage.getItem("agroSession");
    return session ? true : false;
  };

  const goPanel = () => {
    if (!checkSession()) {
      navigate("/login");
      return;
    }
    navigate("/areacliente");
  };

  const toggleCart = () => setIsOpen(!isOpen);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const addToCart = (
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
          item.name === name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...prev, { name, price: priceNumber, image, quantity }];
    });

    setIsOpen(true);
  };

  const changeQty = (index: number, change: number) => {
    setCart((prev) =>
      prev
        .map((item, i) =>
          i === index
            ? { ...item, quantity: Math.max(item.quantity + change, 0) }
            : item
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
    setDetailsOpen(true);
  };

  const closeDetails = () => {
    setSelectedProduct(null);
    setDetailsOpen(false);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.nombre.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === null || product.id_categoria === selectedCategory)
  );

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 300 ? 0 : subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping - discount;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="marketplace-page">
      <header className="marketplace-header">
        <div className="header-left">
          <div className="logo-section">
            <img src={logo} alt="AgroTech Logo" />
            <div>
              <h1>AgroTech <span>Marketplace</span></h1>
              <span>Soluciones para ganadería y campo</span>
            </div>
          </div>
        </div>

        <div className="menu-toggle" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <nav className={`main-nav ${menuOpen ? "active" : ""}`}>
          <a href="/indexScreen">Inicio</a>
          <a href="/trazabilidad">Trazabilidad</a>
          <a onClick={goPanel}>Panel</a>
          {!(localStorage.getItem("agroSession") ||
            sessionStorage.getItem("agroSession")) && (
            <a href="/Login">Login</a>
          )}
        </nav>

        <div className="header-actions">
          <button className="profile-btn pill" onClick={goPanel}>
            <FaUserCircle />
            <span>Mi Cuenta</span>
          </button>

          <div className="cart-icon-wrapper" onClick={toggleCart}>
            <FaShoppingCart />
            <span className="badge">{cartCount}</span>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-overlay"></div>

        <div className="hero-content">
          <div className="hero-badge pill">
            <FaLeaf /> Marketplace #1 para el sector ganadero
          </div>

          <h1>Todo para tu rancho, granja y producción agropecuaria</h1>

          <p>
            Encuentra alimento, medicamentos, herramientas, maquinaria y
            accesorios profesionales en un solo lugar.
          </p>

          <div className="search-container">
            <div className="search-wrapper pill">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Buscar alimento, vacunas, maquinaria..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="search-button pill">Buscar</button>
            </div>
          </div>

          <div className="hero-features">
            <div className="hero-feature-card pill">
              <FaTruck />
              <span>Envíos a todo México</span>
            </div>

            <div className="hero-feature-card pill">
              <FaShieldAlt />
              <span>Compra segura</span>
            </div>

            <div className="hero-feature-card pill">
              <FaTag />
              <span>Ofertas exclusivas</span>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <div className="benefit-card">
          <div className="benefit-icon"><FaTruck /></div>
          <div>
            <h4>Envío Gratis</h4>
            <p>En compras mayores a $300 MXN</p>
          </div>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon"><FaShieldAlt /></div>
          <div>
            <h4>Pago Seguro</h4>
            <p>Protección en todas tus compras</p>
          </div>
        </div>

        <div className="benefit-card">
          <div className="benefit-icon"><FaFire /></div>
          <div>
            <h4>Promociones</h4>
            <p>Descuentos y productos destacados</p>
          </div>
        </div>
      </section>

      <section className="categories">
        <div className="section-header">
          <h2>Categorías</h2>
          <p>Explora productos por categoría</p>
        </div>

        <div className="category-grid">
          <div
            className={`category-card pill ${selectedCategory === null ? "active" : ""}`}
            onClick={() => filterByCategory(null)}
          >
            🌎 Todas
          </div>

          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`category-card pill ${
                selectedCategory === cat.id ? "active" : ""
              }`}
              onClick={() => filterByCategory(cat.id)}
            >
              {cat.nombre}
            </div>
          ))}
        </div>
      </section>

      <section className="products">
        <div className="section-header">
          <h2>Productos Destacados</h2>
          <p>{filteredProducts.length} productos encontrados</p>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product) => (
            <div
              key={product.id_productos}
              className="product-card"
              onClick={() => openDetails(product)}
            >
              <div className="product-image-wrapper">
                <span className="product-badge pill">Top Venta</span>
                <img
                  src={getImageUrl(product.imagen)}
                  alt={product.nombre}
                />
              </div>

              <div className="product-info">
                <p className="brand">AgroTech Premium</p>
                <h3>{product.nombre}</h3>

                <div className="rating">
                  <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                  <span>(4.8)</span>
                </div>

                <p className="product-description">
                  {product.descripcion?.slice(0, 80)}...
                </p>

                <div className="price-row">
                  <div className="price">
                    ${Number(product.precio).toFixed(2)} MXN
                  </div>
                  <div className={`stock-status-pill ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
                    {product.stock > 0 ? "Disponible" : "Agotado"}
                  </div>
                </div>

                <div className="product-actions">
                  <button
                    className="details-btn pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetails(product);
                    }}
                  >
                    Detalles
                  </button>

                  <button
                    className="buy-btn pill"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(
                        product.nombre,
                        product.precio,
                        product.imagen
                      );
                    }}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="ad-section">
        <div className="ad-content">
          <h2>📢 ¿Quieres vender con nosotros?</h2>
          <p>Llega a miles de ganaderos en todo México publicando tus productos en nuestra red.</p>
          <button className="pill">Quiero anunciarme</button>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-info">
          <h3>AgroTech Marketplace</h3>
          <p>La mejor plataforma para productos del sector agropecuario.</p>
        </div>
        <div className="footer-copy">
          <p>© 2026 AgroTech - Marketplace Profesional</p>
        </div>
      </footer>

      {isOpen && (
        <div className="cart-overlay active" onClick={toggleCart}></div>
      )}

      {/* CARRITO MEJORADO */}
      <div className={`cart-sidebar ${isOpen ? "active" : ""}`}>
        <div className="cart-header">
          <h3><FaShoppingCart /> Tu Carrito</h3>
          <button className="close-cart" onClick={toggleCart}>✕</button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="empty-cart-msg">Tu carrito está vacío</div>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="cart-item-modern">
                <img src={getImageUrl(item.image)} alt={item.name} />
                <div className="cart-item-details">
                  <h4>{item.name}</h4>
                  <p className="item-price">${(item.price * item.quantity).toFixed(2)} MXN</p>
                  <div className="item-controls">
                    <div className="qty-pill">
                      <button onClick={() => changeQty(index, -1)}>−</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => changeQty(index, 1)}>+</button>
                    </div>
                    <button className="trash-btn" onClick={() => removeItem(index)}>
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer-modern">
          <div className="coupon-row">
            <input 
              type="text" 
              placeholder="Código" 
              value={couponInput} 
              onChange={(e) => setCouponInput(e.target.value)} 
            />
            <button className="pill" onClick={applyCoupon}>OK</button>
          </div>
          <div className="summary-details">
            <div className="summary-line"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></div>
            <div className="summary-line"><span>Envío:</span> <span>${shipping.toFixed(2)}</span></div>
            <div className="summary-line total"><span>Total:</span> <span>${total.toFixed(2)} MXN</span></div>
          </div>
          <button className="checkout-btn pill" onClick={() => navigate("/pagos")}>
            Finalizar Compra
          </button>
        </div>
      </div>

      {detailsOpen && selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={closeDetails}
          addToCart={addToCart}
        />
      )}
    </div>
  );
};

export default Marketplace;