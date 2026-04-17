import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/admin.css";
import logo from "../assets/img/agro.png";
const API_URL = import.meta.env.VITE_API;

const AdminUsuarios = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("agroSession");
    sessionStorage.removeItem("agroSession");
    navigate("/login");
  };

  const [collapsed, setCollapsed] = useState(false);
  const [usuarios, setUsuarios] = useState<any[]>([]);

  // FORM
  const [idEditando, setIdEditando] = useState<number | null>(null);

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipo, setTipo] = useState("cliente");
  const [estado, setEstado] = useState("activo");

  const toggleSidebar = () => setCollapsed(!collapsed);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const res = await axios.get(`${API_URL}usuarios`);
      setUsuarios(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // AGREGAR / ACTUALIZAR
  const guardarUsuario = async () => {
    if (!nombre || !apellido || !email) {
      alert("Completa los campos obligatorios");
      return;
    }

    try {
      if (idEditando) {
        // UPDATE
        await axios.put(`${API_URL}usuarios/${idEditando}`, {
          nombre,
          apellido,
          email,
          telefono,
          tipo,
          estado_cuenta: estado
        });
      } else {
        // CREATE
        await axios.post(`${API_URL}usuarios`, {
          nombre,
          apellido,
          email,
          password,
          telefono,
          tipo,
          estado_cuenta: estado
        });
      }

      limpiarFormulario();
      cargarUsuarios();
    } catch (error: any) {
      console.log(error.response?.data);
      alert("Error al guardar usuario");
    }
  };

  // EDITAR
  const editarUsuario = (u: any) => {
    setIdEditando(u.id_usuario);
    setNombre(u.nombre);
    setApellido(u.apellido);
    setEmail(u.email);
    setTelefono(u.telefono || "");
    setTipo(u.tipo);
    setEstado(u.estado_cuenta);
  };

  // ELIMINAR
  const eliminarUsuario = async (id: number) => {
    if (!confirm("¿Eliminar usuario?")) return;

    try {
      await axios.delete(`${API_URL}usuarios/${id}`);
      cargarUsuarios();
    } catch (error) {
      console.log(error);
    }
  };

  const limpiarFormulario = () => {
    setIdEditando(null);
    setNombre("");
    setApellido("");
    setEmail("");
    setPassword("");
    setTelefono("");
    setTipo("cliente");
    setEstado("activo");
  };

  return (
    <div className="admin-page">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img src={logo} className="logo-img" />
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

<li>
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

      <div className={`main ${collapsed ? "expanded" : ""}`}>
        <header className="admin-header">
          <div className="left-header">
            <button className="menu-btn" onClick={toggleSidebar}>☰</button>
            <h2>Usuarios</h2>
          </div>

          <input className="search" placeholder="Buscar..." />

          <div className="admin-user">
            <div className="notification">🔔<span>3</span></div>
            <div className="status"></div>
            <span>Admin</span>
            <img src={logo} />
          </div>
        </header>

        {/* FORM */}
        <section className="table-section">
          <h3 className="titulo-form">
            {idEditando ? "Editar Usuario" : "Agregar Usuario"}
          </h3>

          <div className="producto-card">
            <div className="form-grid">

              <div className="input-group">
                <label>Nombre</label>
                <input value={nombre} onChange={e => setNombre(e.target.value)} />
              </div>

              <div className="input-group">
                <label>Apellido</label>
                <input value={apellido} onChange={e => setApellido(e.target.value)} />
              </div>

              <div className="input-group">
                <label>Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} />
              </div>

              {!idEditando && (
                <div className="input-group">
                  <label>Password</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                </div>
              )}

              <div className="input-group">
                <label>Teléfono</label>
                <input value={telefono} onChange={e => setTelefono(e.target.value)} />
              </div>

              <div className="input-group">
                <label>Tipo</label>
                <select value={tipo} onChange={e => setTipo(e.target.value)}>
                  <option value="productor">Productor</option>
                  <option value="comprador">Comprador</option>
                </select>
              </div>

              <div className="input-group">
                <label>Estado</label>
                <select value={estado} onChange={e => setEstado(e.target.value)}>
                  <option value="activo">Activo</option>
                  <option value="inactivo">Inactivo</option>
                </select>
              </div>

            </div>

            <button className="btn-agregar" onClick={guardarUsuario}>
              {idEditando ? "💾 Actualizar Usuario" : "➕ Agregar Usuario"}
            </button>

            {idEditando && (
              <button className="btn-cancelar" onClick={limpiarFormulario}>
                Cancelar edición
              </button>
            )}
          </div>
        </section>

        {/* TABLA */}
        <section className="table-section">
          <h3>Lista de Usuarios</h3>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Tipo</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.map(u => (
                <tr key={u.id_usuario}>
                  <td>{u.id_usuario}</td>
                  <td>{u.nombre} {u.apellido}</td>
                  <td>{u.email}</td>
                  <td>{u.telefono}</td>
                  <td>{u.tipo}</td>
                  <td>{u.estado_cuenta}</td>
                  <td>
                    <button onClick={() => editarUsuario(u)}>Editar</button>
                    <button onClick={() => eliminarUsuario(u.id_usuario)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

      </div>
    </div>
  );
};

export default AdminUsuarios;