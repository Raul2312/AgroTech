import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/login.css";
import logo from "../assets/img/agro.png";
import axios from "axios";

const API_URL = import.meta.env.VITE_API;

const Login: React.FC = () => {
  const navigate = useNavigate();
  
  // Manejo de vistas: 'login', 'register', 'forgot', 'reset'
  const [view, setView] = useState<string>("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    apellido: "",
    email: "",
    password: ""
  });

  // Estados para recuperación
  const [recoveryEmail, setRecoveryEmail] = useState<string>("");
  const [resetData, setResetData] = useState({
    code: "",
    newPassword: ""
  });

  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const adminEmails: string[] = [
    "22cg0095@itsncg.edu.mx",
    "sebastiannn231@gmail.com",
    "raulmadridflores202@gmail.com"
  ];

  // AUTO LOGIN: Si ya hay sesión, mandarlo al marketplace
  // AUTO LOGIN CORREGIDO: Verifica el rol antes de redirigir
  useEffect(() => {
    const sessionStr = localStorage.getItem("agroSession") || sessionStorage.getItem("agroSession");

    if (sessionStr) {
      try {
        const sessionData = JSON.parse(sessionStr);
        const userEmail = sessionData.user?.email;

        if (userEmail) {
          // Si el email está en la lista de admins, mándalo al dashboard
          if (adminEmails.includes(userEmail)) {
            navigate("/dashboard");
          } else {
            // Si no, al marketplace
            navigate("/marketplace");
          }
        }
      } catch (error) {
        console.error("Error al leer la sesión:", error);
        // Si la sesión está corrupta, mejor limpiamos
        localStorage.removeItem("agroSession");
        sessionStorage.removeItem("agroSession");
      }
    }
  }, [navigate]);

  // --- HANDLERS ---

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}register`, {
        nombre: registerData.name,
        apellido: registerData.apellido,
        email: registerData.email,
        password: registerData.password
      });

      const data = response.data;
      if (data.token) {
        const sessionData = { token: data.token, user: data.user };
        localStorage.setItem("agroSession", JSON.stringify(sessionData));

        Swal.fire({
          title: "¡Registro exitoso!",
          text: "Usuario registrado correctamente 🌱",
          icon: "success",
          confirmButtonColor: "#2e7d32",
          background: "#162a33",
          color: "#ffffff"
        }).then(() => {
          if (adminEmails.includes(data.user.email)) navigate("/dashboard");
          else navigate("/marketplace");
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al registrar",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}login`, loginData);
      const data = response.data;

      if (data.token) {
        const sessionData = { token: data.token, user: data.user };
        if (rememberMe) {
            localStorage.setItem("agroSession", JSON.stringify(sessionData));
        }
        sessionStorage.setItem("agroSession", JSON.stringify(sessionData));

        Swal.fire({
          title: "Bienvenido 🌱",
          text: "Inicio de sesión exitoso",
          icon: "success",
          confirmButtonColor: "#2e7d32",
          background: "#162a33",
          color: "#ffffff"
        }).then(() => {
          if (adminEmails.includes(data.user.email)) navigate("/dashboard");
          else navigate("/marketplace");
        });
      }
    } catch (error: any) {
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Credenciales incorrectas",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    }
  };

  // 1. SOLICITAR CÓDIGO (Aquí está la corrección de la redirección)
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}forgot-password`, { email: recoveryEmail }).catch((error:any)=>{
        console.log(error)
      });
      
      Swal.fire({
        title: "Código enviado",
        text: "Revisa tu bandeja de entrada",
        icon: "success",
        confirmButtonColor: "#2e7d32",
        background: "#162a33",
        color: "#ffffff"
      });

      // CAMBIO DE VISTA AUTOMÁTICO AL TENER ÉXITO
      setView("reset"); 

    } catch (error: any) {
      console.log(error)
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al enviar correo",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    }
  };

  // 2. RESTABLECER CONTRASEÑA CON EL CÓDIGO
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}reset-password`, {
        email: recoveryEmail,
        token: resetData.code,
        password: resetData.newPassword
      });

      Swal.fire({
        title: "¡Éxito!",
        text: "Tu contraseña ha sido actualizada",
        icon: "success",
        confirmButtonColor: "#2e7d32",
        background: "#162a33",
        color: "#ffffff"
      });
      
      setLoginData({ ...loginData, email: recoveryEmail });
      setView("login"); // Regresar al login tras éxito
    } catch (error: any) {
      console.log(error)
      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Código inválido o expirado",
        icon: "error",
        confirmButtonColor: "#d33"
      });
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="logo-header">
          <img src={logo} alt="AgroTech Logo" />
          <h1>AgroTech</h1>
        </div>
        <nav className="login-nav">
          <Link to="/indexscreen">Inicio</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-left">
            <img src={logo} className="logo-main" alt="logo" />
            <h2>Bienvenido</h2>
            <p>Plataforma inteligente para gestión agrícola moderna</p>
          </div>

          <div className="auth-right">
            {(view === "login" || view === "register") && (
              <div className="form-toggle">
                <button
                  className={view === "login" ? "active" : ""}
                  onClick={() => setView("login")}
                  type="button"
                >
                  Iniciar Sesión
                </button>
                <button
                  className={view === "register" ? "active" : ""}
                  onClick={() => setView("register")}
                  type="button"
                >
                  Registrarse
                </button>
              </div>
            )}

            {/* VISTA LOGIN */}
            {view === "login" && (
              <form className="form active-form" onSubmit={handleLogin}>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="remember">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    Recordarme
                  </label>
                  <span onClick={() => setView("forgot")} className="forgot-link">
                    ¿Olvidaste tu contraseña?
                  </span>
                </div>
                <button type="submit" className="btn-primary">Iniciar Sesión</button>
              </form>
            )}

            {/* VISTA REGISTRO */}
            {view === "register" && (
              <form className="form active-form" onSubmit={handleRegister}>
                <div className="input-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    value={registerData.name}
                    onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Apellido</label>
                  <input
                    type="text"
                    value={registerData.apellido}
                    onChange={(e) => setRegisterData({ ...registerData, apellido: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">Crear Cuenta</button>
              </form>
            )}

            {/* VISTA OLVIDÉ MI CONTRASEÑA */}
            {view === "forgot" && (
              <form className="form active-form" onSubmit={handleForgotPassword}>
                <h3 style={{ color: 'white' }}>Recuperar Contraseña</h3>
                <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '15px' }}>
                    Ingresa tu correo para recibir un código de verificación.
                </p>
                <div className="input-group">
                  <label>Email de recuperación</label>
                  <input
                    type="email"
                    placeholder="Tu correo registrado"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">Enviar Código</button>
                <button type="button" className="btn-back" onClick={() => setView("login")}>Volver</button>
              </form>
            )}

           {/* VISTA INGRESAR CÓDIGO Y NUEVA CLAVE */}
            {view === "reset" && (
              <form className="form active-form" onSubmit={handleResetPassword}>
                <h3 style={{ color: 'white' }}>Restablecer Contraseña</h3>
                <p style={{ fontSize: '13px', color: '#cbd5e1', marginBottom: '15px' }}>
                    {/* Agregamos fallback para que no rompa la pantalla si recoveryEmail tarda en cargar */}
                    Introduce el código enviado a <b>{recoveryEmail || "tu correo"}</b>
                </p>
                <div className="input-group">
                  <label>Código de verificación</label>
                  <input
                    type="text"
                    placeholder="Ej: 123456"
                    // Aseguramos que el valor nunca sea undefined
                    value={resetData.code || ""} 
                    onChange={(e) => setResetData({ ...resetData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Nueva Contraseña</label>
                  <input
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    // Aseguramos que el valor nunca sea undefined
                    value={resetData.newPassword || ""}
                    onChange={(e) => setResetData({ ...resetData, newPassword: e.target.value })}
                    required
                  />
                </div>
                <button type="submit" className="btn-primary">Actualizar Contraseña</button>
                <button type="button" className="btn-back" onClick={() => setView("login")}>Cancelar</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;