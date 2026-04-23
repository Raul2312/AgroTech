import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importamos useNavigate
import logo from "../assets/img/agro.png";
import "../css/index.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate(); // Inicializamos el hook de navegación

  // Lista de correos de administradores (Extraída de tu Seeder)
  const adminEmails = [
    "raulmadridflores202@gmail.com",
    "sebastiannn231@gmail.com",
    "22cg0095@itsncg.edu.mx"
  ];

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // 🔥 Función para gestionar la redirección del Panel
  const handlePanelClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Evitamos que el Link actúe por defecto

    const sessionString = localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession");

    if (!sessionString) {
      navigate("/login");
      return;
    }

    try {
      const sessionData = JSON.parse(sessionString);

      // Verificamos si el correo está en la lista de admins
      if (sessionData.email && adminEmails.includes(sessionData.email)) {
        navigate("/dashboard");
      } else {
        navigate("/areacliente");
      }
    } catch (error) {
      console.warn("Error al leer la sesión", error);
      navigate("/areacliente");
    }
  };

  // Verificación rápida para mostrar el botón de login o no
  const isLoggedIn = !!(localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession"));

  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="AgroTech" />
        <h1>AgroTech</h1>
      </div>

      <button className="hamburger" onClick={toggleMenu}>
        ☰
      </button>

      <nav className={menuOpen ? "nav active" : "nav"}>
        <Link to="/">Inicio</Link>
        <Link to="/trazabilidad">Trazabilidad</Link>
        <Link to="/marketplace">Marketplace</Link>
        
        {/* 🔥 Cambiamos el comportamiento del Link del Panel */}
        <Link to="#" onClick={handlePanelClick}>Panel</Link>
        
        <Link to="/contacto">Contacto</Link>

        {/* Si no está logueado, muestra el botón Ingresar */}
        {!isLoggedIn && (
          <Link to="/login" className="login-btn">
            Ingresar
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;