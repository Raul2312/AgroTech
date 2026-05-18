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

  // 🔥 NUEVOS ESTADOS PARA VACAS Y MODAL
  const [totalVacas, setTotalVacas] = useState(124); // Inicia con 124 por defecto
  const [showModal, setShowModal] = useState(false);
  const [nuevoArete, setNuevoArete] = useState("");

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
      const res = await axios.get(
        `${import.meta.env.VITE_API}rancho?id_usuario=${user?.user?.id_usuario}`
      );

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

  // 🔥 FUNCIÓN PARA AGREGAR VACA
  const handleAgregarVaca = () => {
    if (nuevoArete.trim() !== "") {
      setTotalVacas((prev) => prev + 1);
      alert(`Vaca con arete ${nuevoArete} registrada exitosamente.`);
      setNuevoArete("");
      setShowModal(false);
    } else {
      alert("Por favor ingrese un número de arete válido.");
    }
  };

  // 🔥 CÁLCULO DE MÉTRICAS DINÁMICAS
  const ranchosActivosCount = ranchos.filter(
    (r) => r.estatus?.toLowerCase() === "activo"
  ).length;
  const hectareas = ranchoActivo ? ranchoActivo.superficie_hectarias : 0;

  return (
    <div className="trazabilidad-page">
      <Header />

      <div className="dashboard">
        {/* BIENVENIDA MANTENIENDO EL NOMBRE DEL USUARIO 🔥 */}
        <div className="top">
          <div>
            <h2>Bienvenido, {userName}</h2>
            <p>Monitorea y controla tu ganado en tiempo real</p>
          </div>
        </div>

        {/* 🔥 TABS DE RANCHOS */}
        <div
          style={{
            marginBottom: "15px",
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "15px",
          }}
        >
          {ranchos.map((r) => (
            <button
              key={r.id_rancho}
              onClick={() => setRanchoActivo(r)}
              style={{
                padding: "8px 15px",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                background:
                  ranchoActivo?.id_rancho === r.id_rancho
                    ? "#22c55e"
                    : "#1e293b",
                color:
                  ranchoActivo?.id_rancho === r.id_rancho ? "#fff" : "#94a3b8",
              }}
            >
              {r.nombre}
            </button>
          ))}
        </div>

        {/* ALERTA */}
        <div className="alert">⚠️ 3 reses necesitan atención sanitaria</div>

        {/* 🔥 MÉTRICAS ACTUALIZADAS */}
        <div className="metrics">
          <div className="metric">
            {totalVacas}
            <br />
            <span>Vacas registradas</span>
          </div>
          <div className="metric">
            {ranchosActivosCount}
            <br />
            <span>Ranchos activos</span>
          </div>
          <div className="metric">
            {hectareas} ha
            <br />
            <span>Superficie del rancho</span>
          </div>
        </div>

        {/* MAPA + ALERTAS */}
        <div className="grid">
          <div className="map">
            <div className="map-header">
              <h3>Localización de Ganado</h3>

              <button onClick={abrirMapaCompleto}>Ver Mapa Completo</button>
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
            <h3>Alertas y Acciones</h3>

            <div className="alert-item">
              <img src={ganado1} alt="vaca" />
              <div>
                export <strong>Vaca 0427</strong>
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

            {/* 🔥 BOTONES DE ACCIÓN */}
            <button
              className="btn-main"
              onClick={() => setShowModal(true)}
              style={{ marginBottom: "10px" }}
            >
              ➕ Agregar Vaca
            </button>
            <button className="btn-main" style={{ background: "#334155" }}>
              Ver Ganado
            </button>
          </div>
        </div>
      </div>

      {/* 🔥 MODAL PARA REGISTRAR VACA */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Registrar Nueva Vaca</h3>
            <p style={{ marginBottom: "15px", color: "#94a3b8", fontSize: "14px" }}>
              Ingresa el número de arete de la vaca.
            </p>
            <input
              type="text"
              placeholder="Ej. 0856"
              value={nuevoArete}
              onChange={(e) => setNuevoArete(e.target.value)}
            />
            <div className="modal-buttons">
              <button onClick={handleAgregarVaca} className="btn-main">
                Guardar
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="btn-cancel"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrazabilidadScreen;