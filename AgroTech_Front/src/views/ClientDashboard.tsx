import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/clientDashboard.css";
import logo from "../assets/img/agro.png";

const ClientDashboard = () => {
 const navigate = useNavigate();
    const logout = () => {
  localStorage.removeItem("agroSession");
  sessionStorage.removeItem("agroSession");
  navigate("/login");
};

const [collapsed,setCollapsed] = useState(false);

const toggleSidebar = () =>{
setCollapsed(!collapsed);
};

return(

<div className="client-dashboard">

{/* SIDEBAR */}

<aside className={`sidebar ${collapsed ? "collapsed":""}`}>

<div className="logo-container">

<img src={logo} className="logo-img"/>

{!collapsed && <span className="logo-text">AgroTech</span>}

</div>

<ul className="menu">

<li className="active">
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

<li>
<Link to="/perfil">👤 {!collapsed && "Mi perfil"}</Link>
</li>

<li>
<Link to="/rancho">👤 {!collapsed && "Rancho"}</Link>
</li>

<li className="logout">
<button onClick={logout}>
❌ {!collapsed && "Cerrar sesión"}
</button>
</li>

</ul>

</aside>


{/* MAIN */}

<div className={`main ${collapsed ? "expanded":""}`}>

<header className="header">

<div className="left-header">

<button className="menu-btn" onClick={toggleSidebar}>
☰
</button>

<h2>Panel del Cliente</h2>

</div>

<input
className="search"
placeholder="Buscar productos..."
/>

<div className="user-info">

<div className="notification">🔔<span>2</span></div>

<span>Cliente</span>

<img src={logo}/>

</div>

</header>


{/* STATS */}

<section className="stats">

<div className="stat-card">
<span>Pedidos Totales</span>
<h3>24</h3>
</div>

<div className="stat-card">
<span>Pedidos en camino</span>
<h3>3</h3>
</div>

<div className="stat-card">
<span>Productos favoritos</span>
<h3>12</h3>
</div>

<div className="stat-card">
<span>Gasto total</span>
<h3>$8,450</h3>
</div>

</section>


{/* GRID */}

<section className="grid">

<div className="orders">

<h3>Pedidos Recientes</h3>

<table>

<thead>
<tr>
<th>ID</th>
<th>Producto</th>
<th>Estado</th>
<th>Fecha</th>
</tr>
</thead>

<tbody>

<tr>
<td>#2021</td>
<td>Aguacate Orgánico</td>
<td><span className="badge shipped">Enviado</span></td>
<td>05 Mar</td>
</tr>

<tr>
<td>#2022</td>
<td>Tomate Cherry</td>
<td><span className="badge pending">Procesando</span></td>
<td>07 Mar</td>
</tr>

<tr>
<td>#2023</td>
<td>Maíz Amarillo</td>
<td><span className="badge delivered">Entregado</span></td>
<td>01 Mar</td>
</tr>

</tbody>

</table>

</div>


<div className="recommendations">

<h3>Recomendado para ti</h3>

<div className="product">

<img src="https://images.unsplash.com/photo-1592928302636-c83cf1e1b05c"/>

<div>
<h4>Aguacate Hass</h4>
<p>$45 / kg</p>
<button>Ver producto</button>
</div>

</div>

<div className="product">

<img src="https://images.unsplash.com/photo-1567306226416-28f0efdc88ce"/>

<div>
<h4>Manzana Roja</h4>
<p>$30 / kg</p>
<button>Ver producto</button>
</div>

</div>

</div>

</section>

</div>

</div>

)

}

export default ClientDashboard