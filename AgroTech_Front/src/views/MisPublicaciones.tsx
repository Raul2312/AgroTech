import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../css/vendedor.css";
import logo from "../assets/img/agro.png";
import { 
  FaPlus, FaTrash, FaBoxOpen, FaImage, FaBars 
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API;

// 1. DEFINIMOS LA INTERFAZ DE LOS DATOS
interface Producto {
  id_productos: number;
  nombre: string;
  precio: string | number;
  stock: number;
  imagen: string;
  id_usuario: number;
  estado?: string;
}

interface Categoria {
  id: number;
  nombre: string;
}

const MisPublicaciones: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
  // 2. ASIGNAMOS LOS TIPOS A LOS ESTADOS
  const [products, setProducts] = useState<Producto[]>([]); 
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    nombre: "",
    precio: "",
    moneda: "MXN",
    stock: "",
    id_categoria: "",
    descripcion: "",
    estado: "activo",
    imagen: null as File | null
  });

  const sessionStr = localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession");
  const sessionData = sessionStr ? JSON.parse(sessionStr) : null;
  const userData = sessionData?.user || sessionData?.usuario;

  useEffect(() => {
    if (!userData) {
      navigate("/login");
      return;
    }
    fetchMyProducts();
    fetchCategories();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}productos`);
      const dataArray: Producto[] = Array.isArray(res.data) ? res.data : [];
      // Filtramos asegurando que el ID coincida
      const mine = dataArray.filter((p: Producto) => Number(p.id_usuario) === Number(userData.id_usuario));
      setProducts(mine);
    } catch (err) {
      console.error("Error:", err);
      setProducts([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}categorias`);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, imagen: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("precio", formData.precio);
    data.append("moneda", formData.moneda);
    data.append("stock", formData.stock);
    data.append("id_categoria", formData.id_categoria);
    data.append("descripcion", formData.descripcion);
    data.append("estado", formData.estado);
    data.append("id_usuario", userData.id_usuario.toString());

    if (formData.imagen) {
      data.append("imagen", formData.imagen);
    }

    try {
      await axios.post(`${API_URL}productos`, data);
      alert("Producto publicado");
      setFormData({
        nombre: "", precio: "", moneda: "MXN", stock: "", 
        id_categoria: "", descripcion: "", estado: "activo", imagen: null
      });
      setPreview(null);
      fetchMyProducts();
    } catch (err) {
      alert("Error al publicar");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (window.confirm("¿Eliminar?")) {
      try {
        await axios.delete(`${API_URL}productos/${id}`);
        fetchMyProducts();
      } catch (err) {
        alert("Error al eliminar");
      }
    }
  };

  return (
    <div className="client-profile admin-page">
      <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
        <div className="logo-container">
          <img src={logo} className="logo-img" alt="logo" />
          {!collapsed && <span className="logo-text">AgroTech</span>}
        </div>

        <ul className="menu">
          <li><Link to="/indexscreen">🏠 {!collapsed && "Inicio"}</Link></li>
          <li><Link to="/areacliente">🏠 {!collapsed && "Dashboard"}</Link></li>
          <li><Link to="/mis-pedidos">📦 {!collapsed && "Mis pedidos"}</Link></li>
          <li className="active"><Link to="/mis-productos">📦 {!collapsed && "Mis Productos"}</Link></li>
          <li><Link to="/marketplace">🛒 {!collapsed && "Marketplace"}</Link></li>
          <li><Link to="/perfil">👤 {!collapsed && "Mi perfil"}</Link></li>
          <li><Link to="/rancho">👤 {!collapsed && "Rancho"}</Link></li>
          <li><Link to="/trazabilidad">👤 {!collapsed && "Trazabilidad"}</Link></li>
          <li className="logout">
            <button onClick={() => {
              localStorage.removeItem("agroSession");
              sessionStorage.removeItem("agroSession");
              navigate("/login");
            }}>❌ {!collapsed && "Cerrar sesión"}</button>
          </li>
        </ul>
      </aside>

      <main className={`main ${collapsed ? "expanded" : ""}`}>
        <header className="admin-header">
          <button className="menu-btn" onClick={() => setCollapsed(!collapsed)}><FaBars /></button>
          <div className="admin-user">
            <div style={{textAlign: 'right', marginRight: '10px'}}>
               <span style={{display: 'block', fontWeight: 'bold'}}>{userData?.nombre}</span>
               <small style={{color: '#A5D6A7'}}>Vendedor</small>
            </div>
            <img src={logo} alt="user" />
          </div>
        </header>

        <div className="vendedor-content">
          <div className="glass form-section">
            <h2 className="section-title"><FaPlus /> Publicar Nuevo Producto</h2>
            <form onSubmit={handleSubmit} className="vendedor-form">
              <div className="form-grid">
                <div className="input-group">
                  <label>Nombre</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Precio</label>
                  <input type="number" name="precio" value={formData.precio} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label>Categoría</label>
                  <select name="id_categoria" value={formData.id_categoria} onChange={handleInputChange} required>
                    <option value="">Seleccionar...</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Stock</label>
                  <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
                </div>
                <div className="input-group full">
                  <label>Descripción</label>
                  <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} required />
                </div>
                <div className="input-group">
                  <label className="custom-file-btn">
                    <FaImage /> {formData.imagen ? "Imagen lista" : "Subir Imagen"}
                    <input type="file" onChange={handleImageChange} hidden />
                  </label>
                </div>
                <div className="preview-container">
                  {preview ? <img src={preview} alt="preview" /> : <div className="no-image">Previsualización</div>}
                </div>
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? "Publicando..." : "Publicar Producto"}
              </button>
            </form>
          </div>

          <div className="glass table-section" style={{marginTop: '30px'}}>
            <h2 className="section-title"><FaBoxOpen /> Mis Productos</h2>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Miniatura</th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((p: Producto) => (
                      <tr key={p.id_productos}>
                        <td>
                          <img 
                            src={p.imagen ? `${API_URL.replace('api/','')}/products/${p.imagen}` : logo} 
                            className="table-img" 
                            alt="prod" 
                          />
                        </td>
                        <td>{p.nombre}</td>
                        <td>${p.precio}</td>
                        <td>{p.stock}</td>
                        <td>
                          <button className="delete-btn" onClick={() => deleteProduct(p.id_productos)}>
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} style={{textAlign: 'center', padding: '20px'}}>Sin productos.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MisPublicaciones;