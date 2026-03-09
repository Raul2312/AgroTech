import { Link } from "react-router-dom";
import "../css/trazabilidad.css";

import logo from "../assets/img/agro.png";
import trazabilidadImg from "../assets/img/trazabilidad.jpg";
import ganado1 from "../assets/img/ganado1.jpg";
import ganado2 from "../assets/img/ganado2.webp";

const TrazabilidadScreen = () => {
  return (
    <div className="trazabilidad-page">

      {/* HEADER */}

      <header>
        <div className="logo">
          <img src={logo} alt="AgroTech Logo" />
          <h1>AgroTech</h1>
        </div>

        <nav>
          <Link to="/">Inicio</Link>
          <a href="#">Trazabilidad</a>
          <Link to="/marketplace">Marketplace</Link>
          <a href="#contacto">Contacto</a>
        </nav>
      </header>

      {/* HERO */}

      <section className="hero-trazabilidad">

        <div className="overlay"></div>

        <div className="hero-content">
          <h2>Trazabilidad Ganadera Inteligente</h2>

          <p>
            Controla el historial completo de cada animal desde su nacimiento
            hasta su comercialización con tecnología digital.
          </p>
        </div>

      </section>

      {/* INTRO */}

      <section className="intro">

        <h2>¿Qué es la Trazabilidad Ganadera?</h2>

        <p>
          La trazabilidad ganadera permite registrar y consultar toda la
          información de un animal durante toda su vida productiva.
          AgroTech permite controlar salud, crecimiento y comercialización
          mediante una plataforma digital moderna.
        </p>

      </section>

      {/* INFO */}

      <section className="info-section">

        <div className="info-text">

          <h2>Control Total del Ganado</h2>

          <p>
            Nuestro sistema permite monitorear cada etapa del animal para
            garantizar transparencia, seguridad sanitaria y mejor control
            productivo.
          </p>

          <ul>
            <li>✔ Identificación RFID</li>
            <li>✔ Historial sanitario</li>
            <li>✔ Registro de peso</li>
            <li>✔ Seguimiento de ubicación</li>
            <li>✔ Control de vacunas</li>
          </ul>

        </div>

        <div className="info-img">
          <img src={trazabilidadImg} alt="Sistema de trazabilidad" />
        </div>

      </section>

      {/* COMO FUNCIONA */}

      <section className="funciona">

<h2 className="section-title">Cómo Funciona</h2>

<p className="section-sub">
Nuestro sistema de trazabilidad digital registra y monitorea cada etapa
del ciclo de vida del ganado mediante tecnología avanzada y datos en tiempo real.
</p>

<div className="timeline">

<div className="timeline-card">

<span className="step-number">01</span>

<div className="timeline-icon">
<i className="fas fa-microchip"></i>
</div>

<h3>Identificación Digital</h3>

<p>
Cada animal recibe un identificador RFID único que permite
su registro individual dentro del sistema AgroTech.
</p>

</div>

<div className="timeline-card">

<span className="step-number">02</span>

<div className="timeline-icon">
<i className="fas fa-database"></i>
</div>

<h3>Registro de Datos</h3>

<p>
Se almacena información clave como peso, vacunas,
historial veterinario y movimientos dentro del rancho.
</p>

</div>

<div className="timeline-card">

<span className="step-number">03</span>

<div className="timeline-icon">
<i className="fas fa-chart-line"></i>
</div>

<h3>Monitoreo Inteligente</h3>

<p>
Los productores pueden consultar datos en tiempo real
para optimizar la gestión del ganado.
</p>

</div>

</div>

</section>

      {/* BENEFICIOS */}

     <section className="beneficios">

<h2 className="section-title">Ventajas de la Trazabilidad Inteligente</h2>

<p className="section-sub">
La digitalización del control ganadero permite mayor eficiencia,
transparencia y seguridad en toda la cadena productiva.
</p>

<div className="beneficios-grid">

<div className="beneficio-card">

<div className="beneficio-icon">
<i className="fas fa-shield-alt"></i>
</div>

<h3>Transparencia Total</h3>

<p>
Acceso completo al historial del animal desde su nacimiento
hasta su comercialización.
</p>

</div>

<div className="beneficio-card">

<div className="beneficio-icon">
<i className="fas fa-heartbeat"></i>
</div>

<h3>Control Sanitario</h3>

<p>
Seguimiento detallado de vacunas, enfermedades
y revisiones veterinarias.
</p>

</div>

<div className="beneficio-card">

<div className="beneficio-icon">
<i className="fas fa-chart-bar"></i>
</div>

<h3>Optimización Productiva</h3>

<p>
Los datos permiten mejorar la toma de decisiones
y aumentar la eficiencia del rancho.
</p>

</div>

<div className="beneficio-card">

<div className="beneficio-icon">
<i className="fas fa-globe"></i>
</div>

<h3>Confianza del Mercado</h3>

<p>
Garantiza la procedencia del producto
y fortalece la confianza del consumidor.
</p>

</div>

</div>

</section>

      {/* TIMELINE */}

      <section className="timeline-section">

        <h2>Ejemplo de Historial de un Animal</h2>

        <div className="timeline">

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>Nacimiento</h4>
              <p>Registro del animal dentro del sistema.</p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>Vacunación</h4>
              <p>Aplicación de vacunas y control sanitario.</p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>Revisión Veterinaria</h4>
              <p>Chequeo de salud y registro de peso.</p>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot"></div>
            <div className="timeline-content">
              <h4>Venta</h4>
              <p>Registro de comercialización del animal.</p>
            </div>
          </div>

        </div>

      </section>

      {/* GALERÍA */}

      <section className="gallery">

        <h2>Producción Ganadera</h2>

        <div className="gallery-grid">

          <img src={ganado1} alt="Ganado" />
          <img src={ganado2} alt="Ganado" />

        </div>

      </section>

      {/* CTA */}

      <section className="cta">

        <h2>Digitaliza tu Producción Ganadera</h2>

        <p>
          Control total de tu ganado con AgroTech.
        </p>

        <Link to="/login" className="btn">
          Comenzar Ahora
        </Link>

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

export default TrazabilidadScreen;