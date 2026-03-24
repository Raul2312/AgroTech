import "../css/trazabilidad.css";
import Header from "../Layouts/Header";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ganado1 from "../assets/img/ganado1.jpg";
import ganado2 from "../assets/img/ganado2.webp";

const TrazabilidadScreen = () => {

  const navigate = useNavigate();
  const [userName, setUserName] = useState("USUARIO");

  useEffect(() => {
    const session =
      localStorage.getItem("agroSession") ||
      sessionStorage.getItem("agroSession");

    if (!session) {
      navigate("/login");
    } else {
      try {
        const user = JSON.parse(session);

        // 🔥 DETECCIÓN FLEXIBLE DEL NOMBRE
        const nombre =
          user?.nombre ||
          user?.name ||
          user?.user?.nombre ||
          user?.user?.name ||
          "USUARIO";

        // 🔥 CONVERTIR A MAYÚSCULAS
        setUserName(nombre.toUpperCase());

      } catch (error) {
        console.error("Error leyendo sesión:", error);
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <div className="trazabilidad-page">

      <Header />

      <div className="dashboard">

        {/* BIENVENIDA */}
        <div className="top">
          <div>
            <h2>Bienvenido, {userName}</h2>
            <p>Monitorea y controla tu ganado en tiempo real</p>
          </div>
        </div>

        {/* ALERTA */}
        <div className="alert">
          ⚠️ 3 reses necesitan atención sanitaria
        </div>

        {/* MÉTRICAS */}
        <div className="metrics">
          <div className="metric">124<br/><span>Total de vacas</span></div>
          <div className="metric">24<br/><span>En monitoreo</span></div>
          <div className="metric">96%<br/><span>Salud del ganado</span></div>
          <div className="metric">15<br/><span>Sensores activos</span></div>
        </div>

        {/* MAPA + ALERTAS */}
        <div className="grid">

          <div className="map">
            <div className="map-header">
              <h3>Localización de Ganado</h3>
              <button>Ver Mapa Completo</button>
            </div>

            <div className="map-box">
              🗺️ Aquí puedes integrar Leaflet / Google Maps
            </div>
          </div>

          <div className="alerts">
            <h3>Alertas</h3>

            <div className="alert-item">
              <img src={ganado1} alt="vaca" />
              <div>
                <strong>Vaca 0427</strong>
                <p>Hace 10 min</p>
              </div>
            </div>

            <div className="alert-item">
              <img src={ganado2} alt="vaca" />
              <div>
                <strong>Vaca 0478</strong>
                <p>Hace 19 min</p>
              </div>
            </div>

            <div className="alert-item">
              <img src={ganado1} alt="vaca" />
              <div>
                <strong>Vaca 0856</strong>
                <p>Hace 1 día</p>
              </div>
            </div>

            <button className="btn-main">Ver Ganado</button>
          </div>

        </div>

        {/* GANADO + ACTIVIDAD */}
        <div className="grid">

          <div className="ganado">
            <div className="map-header">
              <h3>Ganado</h3>
              <button>Ver todo</button>
            </div>

            <div className="cards">

              <div className="card">
                <img src={ganado1} alt="vaca" />
                <h4>Vaca 0124</h4>
                <p>Hace 10 min</p>
                <button>Ver Ganado</button>
              </div>

              <div className="card">
                <img src={ganado2} alt="vaca" />
                <h4>Vaca 0478</h4>
                <p>Hace 10 min</p>
                <button>Ver Ganado</button>
              </div>

              <div className="card">
                <img src={ganado1} alt="vaca" />
                <h4>Vaca 0856</h4>
                <p>Hace 1 día</p>
                <button>Ver Ganado</button>
              </div>

            </div>
          </div>

          <div className="activity">
            <h3>Recientes</h3>

            <ul>
              <li>Vaca 0478 salió del rancho</li>
              <li>Vaca 0124 se trasladó</li>
              <li>Sensor activo</li>
            </ul>

            <button className="btn-main">Ver Reportes</button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default TrazabilidadScreen;