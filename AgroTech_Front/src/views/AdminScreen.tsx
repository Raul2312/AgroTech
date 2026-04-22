
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import "../css/admin.css";
import logo from "../assets/img/agro.png";

const AdminDashboard = () => {

const navigate = useNavigate();

const logout = () => {
  localStorage.removeItem("agroSession");
  sessionStorage.removeItem("agroSession");
  navigate("/login");
};

const [collapsed,setCollapsed] = useState(false);

const chartRef = useRef<HTMLCanvasElement | null>(null);

const toggleSidebar = () =>{
setCollapsed(!collapsed);
};

useEffect(()=>{

if(!chartRef.current) return;

const chart = new Chart(chartRef.current,{
type:"line",
data:{
labels:["Ene","Feb","Mar","Abr","May","Jun","Jul"],
datasets:[
{
label:"Ventas",
data:[12000,19000,15000,24000,30000,28000,35000],
borderColor:"#4CAF50",
backgroundColor:"rgba(76,175,80,0.2)",
tension:0.4,
fill:true
}
]
},
options:{
responsive:true,
plugins:{
legend:{display:false}
}
}
});

return ()=>{
chart.destroy();
};

},[]);

return(

<div className="admin-page">

{/* SIDEBAR */}

<aside className={`sidebar ${collapsed ? "collapsed":""}`}>

<div className="logo-container">

<img src={logo} className="logo-img"/>

{!collapsed && <span className="logo-text">AgroTech</span>}

</div>

<ul className="menu">

<li className="active">
<Link to="/dashboard">📊 {!collapsed && "Dashboard"}</Link>
</li>

<li>
<Link to="/usuarios">👥 {!collapsed && "Usuarios"}</Link>
</li>

<li>
<Link to="/productores">🚜 {!collapsed && "Productores"}</Link>
</li>

<li>
<Link to="/compradores">🛒 {!collapsed && "Compradores"}</Link>
</li>

<li><Link to="/marketplace">🛒 {!collapsed && "Marketplace"}</Link></li>

<li>
<Link to="/productos">📦 {!collapsed && "Productos"}</Link>
</li>

<li>
<Link to="/reportes">📈 {!collapsed && "Reportes"}</Link>
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

<header className="admin-header">

<div className="left-header">

<button className="menu-btn" onClick={toggleSidebar}>
☰
</button>

<h2>Panel de Control</h2>

</div>

<input className="search" placeholder="Buscar..."/>

<div className="admin-user">

<div className="notification">🔔<span>3</span></div>

<div className="status"></div>

<span>Admin</span>

<img src={logo}/>

</div>

</header>


{/* KPI */}

<section className="kpis">

<div className="card">
<span>Ingresos Totales</span>
<h3>$180,450</h3>
<small>+12% este mes</small>
</div>

<div className="card">
<span>Pedidos Activos</span>
<h3>1,245</h3>
<small>+5%</small>
</div>

<div className="card">
<span>Usuarios</span>
<h3>5,420</h3>
<small>+15%</small>
</div>

<div className="card">
<span>Productos</span>
<h3>2,814</h3>
<small>+9%</small>
</div>

</section>


{/* GRID */}

<section className="dashboard-grid">

<div className="chart-box">

<h3>Ventas Mensuales</h3>

<canvas ref={chartRef}></canvas>

</div>

<div className="side-panel">

<div className="panel-card">

<h4>Meta Mensual</h4>

<p>$90,000 / $120,000</p>

<div className="progress-bar">
<div className="progress-fill"></div>
</div>

</div>

<div className="panel-card">

<h4>Actividad Reciente</h4>

<ul className="activity">

<li>✔ Nuevo productor aprobado</li>
<li>✔ Pedido #10234 enviado</li>
<li>✔ Producto agregado</li>
<li>✔ Nuevo usuario registrado</li>

</ul>

</div>

</div>

</section>


{/* TABLE */}

<section className="table-section">

<h3>Últimos Pedidos</h3>

<table>

<thead>

<tr>
<th>ID</th>
<th>Cliente</th>
<th>Estado</th>
<th>Fecha</th>
<th>Acciones</th>
</tr>

</thead>

<tbody>

<tr>
<td>#10234</td>
<td>Juan Pérez</td>
<td><span className="badge success">Enviado</span></td>
<td>02 Mar</td>
<td><button>Ver</button></td>
</tr>

<tr>
<td>#10235</td>
<td>Maria Lopez</td>
<td><span className="badge pending">Pendiente</span></td>
<td>03 Mar</td>
<td><button>Ver</button></td>
</tr>

<tr>
<td>#10236</td>
<td>Carlos Ruiz</td>
<td><span className="badge success">Entregado</span></td>
<td>03 Mar</td>
<td><button>Ver</button></td>
</tr>

</tbody>

</table>

</section>

</div>

</div>

)

}

export default AdminDashboard;