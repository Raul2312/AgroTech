import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/marketplace.css";
import logo from "../assets/img/agro.png";
import ProductDetailsModal from "./ProductDetailsModal";

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

  // Si ya es URL
  if (img.startsWith("http")) return img;

  // Si es imagen de Laravel
  return apiUrl.replace("api/","")+`products/${img}`;
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

  // Modal de detalles
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);
  
  const fetchProducts = async () => {
    try {
      const res = await axios.get(apiUrl+"productos");
      console.log(apiUrl+"/api/productos")
      setProducts(res.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(apiUrl+"categorias");
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
      } else {
        return [...prev, { name, price: priceNumber, image, quantity }];
      }
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

  const filterByCategory = (id: number | null) => setSelectedCategory(id);

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

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 300 ? 0 : subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping - discount;
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div>
      <header>
        <div className="logo">
          <img src={logo} alt="AgroTech Logo" />
        </div>
        <h1>AgroTech Marketplace</h1>
        <div className="menu-toggle" onClick={toggleMenu}>
          ☰
        </div>
        <nav className={menuOpen ? "active" : ""}>
          <a href="/indexScreen">Inicio</a>
          <a href="/trazabilidad">Trazabilidad</a>
          <a href="#">Ofertas</a>
          <a onClick={goPanel}>Panel</a>
          {!(localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession")) && <a href="/Login">Login</a>}
        </nav>
        <div className="cart-icon" onClick={toggleCart}>
          🛒 <span>{cartCount}</span>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Productos Profesionales para Ganadería</h1>
          <div className="search-container">
            <div className="search-wrapper">
              <div className="search-icon">🔍</div>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar alimento, vacunas, maquinaria..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="search-button">Buscar</button>
            </div>
          </div>
        </div>
      </section>

      <section className="categories">
        <h2>Categorías</h2>
        <div className="category-grid">
          <div className="category-card" onClick={() => filterByCategory(null)}>
            🌎 Todas
          </div>
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category-card"
              onClick={() => filterByCategory(cat.id)}
            >
              {cat.nombre}
            </div>
          ))}
        </div>
      </section>

      <section className="products">
  <h2>Productos Destacados</h2>
  <div className="product-grid">
    {filteredProducts.map((product) => (
      <div
        key={product.id_productos}
        className="product-card"
        onClick={() => openDetails(product)} // click en toda la tarjeta abre detalles
        style={{ cursor: "pointer" }} // opcional: cambia cursor a mano
      >
        <img
          src={getImageUrl(product.imagen)}
          alt={product.nombre}
        />
        <div className="product-info">
          <h3>{product.nombre}</h3>
          <p className="brand">AgroTech</p>
          <div className="rating">⭐⭐⭐⭐☆</div>
          <div className="price">${Number(product.precio).toFixed(2)} MXN</div>
          <div className="shipping">
            Envío: ${Number(product.precio) > 2000 ? 0 : 150}
          </div>
          <button
            className="buy-btn"
            onClick={(e) => {
              e.stopPropagation(); // evita que al agregar al carrito se abra modal
              addToCart(product.nombre, product.precio, product.imagen);
            }}
          >
            Agregar al carrito
          </button>
          {/* El botón “Ver detalles” se elimina */}
        </div>
      </div>
    ))}
  </div>
</section>

      <section className="ad-section">
        <h2>📢 Publicita tus Productos Aquí</h2>
        <p>Llega a miles de productores en todo México.</p>
      </section>

      <footer>© 2026 AgroTech - Marketplace Profesional</footer>

      {isOpen && <div className="cart-overlay active" onClick={toggleCart}></div>}

      <div className={`cart ${isOpen ? "active" : ""}`}>
        <div className="cart-header">
          <h2>🛒 Tu Carrito</h2>
          <button className="cart-close" onClick={toggleCart}>✕</button>
        </div>
        <div className="cart-body">
          <ul>
            {cart.map((item, index) => (
              <li key={index} className="cart-item">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">
                    ${parseFloat(item.price as any).toFixed(2)} MXN
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => changeQty(index, -1)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => changeQty(index, 1)}>+</button>
                  </div>
                  <button className="remove-btn" onClick={() => removeItem(index)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="cart-footer">
          <div className="coupon-section">
            <input
              type="text"
              placeholder="Código de descuento"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
            />
            <button onClick={applyCoupon}>Aplicar</button>
          </div>
          <div className="cart-summary">
            <div>Subtotal: ${subtotal.toFixed(2)}</div>
            <div>Envío: ${shipping.toFixed(2)}</div>
            <div>Descuento: -${discount.toFixed(2)}</div>
            <div className="total-row">
              <strong>Total: ${total.toFixed(2)} MXN</strong>
            </div>
          </div>
          <button className="checkout-btn">Finalizar Compra</button>
        </div>
      </div>

     {/* Modal de detalles */}
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