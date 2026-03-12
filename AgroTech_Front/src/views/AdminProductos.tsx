import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/admin.css";
import logo from "../assets/img/agro.png";

const AdminProductos = () => {

const navigate = useNavigate();

const logout = () => {
localStorage.removeItem("agroSession");
sessionStorage.removeItem("agroSession");
navigate("/login");
};

const [collapsed,setCollapsed] = useState(false);
const [productos,setProductos] = useState<any[]>([]);

/* NUEVO */
const [usuarios,setUsuarios] = useState<any[]>([]);
const [categorias,setCategorias] = useState<any[]>([]);
const [usuario,setUsuario] = useState("");
const [categoria,setCategoria] = useState("");
const [estado,setEstado] = useState("activo");

const [nombre,setNombre] = useState("");
const [descripcion,setDescripcion] = useState("");
const [precio,setPrecio] = useState("");
const [moneda,setMoneda] = useState("MXN");
const [stock,setStock] = useState("");
const [imagen,setImagen] = useState("");

const toggleSidebar = () =>{
setCollapsed(!collapsed);
};

useEffect(()=>{
cargarProductos();
cargarUsuarios();
cargarCategorias();
},[]);


/* NUEVO */
const cargarUsuarios = async () => {
try{
const res = await axios.get("http://localhost:8000/api/usuarios");
setUsuarios(res.data);
}catch(error){
console.log(error);
}
};

/* NUEVO */
const cargarCategorias = async () => {
try{
const res = await axios.get("http://localhost:8000/api/categorias");
setCategorias(res.data);
}catch(error){
console.log(error);
}
};


const cargarProductos = async () => {

try{

const res = await axios.get("http://localhost:8000/api/productos");

setProductos(res.data);

}catch(error){

console.log("Error cargando productos",error);

}

};


const agregarProducto = async () => {

try{

await axios.post("http://localhost:8000/api/productos",{

nombre:nombre,
descripcion:descripcion,
precio:precio,
moneda:moneda,
stock:stock,
imagen:imagen,

/* NUEVO */
id_usuario:usuario,
id_categoria:categoria,
estado:estado

});

setNombre("");
setDescripcion("");
setPrecio("");
setStock("");
setImagen("");

cargarProductos();

}catch(error:any){

console.log(error.response?.data);

}

};


const eliminarProducto = async (id:number) =>{

if(!confirm("¿Eliminar producto?")) return;

try{

await axios.delete(`http://localhost:8000/api/productos/${id}`);

cargarProductos();

}catch(error){

console.log(error);

}

};


return(

<div className="admin-page">

{/* SIDEBAR */}

<aside className={`sidebar ${collapsed ? "collapsed":""}`}>

<div className="logo-container">

<img src={logo} className="logo-img"/>

{!collapsed && <span className="logo-text">AgroTech</span>}

</div>

<ul className="menu">

<li>
<Link to="/admin">📊 {!collapsed && "Dashboard"}</Link>
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

<li className="active">
<Link to="/productos">📦 {!collapsed && "Productos"}</Link>
</li>

<li>
<Link to="/trazabilidad">🌱 {!collapsed && "Trazabilidad"}</Link>
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

<h2>Productos</h2>

</div>

<input className="search" placeholder="Buscar..."/>

<div className="admin-user">

<div className="notification">🔔<span>3</span></div>

<div className="status"></div>

<span>Admin</span>

<img src={logo}/>

</div>

</header>


{/* FORMULARIO */}

<section className="table-section">

<h3>Agregar Producto</h3>

<div className="form-producto">

<input
placeholder="Nombre"
value={nombre}
onChange={(e)=>setNombre(e.target.value)}
/>

<input
placeholder="Descripción"
value={descripcion}
onChange={(e)=>setDescripcion(e.target.value)}
/>

<input
type="number"
placeholder="Precio"
value={precio}
onChange={(e)=>setPrecio(e.target.value)}
/>

<input
placeholder="Moneda"
value={moneda}
onChange={(e)=>setMoneda(e.target.value)}
/>

<input
type="number"
placeholder="Stock"
value={stock}
onChange={(e)=>setStock(e.target.value)}
/>

<input
placeholder="URL Imagen"
value={imagen}
onChange={(e)=>setImagen(e.target.value)}
/>

{/* NUEVO SELECT USUARIO */}

<select value={usuario} onChange={(e)=>setUsuario(e.target.value)}>
<option value="">Seleccionar Usuario</option>

{usuarios.map((u)=>(
<option key={u.id_usuario} value={u.id_usuario}>
{u.nombre}
</option>
))}

</select>


{/* NUEVO SELECT CATEGORIA */}

<select value={categoria} onChange={(e)=>setCategoria(e.target.value)}>
<option value="">Seleccionar Categoria</option>

{categorias.map((c)=>(
<option key={c.id_categoria} value={c.id_categoria}>
{c.nombre}
</option>
))}

</select>


{/* NUEVO ESTADO */}

<select value={estado} onChange={(e)=>setEstado(e.target.value)}>
<option value="activo">Activo</option>
<option value="inactivo">Inactivo</option>
</select>


<button onClick={agregarProducto}>
Agregar
</button>

</div>

</section>


{/* TABLA */}

<section className="table-section">

<h3>Lista de Productos</h3>

<table>

<thead>

<tr>

<th>ID</th>
<th>Nombre</th>
<th>Precio</th>
<th>Stock</th>
<th>Usuario</th>
<th>Categoria</th>
<th>Estado</th>
<th>Imagen</th>
<th>Acciones</th>

</tr>

</thead>

<tbody>

{productos.map((p)=>(
<tr key={p.id_productos}>

<td>{p.id_productos}</td>

<td>{p.nombre}</td>

<td>${p.precio} {p.moneda}</td>

<td>{p.stock}</td>

<td>{p.usuario?.nombre}</td>

<td>{p.categoria?.nombre}</td>

<td>{p.estado}</td>

<td>

{p.imagen && (

<img
src={p.imagen}
style={{width:"50px"}}
/>

)}

</td>

<td>

<button
onClick={()=>eliminarProducto(p.id_productos)}
>
Eliminar
</button>

</td>

</tr>

))}

</tbody>

</table>

</section>

</div>

</div>

)

}

export default AdminProductos;