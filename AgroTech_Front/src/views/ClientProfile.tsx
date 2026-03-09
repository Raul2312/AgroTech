import { useState } from "react";
import { Link } from "react-router-dom";
import "../css/clientProfile.css";
import logo from "../assets/img/agro.png";

const ClientProfile = () => {

const [collapsed, setCollapsed] = useState(false);

const toggleSidebar = () => {
setCollapsed(!collapsed);
};

const user = {
name: "Juan Pérez",
email: "juan@email.com",
phone: "+52 636 123 4567",
location: "Nuevo Casas Grandes, Chihuahua",
memberSince: "2024",
orders: 24,
favorites: 12,
reviews: 5,
address: "Calle Agricultura #120",
payment: "Visa terminación 4582"
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
<Link to="/areacliente">🏠 {!collapsed && "Inicio"}</Link>
</li>

<li>
<Link to="/mis-pedidos">📦 {!collapsed && "Mis pedidos"}</Link>
</li>

<li>
<Link to="/favoritos">⭐ {!collapsed && "Favoritos"}</Link>
</li>

<li>
<Link to="/marketplace">🛒 {!collapsed && "Marketplace"}</Link>
</li>

<li className="active">
<Link to="/perfil">👤 {!collapsed && "Mi perfil"}</Link>
</li>

<li className="logout">
<Link to="/login">❌ {!collapsed && "Cerrar sesión"}</Link>
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

<input
className="search"
placeholder="Buscar productos..."
/>

<div className="user-info">

<div className="notification">
🔔<span>2</span>
</div>

<span>{user.name}</span>

<img src={logo} />

</div>

</header>


{/* HERO PERFIL */}

<section className="profile-hero">

<img src={logo} className="profile-avatar" />

<div className="profile-info">
<h2>{user.name}</h2>
<p>{user.email}</p>
<span>Miembro desde {user.memberSince}</span>
</div>

<button className="edit-btn">
Editar Perfil
</button>

</section>


{/* STATS */}

<section className="profile-stats">

<div className="profile-stat-card">
<span>Pedidos realizados</span>
<h3>{user.orders}</h3>
</div>

<div className="profile-stat-card">
<span>Favoritos</span>
<h3>{user.favorites}</h3>
</div>

<div className="profile-stat-card">
<span>Reseñas</span>
<h3>{user.reviews}</h3>
</div>

</section>


{/* GRID */}

<section className="profile-grid">

<div className="profile-box">

<h3>Información personal</h3>

<div className="profile-row">
<label>Nombre</label>
<span>{user.name}</span>
</div>

<div className="profile-row">
<label>Email</label>
<span>{user.email}</span>
</div>

<div className="profile-row">
<label>Teléfono</label>
<span>{user.phone}</span>
</div>

</div>


<div className="profile-box">

<h3>Dirección de envío</h3>

<div className="profile-row">
<label>Dirección</label>
<span>{user.address}</span>
</div>

<div className="profile-row">
<label>Ciudad</label>
<span>{user.location}</span>
</div>

</div>


<div className="profile-box">

<h3>Método de pago</h3>

<div className="profile-row">
<label>Tarjeta</label>
<span>{user.payment}</span>
</div>

</div>


<div className="profile-box">

<h3>Notificaciones</h3>

<div className="profile-row">
<label>Email</label>
<span>Activadas</span>
</div>

<div className="profile-row">
<label>Promociones</label>
<span>Activadas</span>
</div>

<div className="profile-row">
<label>Pedidos</label>
<span>Activadas</span>
</div>

</div>


<div className="profile-box">

<h3>Actividad reciente</h3>

<ul className="activity">

<li>✔ Pedido #2034 entregado</li>
<li>✔ Agregaste Aguacate Hass a favoritos</li>
<li>✔ Pedido #2031 enviado</li>
<li>✔ Nueva reseña publicada</li>

</ul>

</div>

</section>

</div>

</div>

);

};

export default ClientProfile;