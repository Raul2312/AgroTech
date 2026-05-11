import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Chart from "chart.js/auto";
import "../css/admin.css";
import Sidebar from "../Layouts/Sidebar";
import logo from "../assets/img/agro.png";

// --- INTERFACES PARA TYPESCRIPT ---
interface Usuario {
  id: number;
  tipo: 'comprador' | 'productor' | 'vendedor' | 'admin';
  nombre: string;
}

interface Producto {
  id: number;
  nombre: string;
  precio: string | number;
  stock: string | number;
}

interface Rancho {
  id: number;
  nombre: string;
}

interface Stats {
  totalUsuarios: number;
  totalProductos: number;
  totalCompradores: number;
  totalVendedores: number;
  totalRanchos: number;
  pedidosCarrito: number;
  dineroTotal: number;
  loading: boolean;
}

const API_URL = (import.meta.env.VITE_API as string);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  const [stats, setStats] = useState<Stats>({
    totalUsuarios: 0,
    totalProductos: 0,
    totalCompradores: 0,
    totalVendedores: 0,
    totalRanchos: 0,
    pedidosCarrito: 0,
    dineroTotal: 0,
    loading: true
  });

  const logout = (): void => {
    localStorage.removeItem("agroSession");
    sessionStorage.removeItem("agroSession");
    navigate("/login");
  };

  const toggleSidebar = (): void => setCollapsed(!collapsed);

  useEffect(() => {
    cargarEstadisticas();
    initChart();
    
    // Cleanup de la gráfica al desmontar el componente
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const cargarEstadisticas = async (): Promise<void> => {
    try {
      const [resUsers, resProds, resRanchos] = await Promise.all([
        axios.get<Usuario[]>(`${API_URL}usuarios`),
        axios.get<Producto[]>(`${API_URL}productos`),
        axios.get<Rancho[]>(`${API_URL}rancho`)
      ]);

      const usuarios = resUsers.data;
      const productos = resProds.data;
      const ranchos = resRanchos.data;

      // Procesar carrito (asumiendo estructura [{quantity: number}])
      const savedCart = localStorage.getItem("agroCart");
      const cartItems = savedCart ? JSON.parse(savedCart) : [];
      const totalItemsCarrito = cartItems.reduce((acc: number, item: any) => acc + (item.quantity || 0), 0);

      // Cálculos
      const compradores = usuarios.filter(u => u.tipo === 'comprador').length;
      const vendedores = usuarios.filter(u => u.tipo === 'productor' || u.tipo === 'vendedor').length;
      
      const valorTotal = productos.reduce((acc: number, p: Producto) => {
        return acc + (Number(p.precio) * Number(p.stock));
      }, 0);

      setStats({
        totalUsuarios: usuarios.length,
        totalProductos: productos.length,
        totalCompradores: compradores,
        totalVendedores: vendedores,
        totalRanchos: ranchos.length,
        pedidosCarrito: totalItemsCarrito,
        dineroTotal: valorTotal,
        loading: false
      });

    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const initChart = (): void => {
    if (!chartRef.current) return;

    chartInstance.current = new Chart(chartRef.current, {
      type: "line",
      data: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
        datasets: [{
          label: "Ventas",
          data: [12000, 19000, 15000, 24000, 30000, 28000, 35000],
          borderColor: "#4CAF50",
          backgroundColor: "rgba(76,175,80,0.2)",
          tension: 0.4,
          fill: true
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false,
        plugins: { legend: { display: false } } 
      }
    });
  };

  return (
    <div className="admin-page">
      <Sidebar collapsed={collapsed} logout={logout} />

      <div className={`main ${collapsed ? "expanded" : ""}`}>
        <header className="admin-header">
          <div className="left-header">
            <button className="menu-btn" onClick={toggleSidebar}>☰</button>
            <h2>Panel de Control</h2>
          </div>
          <div className="admin-user">
            <div className="notification">🔔<span>3</span></div>
            <span>Admin de Agro</span>
            <img src={logo} alt="logo" />
          </div>
        </header>

        <section className="kpis">
          <div className="card">
            <span>Usuarios Totales</span>
            <h3>{stats.loading ? "..." : stats.totalUsuarios}</h3>
            <small>Registrados</small>
          </div>

          <div className="card">
            <span>Catálogo</span>
            <h3>{stats.loading ? "..." : stats.totalProductos}</h3>
            <small>Productos activos</small>
          </div>

          <div className="card">
            <span>Clientes</span>
            <h3>{stats.loading ? "..." : stats.totalCompradores}</h3>
            <small>Compradores</small>
          </div>

          <div className="card">
            <span>Socios</span>
            <h3>{stats.loading ? "..." : stats.totalVendedores}</h3>
            <small>Productores</small>
          </div>

          <div className="card">
            <span>En Carrito</span>
            <h3>{stats.loading ? "..." : stats.pedidosCarrito}</h3>
            <small>Pendientes de pago</small>
          </div>

          <div className="card">
            <span>Valor Inventario</span>
            <h3>{stats.loading ? "..." : `$${stats.dineroTotal.toLocaleString()}`}</h3>
            <small>Capital en stock</small>
          </div>

          <div className="card">
            <span>Ranchos</span>
            <h3>{stats.loading ? "..." : stats.totalRanchos}</h3>
            <small>Unidades de producción</small>
          </div>
        </section>

        <section className="dashboard-grid">
          <div className="chart-box" style={{ height: '300px' }}>
            <h3>Tendencia de Ventas</h3>
            <canvas ref={chartRef}></canvas>
          </div>

          <div className="side-panel">
            <div className="panel-card">
              <h4>Objetivo del Mes</h4>
              <p>$90,000 / $120,000</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;