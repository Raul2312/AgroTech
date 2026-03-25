import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/agro.png";
import "../css/index.css";

const Header = () => {

const [menuOpen,setMenuOpen] = useState(false);

const toggleMenu = () =>{
setMenuOpen(!menuOpen);
};

return(

<header className="header">

<div className="logo">

<img src={logo} alt="AgroTech"/>

<h1>AgroTech</h1>

</div>

<button className="hamburger" onClick={toggleMenu}>
☰
</button>

<nav className={menuOpen ? "nav active" : "nav"}>

<Link to="/">Inicio</Link>

<Link to="/trazabilidad">Trazabilidad</Link>

<Link to="/marketplace">Marketplace</Link>

<Link to="/areacliente">Panel</Link>

<Link to="#contacto">Contacto</Link>

<Link to="/login" className="login-btn">
Ingresar
</Link>

</nav>

</header>

);

};

export default Header;