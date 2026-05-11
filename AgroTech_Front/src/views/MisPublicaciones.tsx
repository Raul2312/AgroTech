import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/vendedor.css";
import logo from "../assets/img/agro.png";
import { 
  FaPlus, FaEdit, FaTrash, FaBoxOpen, 
  FaImage, FaChevronLeft, FaCheckCircle 
} from "react-icons/fa";

const API_URL = import.meta.env.VITE_API;

interface Producto {
  id_productos: number;
  nombre: string;
  precio: string;
  stock: number;
  imagen: string;
  estado: string;
  id_usuario: number;
}

interface Categoria {
  id: number;
  nombre: string;
}

const MisPublicaciones: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Producto[]>([]);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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

  // Obtener datos del usuario desde el storage
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
      // Filtramos para que el vendedor solo vea lo que él publicó
      const mine = res.data.filter((p: Producto) => p.id_usuario === userData.id_usuario);
      setProducts(mine);
    } catch (err) {
      console.error("Error al obtener productos:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}categorias`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error al obtener categorías:", err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, imagen: file }));
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
      alert("¡Producto publicado con éxito!");
      // Resetear formulario
      setFormData({
        nombre: "", precio: "", moneda: "MXN", stock: "", 
        id_categoria: "", descripcion: "", estado: "activo", imagen: null
      });
      setPreview(null);
      fetchMyProducts();
    } catch (err) {
      console.error(err);
      alert("Hubo un error al guardar el producto.");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: number) => {
    if (window.confirm("¿Estás seguro de eliminar esta publicación?")) {
      try {
        await axios.delete(`${API_URL}productos/${id}`);
        fetchMyProducts();
      } catch (err) {
        alert("Error al eliminar el producto.");
      }
    }
  };

  return (
    <div className="vendedor-container">
      <header className="vendedor-header">
        <button onClick={() => navigate("/areacliente")} className="back-btn">
          <FaChevronLeft /> Volver al Panel
        </button>
        <div className="user-profile-header">
          <div className="text-right">
            <span>{userData?.nombre}</span>
            <p>Panel de Vendedor</p>
          </div>
          <img src={logo} alt="Logo" />
        </div>
      </header>

      <div className="vendedor-content">
        <section className="form-section glass">
          <h2 className="section-title"><FaPlus /> Publicar Producto</h2>
          <form onSubmit={handleSubmit} className="vendedor-form">
            <div className="form-grid">
              <div className="input-group">
                <label>Nombre</label>
                <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
              </div>
              <div className="input-group">
                <label>Precio (MXN)</label>
                <input type="number" name="precio" value={formData.precio} onChange={handleInputChange} required />
              </div>
              <div className="input-group">
                <label>Categoría</label>
                <select name="id_categoria" value={formData.id_categoria} onChange={handleInputChange} required>
                  <option value="">Seleccionar...</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Stock</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required />
              </div>
              <div className="input-group full">
                <label>Descripción del Producto</label>
                <textarea name="descripcion" value={formData.descripcion} onChange={handleInputChange} required />
              </div>
              <div className="input-group">
                <label className="file-label">Imagen del Producto</label>
                <input type="file" id="file-upload" onChange={handleImageChange} hidden />
                <label htmlFor="file-upload" className="custom-file-btn">
                  <FaImage /> {formData.imagen ? "Cambiar Imagen" : "Elegir Archivo"}
                </label>
              </div>
              <div className="preview-container">
                {preview ? <img src={preview} alt="Vista previa" /> : <div className="no-image">Sin Vista Previa</div>}
              </div>
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Publicando..." : "Publicar Ahora"}
            </button>
          </form>
        </section>

        <section className="table-section glass">
          <h2 className="section-title"><FaBoxOpen /> Mis Publicaciones</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Producto</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map(p => (
                    <tr key={p.id_productos}>
                      <td>
                        <img 
                          src={p.imagen.startsWith('http') ? p.imagen : `${API_URL.replace('api/','')}/products/${p.imagen}`} 
                          className="table-img" 
                          alt="prod" 
                        />
                      </td>
                      <td><strong>{p.nombre}</strong></td>
                      <td>${parseFloat(p.precio).toLocaleString()} MXN</td>
                      <td>{p.stock} unidades</td>
                      <td><span className={`status-badge ${p.estado}`}>{p.estado}</span></td>
                      <td className="actions-td">
                        <button className="delete-btn" onClick={() => deleteProduct(p.id_productos)}>
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} style={{textAlign: 'center', padding: '30px', color: '#999'}}>
                      No has publicado productos todavía.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MisPublicaciones;