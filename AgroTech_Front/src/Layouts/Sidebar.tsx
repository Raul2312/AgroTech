import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/img/agro.png";


interface SidebarProps {
  collapsed: boolean;
  logout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, logout }) => {
  const location = useLocation();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="logo-container">
        <img src={logo} className="logo-img" alt="Logo" />
        {!collapsed && <span className="logo-text">AgroTech</span>}
      </div>

      <ul className="menu">
        <li className={location.pathname === "/dashboard" ? "active" : ""}>
          <Link to="/dashboard">📊 {!collapsed && "Dashboard"}</Link>
        </li>

        <li className={location.pathname === "/usuarios" ? "active" : ""}>
          <Link to="/usuarios">👥 {!collapsed && "Usuarios"}</Link>
        </li>

        <li className={location.pathname === "/productores" ? "active" : ""}>
          <Link to="/productores">🚜 {!collapsed && "Productores"}</Link>
        </li>

        <li className={location.pathname === "/compradores" ? "active" : ""}>
          <Link to="/compradores">🛒 {!collapsed && "Compradores"}</Link>
        </li>

        <li className={location.pathname === "/marketplace" ? "active" : ""}>
          <Link to="/marketplace">👥 {!collapsed && "Marketplace"}</Link>
        </li>

        <li className={location.pathname === "/productos" ? "active" : ""}>
          <Link to="/productos">📦 {!collapsed && "Productos"}</Link>
        </li>

        <li className={location.pathname === "/reportes" ? "active" : ""}>
          <Link to="/reportes">📈 {!collapsed && "Reportes"}</Link>
        </li>

        <li className="logout">
          <button onClick={logout}>
            ❌ {!collapsed && "Cerrar sesión"}
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;