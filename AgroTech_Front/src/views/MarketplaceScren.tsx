import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/marketplace.css";
import logo from "../assets/img/agro.png";

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
  precio: number;
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

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/productos");
      setProducts(res.data);
    } catch (error) {
      console.error("Error cargando productos:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/categorias");
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

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const addToCart = (name: string, price: number, image: string) => {

    if (!checkSession()) {
      navigate("/login");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.name === name);

      if (existing) {
        return prev.map(item =>
          item.name === name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { name, price, image, quantity: 1 }];
      }
    });

    setIsOpen(true);
  };

  const changeQty = (index: number, change: number) => {
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity += change;

      if (updated[index].quantity <= 0) {
        updated.splice(index, 1);
      }

      return updated;
    });
  };

  const removeItem = (index: number) => {
    setCart(prev => {
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

  const filteredProducts = products.filter(product => {

    const matchSearch =
      product.nombre.toLowerCase().includes(search.toLowerCase());

    const matchCategory =
      selectedCategory === null ||
      product.id_categoria === selectedCategory;

    return matchSearch && matchCategory;

  });

  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 2000 ? 0 : subtotal === 0 ? 0 : 150;
  const total = subtotal + shipping - discount;

  const cartCount = cart.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

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
          <a href="#">Categorías</a>
          <a href="#">Ofertas</a>
          <a href="#">Recomendaciones</a>
          <a onClick={goPanel}>Panel</a>
          <a href="/Login">Login</a>
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

              <button className="search-button">
                Buscar
              </button>

            </div>
          </div>

        </div>
      </section>

      <section className="categories">
        <h2>Categorías</h2>

        <div className="category-grid">

          <div
            className="category-card"
            onClick={() => filterByCategory(null)}
          >
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

            <div key={product.id_productos} className="product-card">

              <img src={`http://localhost:8000/images/${product.imagen}`} />

              <div className="product-info">

                <h3>{product.nombre}</h3>

                <div className="price">
                  ${product.precio} MXN
                </div>

                <button
                  className="buy-btn"
                  onClick={() =>
                    addToCart(product.nombre, product.precio, product.imagen)
                  }
                >
                  Agregar al carrito
                </button>

              </div>

            </div>

          ))}

        </div>

      </section>

      <section className="ad-section">
        <h2>📢 Publicita tus Productos Aquí</h2>
        <p>Llega a miles de productores en todo México.</p>
      </section>

      <footer>
        © 2026 AgroTech - Marketplace Profesional
      </footer>

      {isOpen && (
        <div className="cart-overlay active" onClick={toggleCart}></div>
      )}

      <div className={`cart ${isOpen ? "active" : ""}`}>

        <div className="cart-header">
          <h2>🛒 Tu Carrito</h2>
          <button className="cart-close" onClick={toggleCart}>✕</button>
        </div>

        <div className="cart-body">

          <ul>

            {cart.map((item, index) => (

              <li key={index} className="cart-item">

                <img src={item.image} />

                <div className="cart-item-info">

                  <div className="cart-item-title">{item.name}</div>

                  <div className="cart-item-price">
                    ${item.price} MXN
                  </div>

                  <div className="quantity-controls">

                    <button onClick={() => changeQty(index, -1)}>−</button>

                    <span>{item.quantity}</span>

                    <button onClick={() => changeQty(index, 1)}>+</button>

                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(index)}
                  >
                    Eliminar
                  </button>

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

            <div>Subtotal: ${subtotal}</div>

            <div>Envío: ${shipping}</div>

            <div>Descuento: -${discount}</div>

            <div className="total-row">
              <strong>Total: ${total} MXN</strong>
            </div>

          </div>

          <button className="checkout-btn">
            Finalizar Compra
          </button>

        </div>

      </div>

    </div>
  );
};

export default Marketplace;