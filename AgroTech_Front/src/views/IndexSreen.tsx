import { Link } from "react-router-dom";
import "./../css/index.css";

import trazabilidadImg from "../assets/img/trazabilidad.jpg";
import marketplaceImg from "../assets/img/marketplace.png";
import ganado1 from "../assets/img/ganado1.jpg";
import ganado2 from "../assets/img/ganado2.webp";
import Header from "../Layouts/Header";

const IndexScreen = () => {
  return (
    <div className="index-page">

      <Header/>

      {/* HERO */}
      <section className="hero">

        <div className="overlay"></div>

        <div className="hero-content">

          <h2>Innovación Digital en la Ganadería</h2>

          <p>
            Control total del ganado, trazabilidad inteligente y marketplace
            digital en una sola plataforma.
          </p>

          <Link to="/login" className="btn">
            Ingresar a la Plataforma
          </Link>

        </div>

      </section>


      {/* TRAZABILIDAD */}
      <section id="trazabilidad" className="info-section">

        <div className="info-text">

          <h2>Sistema de Trazabilidad Inteligente</h2>

          <p>
            Gestiona cada animal con identificación RFID, historial sanitario
            completo y seguimiento geográfico en tiempo real.
          </p>

          <ul>
            <li>✔ Identificación Individual</li>
            <li>✔ Control Sanitario</li>
            <li>✔ Seguimiento Geográfico</li>
            <li>✔ Historial Digital Seguro</li>
          </ul>

        </div>

        <div className="info-img">
          <img src={trazabilidadImg} alt="Sistema de Trazabilidad"/>
        </div>

      </section>


      {/* MARKETPLACE */}
      <section id="marketplace" className="info-section reverse">

        <div className="info-text">

          <h2>Marketplace Ganadero Digital</h2>

          <p>
            Conecta productores y compradores sin intermediarios mediante un
            sistema seguro, transparente y eficiente.
          </p>

          <ul>
            <li>✔ Venta Directa</li>
            <li>✔ Subastas en Línea</li>
            <li>✔ Pagos Seguros</li>
            <li>✔ Sistema de Reputación</li>
          </ul>

        </div>

        <div className="info-img">
          <img src={marketplaceImg} alt="Marketplace Ganadero"/>
        </div>

      </section>


      {/* GALERÍA */}
      <section className="gallery">

        <h2>Producción y Control en Campo</h2>

        <div className="gallery-grid">

          <img src={ganado1} alt="Ganado 1"/>
          <img src={ganado2} alt="Ganado 2"/>

        </div>

      </section>


      {/* FOOTER */}
      <footer id="contacto">

        <div className="footer-content">

          <h3>AgroTech</h3>

          <p>
            Plataforma digital para la transformación del sector ganadero.
          </p>

          <p>© 2026 Todos los derechos reservados</p>

        </div>

      </footer>

    </div>
  );
};

export default IndexScreen;