import logo from "../assets/img/agro.png";
import { Link } from "react-router-dom";
export default function Header() {
    return (
        <>
          
      {/* HEADER */}
      <header>
        <div className="logo">
          <img src={logo} alt="AgroTech Logo" />
            <h1>AgroTech</h1>
        </div>

        <nav>
          <Link to="/">Inicio</Link>
          <Link to="/trazabilidad">Trazabilidad</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="#contacto">Contacto</Link>
        </nav>
      </header>
        </>
    )
}