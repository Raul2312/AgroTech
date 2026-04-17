import "../css/trazabilidad.css";
import Header from "../Layouts/Header";
import MapComponent from "./MapComponent";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import ganado1 from "../assets/img/ganado1.jpg";
import ganado2 from "../assets/img/ganado2.webp";

const TrazabilidadScreen = () => {

  const navigate = useNavigate();
  const [userName, setUserName] = useState("USUARIO");

  const [user, setUser] = useState<any>(null);
  const [ranchos, setRanchos] = useState<any[]>([]);
  const [ranchoActivo, setRanchoActivo] = useState<any>(null);

  // 🔥 VALIDAR SESIÓN
  useEffect(() => {
    const session =
      localStorage.getItem("agroSession") ||
      sessionStorage.getItem("agroSession");

    if (!session) {
      navigate("/login");
    } else {
      try {
        const userData = JSON.parse(session);
        setUser(userData);

        const nombre =
          userData?.nombre ||
          userData?.name ||
          userData?.user?.nombre ||
          userData?.user?.name ||
          "USUARIO";

        setUserName(nombre.toUpperCase());

      } catch (error) {
        console.error("Error leyendo sesión:", error);
        navigate("/login");
      }
    }
  }, [navigate]);

  // 🔥 CARGAR RANCHOS
  const fetchRanchos = async () => {
    try {
     const res = await axios.get(`${import.meta.env.VITE_API}rancho?id_usuario=${user?.user?.id_usuario}`);

      setRanchos(res.data);

      if (res.data.length > 0) {
        setRanchoActivo(res.data[0]);
      }

    } catch (error) {
      console.error("Error cargando ranchos:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRanchos();
    }
  }, [user]);

  // 🔥 FULLSCREEN MAPA
  const abrirMapaCompleto = () => {
    const element = document.getElementById("mapa-container");
    if (element?.requestFullscreen) {
      element.requestFullscreen();
    }
  };

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

        {/* 🔥 TABS DE RANCHOS */}
        <div style={{ marginBottom: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {ranchos.map((r) => (
            <button
              key={r.id_rancho}
              onClick={() => setRanchoActivo(r)}
              style={{
                padding: "8px 15px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                background: ranchoActivo?.id_rancho === r.id_rancho ? "#22c55e" : "#e5e7eb",
                color: ranchoActivo?.id_rancho === r.id_rancho ? "#fff" : "#000"
              }}
            >
              {r.nombre}
            </button>
          ))}
        </div>

        {/* ALERTA */}
        <div className="alert">
          ⚠️ 3 reses necesitan atención sanitaria
        </div>

        {/* MÉTRICAS */}
        <div className="metrics">
          <div className="metric">124<br /><span>Total de vacas</span></div>
          <div className="metric">24<br /><span>En monitoreo</span></div>
          <div className="metric">96%<br /><span>Salud del ganado</span></div>
          <div className="metric">15<br /><span>Sensores activos</span></div>
        </div>

        {/* MAPA + ALERTAS */}
        <div className="grid">

          <div className="map">

            <div className="map-header">
              <h3>Localización de Ganado</h3>

              <button onClick={abrirMapaCompleto}>
                Ver Mapa Completo
              </button>
            </div>

            <div id="mapa-container" className="map-box">
              {ranchoActivo ? (
                <MapComponent
                  lat={parseFloat(ranchoActivo.latitud)}
                  lng={parseFloat(ranchoActivo.longitud)}
                />
              ) : (
                <p>Cargando mapa...</p>
              )}
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

      </div>

    </div>
  );
};

export default TrazabilidadScreen;