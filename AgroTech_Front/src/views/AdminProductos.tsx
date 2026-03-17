import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/admin.css";
import logo from "../assets/img/agro.png";

const AdminProductos = () => {
  const navigate = useNavigate();

  // Logout
  const logout = () => {
    localStorage.removeItem("agroSession");
    sessionStorage.removeItem("agroSession");
    navigate("/login");
  };

  const [collapsed, setCollapsed] = useState(false);
  const [productos, setProductos] = useState<any[]>([]);
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);

  const [usuario, setUsuario] = useState<number | "">("");
  const [categoria, setCategoria] = useState<number | "">("");
  const [estado, setEstado] = useState("activo");

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [moneda, setMoneda] = useState("MXN");
  const [stock, setStock] = useState("");
  const [imagen, setImagen] = useState("");

  // Sidebar toggle
  const toggleSidebar = () => setCollapsed(!collapsed);

  // Cargar datos
  useEffect(() => {
    cargarProductos();
    cargarUsuarios();
    cargarCategorias();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/usuarios");
      setUsuarios(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/categorias");
      setCategorias(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const cargarProductos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/productos");
      setProductos(res.data);
    } catch (error) {
      console.log("Error cargando productos", error);
    }
  };

  // Agregar producto
  const agregarProducto = async () => {
    if (!nombre || !precio || !stock) {
      alert("Completa los campos obligatorios");
      return;
    }
    if (usuario === "") {
      alert("Selecciona un usuario");
      return;
    }
    if (categoria === "") {
      alert("Selecciona una categoría");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/productos", {
        nombre,
        descripcion,
        precio: Number(precio),
        moneda,
        stock: Number(stock),
        imagen,
        id_usuario: Number(usuario),
        id_categoria: Number(categoria),
        estado
      });

      // Limpiar campos
      setNombre("");
      setDescripcion("");
      setPrecio("");
      setStock("");
      setImagen("");
      setUsuario("");
      setCategoria("");
      setEstado("activo");

      cargarProductos();
    } catch (error: any) {
      console.log(error.response?.data);
      alert("Error al agregar producto. Revisa la consola.");
    }
  };

  // Eliminar producto
  const eliminarProducto = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/productos/${id}`);
      cargarProductos();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="admin-page">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img src={logo} className="logo-img" />
          {!collapsed && <span className="logo-text">AgroTech</span>}
        </div>
        <ul className="menu">
          <li><Link to="/dashboard">📊 {!collapsed && "Dashboard"}</Link></li>
          <li><Link to="/usuarios">👥 {!collapsed && "Usuarios"}</Link></li>
          <li><Link to="/productores">🚜 {!collapsed && "Productores"}</Link></li>
          <li><Link to="/compradores">🛒 {!collapsed && "Compradores"}</Link></li>
          <li className="active"><Link to="/productos">📦 {!collapsed && "Productos"}</Link></li>
          <li><Link to="/trazabilidad">🌱 {!collapsed && "Trazabilidad"}</Link></li>
          <li><Link to="/reportes">📈 {!collapsed && "Reportes"}</Link></li>
          <li className="logout">
            <button onClick={logout}>❌ {!collapsed && "Cerrar sesión"}</button>
          </li>
        </ul>
      </aside>

      <div className={`main ${collapsed ? "expanded" : ""}`}>
        <header className="admin-header">
          <div className="left-header">
            <button className="menu-btn" onClick={toggleSidebar}>☰</button>
            <h2>Productos</h2>
          </div>
          <input className="search" placeholder="Buscar..." />
          <div className="admin-user">
            <div className="notification">🔔<span>3</span></div>
            <div className="status"></div>
            <span>Admin</span>
            <img src={logo} />
          </div>
        </header>

        <section className="table-section">
          <h3 className="titulo-form">Agregar Producto</h3>
          <div className="producto-card">
            <div className="form-grid">
              <div className="input-group">
                <label>Nombre</label>
                <input placeholder="Ej: Tomate orgánico" value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Precio</label>
                <input type="number" placeholder="0.00" value={precio} onChange={e => setPrecio(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Moneda</label>
                <select value={moneda} onChange={e => setMoneda(e.target.value)}>
                  <option value="MXN">MXN</option>
                  <option value="USD">USD</option>
                </select>
              </div>
              <div className="input-group">
                <label>Stock</label>
                <input type="number" placeholder="Cantidad disponible" value={stock} onChange={e => setStock(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Usuario</label>
                <select value={usuario} onChange={e => setUsuario(e.target.value === "" ? "" : Number(e.target.value))}>
                  <option value="">Seleccionar Usuario</option>
                  {usuarios.map(u => (
                    <option key={u.id_usuario} value={u.id_usuario}>{u.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Categoría</label>
                <select value={categoria} onChange={e => setCategoria(e.target.value === "" ? "" : Number(e.target.value))}>
                  <option value="">Seleccionar Categoria</option>
                  {categorias.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="input-group full">
                <label>Descripción</label>
                <textarea placeholder="Descripción del producto" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
              </div>
              <div className="input-group full">
                <label>URL Imagen</label>
                <input placeholder="https://..." value={imagen} onChange={e => setImagen(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Estado</label>
                <select value={estado} onChange={e => setEstado(e.target.value)}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            {imagen && (
              <div className="preview-img">
                <p>Vista previa</p>
                <img src={imagen} alt="preview" />
              </div>
            )}

            <button className="btn-agregar" onClick={agregarProducto}>➕ Agregar Producto</button>
          </div>
        </section>

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
              {productos.map(p => (
                <tr key={p.id_productos}>
                  <td>{p.id_productos}</td>
                  <td>{p.nombre}</td>
                  <td>${p.precio} {p.moneda}</td>
                  <td>{p.stock}</td>
                  <td>{p.usuario?.nombre}</td>
                  <td>{p.categoria?.nombre}</td>
                  <td>{p.estado}</td>
                  <td>{p.imagen && <img src={p.imagen} style={{ width: "50px" }} />}</td>
                  <td><button onClick={() => eliminarProducto(p.id_productos)}>Eliminar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
};

export default AdminProductos;