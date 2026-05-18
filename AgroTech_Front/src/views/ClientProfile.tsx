import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/clientProfile.css";
import logo from "../assets/img/agro.png";
import { getDailySpinStatus } from "../services/api";

interface RewardData {
  points: number;
  last_spin_date: string | null;
  last_reward_type: string | null;
  last_reward_value: number | null;
  last_reward_label: string | null;
}

const API_URL = import.meta.env.VITE_API;

const ClientProfile = () => {

  const [collapsed, setCollapsed] = useState(false);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();
  const [rewardData, setRewardData] = useState<RewardData | null>(null);
  const [loadingRewards, setLoadingRewards] = useState(true);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  // Reemplaza COMPLETAMENTE tu función loadRewards() por esta versión

const loadRewards = async () => {
  try {
    setLoadingRewards(true);

    // =========================
    // OBTENER SESIÓN
    // =========================
    const session =
      localStorage.getItem("agroSession") ||
      sessionStorage.getItem("agroSession");

    if (!session) {
      setRewardData({
        points: 0,
        last_spin_date: null,
        last_reward_type: null,
        last_reward_value: null,
        last_reward_label: "Sin premios",
      });
      return;
    }

    const parsed = JSON.parse(session);

    // Puede venir como session.token o session.access_token
    const token =
      parsed?.token ||
      parsed?.access_token ||
      parsed?.usuario?.token ||
      parsed?.user?.token;

    // =========================
    // SI NO HAY TOKEN
    // =========================
    if (!token) {
      console.warn("⚠️ No se encontró token en la sesión");

      setRewardData({
        points: 0,
        last_spin_date: null,
        last_reward_type: null,
        last_reward_value: null,
        last_reward_label: "Sin premios",
      });
      return;
    }

    // =========================
    // CONSULTAR RECOMPENSAS
    // =========================
    const response = await axios.get(`${API_URL}rewards/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      timeout: 10000,
    });

    const rewardData = response.data;

    console.log("🎯 Reward data:", rewardData);

    // =========================
    // NORMALIZAR DATOS
    // =========================
    const normalizedData: RewardData = {
      points: Number(rewardData?.points || 0),
      last_spin_date: rewardData?.last_spin_date || null,
      last_reward_type: rewardData?.last_reward_type || null,
      last_reward_value:
        rewardData?.last_reward_value !== null &&
        rewardData?.last_reward_value !== undefined
          ? Number(rewardData.last_reward_value)
          : null,
      last_reward_label:
        rewardData?.last_reward_label ||
        (rewardData?.last_reward_type === "points"
          ? `${rewardData?.last_reward_value} AgroPoints`
          : rewardData?.last_reward_type === "discount"
          ? `${rewardData?.last_reward_value}% OFF`
          : rewardData?.last_reward_type === "shipping"
          ? "FREE"
          : "Sin premios"),
    };

    // =========================
    // GUARDAR EN EL STATE
    // =========================
    setRewardData(normalizedData);
  } catch (error: any) {
    console.error(
      "❌ Error al cargar premios:",
      error?.response?.data || error.message
    );

    // Valores por defecto
    setRewardData({
      points: 0,
      last_spin_date: null,
      last_reward_type: null,
      last_reward_value: null,
      last_reward_label: "Sin premios",
    });
  } finally {
    setLoadingRewards(false);
  }
};

  // 🔥 OBTENER SESIÓN
  const getSession = () => {
    const session =
      localStorage.getItem("agroSession") ||
      sessionStorage.getItem("agroSession");

    return session ? JSON.parse(session) : null;
  };

  const sessionUser = getSession();
  const userData = sessionUser?.usuario || sessionUser?.user;

  useEffect(() => {
  if (!userData) {
    navigate("/login");
    return;
  }

  loadRewards();
}, []);

  // 🔥 FORM
  const [form, setForm] = useState({
    nombre: userData?.nombre || "",
    apellido: userData?.apellido || "",
    email: userData?.email || "",
    telefono: userData?.telefono || "",
    estado_cuenta: userData?.estado_cuenta || "Activo",
    reputacion: userData?.reputacion || "Normal"
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 🔥 GUARDAR
  const handleSave = async () => {
    try {

      if (!userData) {
        navigate("/login");
        return;
      }

      await axios.put(
       `${API_URL}usuarios/${userData.id_usuario}`,
        {
          nombre: form.nombre,
          apellido: form.apellido,
          telefono: form.telefono,
          estado_cuenta: form.estado_cuenta
          // ❌ email y reputacion NO se envían
        }
      );

      alert("Perfil actualizado 🔥");
      setEditing(false);

    } catch (error) {
      console.error(error);
      alert("Error al actualizar perfil");
    }
  };

  return (

      <div className="client-profile">

        {/* SIDEBAR */}
        <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>

          <div className="logo-container">
            <img src={logo} className="logo-img" />
            {!collapsed && <span className="logo-text">AgroTech</span>}
          </div>

          <ul className="menu">

              <li>
              <Link to="/indexscreen">🏠 {!collapsed && "Inicio"}</Link>
            </li>

            <li>
              <Link to="/areacliente">🏠 {!collapsed && "Dashboard"}</Link>
            </li>

            <li>
              <Link to="/mis-pedidos">📦 {!collapsed && "Mis pedidos"}</Link>
            </li>

            <li>
              <Link to="/mis-productos">📦 {!collapsed && "Publicar Productos"}</Link>
              </li>

          

            <li>
              <Link to="/marketplace">🛒 {!collapsed && "Marketplace"}</Link>
            </li>

            <li className="active">
              <Link to="/perfil">👤 {!collapsed && "Mi perfil"}</Link>
            </li>
              <li>
              <Link to="/rancho">👤 {!collapsed && "Rancho"}</Link>
              </li>
                <li>
              <Link to="/trazabilidad">👤 {!collapsed && "Trazabilidad"}</Link>
              </li>

            <li className="logout">
              <button onClick={() => {
                localStorage.removeItem("agroSession");
                sessionStorage.removeItem("agroSession");
                navigate("/login");
              }}>
                ❌ {!collapsed && "Cerrar sesión"}
              </button>
            </li>

          </ul>

        </aside>

      {/* MAIN */}
      <div className={`main ${collapsed ? "expanded" : ""}`}>

        <header className="header">

          <div className="left-header">
            <button className="menu-btn" onClick={toggleSidebar}>
              ☰
            </button>
            <h2>Mi Perfil</h2>
          </div>

          <input className="search" placeholder="Buscar productos..." />

          <div className="user-info">
            <div className="notification">
              🔔<span>2</span>
            </div>

            <span>{form.nombre} {form.apellido}</span>
            <img src={logo} />
          </div>

        </header>

        {/* HERO */}
        <section className="profile-hero">

          <img src={logo} className="profile-avatar" />

          <div className="profile-info">
            <h2>{form.nombre} {form.apellido}</h2>
            <p>{form.email}</p>
            <span>Miembro desde {userData?.fecha_registro || "N/A"}</span>
          </div>

          <button className="edit-btn" onClick={() => setEditing(!editing)}>
            {editing ? "Cancelar" : "Editar Perfil"}
          </button>

        </section>

        {/* STATS */}
        <section className="profile-stats">
  <div className="profile-stat-card">
    <span>Estado</span>
    <h3>{form.estado_cuenta}</h3>
  </div>

  <div className="profile-stat-card">
    <span>Reputación</span>
    <h3>{form.reputacion}</h3>
  </div>

  <div className="profile-stat-card">
    <span>🎁 Puntos</span>
    <h3>
      {loadingRewards
        ? "..."
        : rewardData?.points ?? 0}
    </h3>
  </div>

  <div className="profile-stat-card">
    <span>🏆 Último Premio</span>
    <h3>
      {loadingRewards
        ? "..."
        : rewardData?.last_reward_label ||
          "Sin premios"}
    </h3>
  </div>
</section>


        {/* GRID ESTILO IMAGEN */}
        <section className="profile-grid">

          <div className="profile-box">

            <h3>Información personal</h3>

            <div className="profile-row">
              <label>Nombre</label>
              {editing ? (
                <input name="nombre" value={form.nombre} onChange={handleChange} />
              ) : (
                <span>{form.nombre}</span>
              )}
            </div>

            <div className="profile-row">
              <label>Apellido</label>
              {editing ? (
                <input name="apellido" value={form.apellido} onChange={handleChange} />
              ) : (
                <span>{form.apellido}</span>
              )}
            </div>

            {/* 🔒 EMAIL */}
            <div className="profile-row">
              <label>Email</label>
              <span>{form.email}</span>
            </div>

            <div className="profile-row">
              <label>Teléfono</label>
              {editing ? (
                <input name="telefono" value={form.telefono} onChange={handleChange} />
              ) : (
                <span>{form.telefono || "No registrado"}</span>
              )}
            </div>

          </div>

          <div className="profile-box">

            <h3>Cuenta</h3>

            <div className="profile-row">
              <label>Estado</label>
              {editing ? (
                <select name="estado_cuenta" value={form.estado_cuenta} onChange={handleChange}>
                  <option>Activo</option>
                  <option>Inactivo</option>
                </select>
              ) : (
                <span>{form.estado_cuenta}</span>
              )}
            </div>

            {/* 🔒 REPUTACIÓN */}
            <div className="profile-row">
              <label>Reputación</label>
              <span>{form.reputacion}</span>
            </div>

          </div>

        </section>

        <section className="profile-grid">
  <div className="profile-box">
    <h3>🎰 Historial de Daily Spin</h3>

    <div className="profile-row">
      <label>Puntos acumulados</label>
      <span>
        {loadingRewards
          ? "Cargando..."
          : `${rewardData?.points ?? 0} puntos`}
      </span>
    </div>

    <div className="profile-row">
      <label>Último premio</label>
      <span>
        {loadingRewards
          ? "Cargando..."
          : rewardData?.last_reward_label ||
            "Sin premios"}
      </span>
    </div>

    <div className="profile-row">
      <label>Tipo de premio</label>
      <span>
        {loadingRewards
          ? "Cargando..."
          : rewardData?.last_reward_type ||
            "N/A"}
      </span>
    </div>

    <div className="profile-row">
      <label>Valor del premio</label>
      <span>
        {loadingRewards
          ? "Cargando..."
          : rewardData?.last_reward_value ??
            "N/A"}
      </span>
    </div>

    <div className="profile-row">
      <label>Último giro</label>
      <span>
        {loadingRewards
          ? "Cargando..."
          : rewardData?.last_spin_date ||
            "Nunca"}
      </span>
    </div>
  </div>
</section>

        {/* BOTÓN GUARDAR */}
        {editing && (
          <div style={{ padding: "20px" }}>
            <button className="btn-main" onClick={handleSave}>
              💾 Guardar cambios
            </button>
          </div>
        )}

      </div>

    </div>
  );
};

export default ClientProfile;