import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/rancho.css";
import logo from "../assets/img/agro.png";

const ClientRancho = () => {

  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const logout = () => {
    localStorage.removeItem("agroSession");
    sessionStorage.removeItem("agroSession");
    navigate("/login");
  };

  // 👇 OBTENER USUARIO
  const getUser = () => {
    const session =
      localStorage.getItem("agroSession") ||
      sessionStorage.getItem("agroSession");

    return session ? JSON.parse(session) : null;
  };

  const user = getUser();

  // 🚨 SI NO HAY USUARIO → LOGIN
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);

  // 👇 LISTA DE RANCHOS
  const [ranchos, setRanchos] = useState<any[]>([]);

  const [form, setForm] = useState({
    nombre: "asdasd",
    ubicacion: "asdasd",
    latitud: "111",
    longitud: "222",
    superficie_hectarias: "200",
    telefono: "12312",
    correo: "tet@gmail.com",
    tipo_rancho: "Ganadero",
    estatus: "Activo",
    id_usuario: user?.user.id_usuario || 0
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // 👇 CARGAR RANCHOS
  const fetchRanchos = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API+"rancho");

      const propios = res.data.filter(
        (r: any) => r.id_usuario === user?.user.id_usuario
      );

      setRanchos(propios);

    } catch (error) {
      console.error("Error cargando ranchos:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRanchos();
    }
  }, []);

  // 👇 GUARDAR
  const handleSubmit = async () => {
    try {

      if (!user) {
        navigate("/login");
        return;
      }
      console.log(user)
      console.log({
        ...form,
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        superficie_hectarias: parseFloat(form.superficie_hectarias),
        id_usuario: user.user.id_usuario,
        fecha_registro: new Date().toISOString().split("T")[0]
      })

      await axios.post("http://localhost:8000/api/rancho", {
        ...form,
        latitud: parseFloat(form.latitud),
        longitud: parseFloat(form.longitud),
        superficie_hectarias: parseFloat(form.superficie_hectarias),
        id_usuario: user.user.id_usuario,
        fecha_registro: new Date().toISOString().split("T")[0]
      });

      alert("Rancho registrado correctamente 🔥");

      // 🔥 limpiar formulario
      setForm({
        nombre: "",
        ubicacion: "",
        latitud: "",
        longitud: "",
        superficie_hectarias: "",
        telefono: "",
        correo: "",
        tipo_rancho: "Ganadero",
        estatus: "Activo",
        id_usuario: user.user.id_usuario
      });

      fetchRanchos();

    } catch (error) {
      console.error("ERROR BACKEND:", error);
      alert("Error al registrar rancho");
    }
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <aside className={`sidebar ${collapsed ? "collapsed":""}`}>

        <div className="logo-container" onClick={() => setCollapsed(!collapsed)}>
          <img src={logo} className="logo-img"/>
          {!collapsed && <span className="logo-text">AgroTech</span>}
        </div>

        <ul className="menu">

          <li>
            <Link to="/areaCliente">🏠 {!collapsed && "Inicio"}</Link>
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

          <li className="active">
            <Link to="/rancho">🌱 {!collapsed && "Rancho"}</Link>
          </li>

          <li className="logout">
            <button onClick={logout}>
              ❌ {!collapsed && "Cerrar sesión"}
            </button>
          </li>

        </ul>

      </aside>

      {/* CONTENIDO */}
      <div className="main">

        <div className="panel">

          <h2>Registrar Rancho</h2>

          <div className="form-grid">

            <input name="nombre" value={form.nombre} placeholder="Nombre del rancho" onChange={handleChange} />
            <input name="ubicacion" value={form.ubicacion} placeholder="Ubicación" onChange={handleChange} />
            <input name="latitud" value={form.latitud} placeholder="Latitud" onChange={handleChange} />
            <input name="longitud" value={form.longitud} placeholder="Longitud" onChange={handleChange} />
            <input name="superficie_hectarias" value={form.superficie_hectarias} placeholder="Hectáreas" onChange={handleChange} />
            <input name="telefono" value={form.telefono} placeholder="Teléfono" onChange={handleChange} />
            <input name="correo" value={form.correo} placeholder="Correo" onChange={handleChange} />

            <select name="tipo_rancho" value={form.tipo_rancho} onChange={handleChange}>
              <option>Ganadero</option>
              <option>Agrícola</option>
              <option>Mixto</option>
            </select>

            <select name="estatus" value={form.estatus} onChange={handleChange}>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>

          </div>

          <div className="preview">
            <h3>Vista previa</h3>
            <p>📍 Lat: {form.latitud || "--"} | Lng: {form.longitud || "--"}</p>
          </div>

          <button className="btn-save" onClick={handleSubmit}>
            + Registrar Rancho
          </button>

        </div>

        {/* LISTA */}
        <div className="panel" style={{ marginTop: "20px" }}>
          <h2>Mis Ranchos</h2>

          <div className="cards">

            {ranchos.map((r) => (
              <div className="card" key={r.id_rancho}>
                <h3>{r.nombre}</h3>
                <p>📍 {r.ubicacion}</p>
                <p>🌱 {r.superficie_hectarias} ha</p>
                <p>📞 {r.telefono}</p>
                <p>📧 {r.correo}</p>
                <span className="status">{r.estatus}</span>
              </div>
            ))}

            {ranchos.length === 0 && (
              <p>No tienes ranchos registrados</p>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};

export default ClientRancho;