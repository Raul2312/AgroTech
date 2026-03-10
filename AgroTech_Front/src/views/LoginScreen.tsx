import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import "../css/login.css";
import logo from "../assets/img/agro.png";
import axios from "axios";

const API_URL = "http://localhost:8000/api";

const Login = () => {

  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

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

  const [rememberMe, setRememberMe] = useState<boolean>(false);

  const adminEmails = [
    "22cg0095@itsncg.edu.mx",
    "sebastiannn231@gmail.com",
    "raulmadridflores202@gmail.com"
  ];

  // AUTO LOGIN
  useEffect(() => {

    const session =
      localStorage.getItem("agroSession") ||
      sessionStorage.getItem("agroSession");

    if (session) {
      navigate("/marketplace");
    }

  }, [navigate]);

  // REGISTRO
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const response = await axios.post(`${API_URL}/register`, {
        nombre: registerData.name,
        apellido: registerData.apellido,
        email: registerData.email,
        password: registerData.password
      });

      const data = response.data;

      if (data.token) {

        const sessionData = {
          token: data.token,
          user: data.user
        };

        localStorage.setItem("agroSession", JSON.stringify(sessionData));

        Swal.fire({
          title: "¡Registro exitoso!",
          text: "Usuario registrado correctamente 🌱",
          icon: "success",
          confirmButtonColor: "#2e7d32",
          background: "#162a33",
          color: "#ffffff"
        }).then(() => {

          if (adminEmails.includes(data.user.email)) {
            navigate("/dashboard");
          } else {
            navigate("/marketplace");
          }

        });

      }

    } catch (error: any) {

      console.error(error);

      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Error al registrar",
        icon: "error",
        confirmButtonColor: "#d33"
      });

    }
  };

  // LOGIN
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {

      const response = await axios.post(`${API_URL}/login`, loginData);

      const data = response.data;

      if (data.token) {

        const sessionData = {
          token: data.token,
          user: data.user
        };

        if (rememberMe) {
          localStorage.setItem("agroSession", JSON.stringify(sessionData));
        } else {
          sessionStorage.setItem("agroSession", JSON.stringify(sessionData));
        }

        Swal.fire({
          title: "Bienvenido 🌱",
          text: "Inicio de sesión exitoso",
          icon: "success",
          confirmButtonColor: "#2e7d32",
          background: "#162a33",
          color: "#ffffff"
        }).then(() => {

          if (adminEmails.includes(data.user.email)) {

            navigate("/dashboard");

          } else {

            navigate("/marketplace");

          }

        });

      }

    } catch (error: any) {

      console.error(error);

      Swal.fire({
        title: "Error",
        text: error.response?.data?.message || "Credenciales incorrectas",
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

            <div className="form-toggle">
              <button
                className={isLogin ? "active" : ""}
                onClick={() => setIsLogin(true)}
                type="button"
              >
                Iniciar Sesión
              </button>

              <button
                className={!isLogin ? "active" : ""}
                onClick={() => setIsLogin(false)}
                type="button"
              >
                Registrarse
              </button>
            </div>

            {isLogin ? (

              <form className="form active-form" onSubmit={handleLogin}>

                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <label className="remember">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Recordarme
                </label>

                <button type="submit" className="btn-primary">
                  Iniciar Sesión
                </button>

              </form>

            ) : (

              <form className="form active-form" onSubmit={handleRegister}>

                <div className="input-group">
                  <label>Nombre</label>
                  <input
                    type="text"
                    placeholder="Juan"
                    value={registerData.name}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Apellido</label>
                  <input
                    type="text"
                    placeholder="Pérez"
                    value={registerData.apellido}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, apellido: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="input-group">
                  <label>Contraseña</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, password: e.target.value })
                    }
                    required
                  />
                </div>

                <button type="submit" className="btn-primary">
                  Crear Cuenta
                </button>

              </form>

            )}

          </div>
        </div>
      </div>

    </div>
  );
};

export default Login;