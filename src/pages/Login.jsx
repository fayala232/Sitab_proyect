"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../assets/SITABCANASTA.png"
import "../sitab.css"

export default function Login() {
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const [inputFocus, setInputFocus] = useState(null) // Para saber cuál input está seleccionado
  const [hover, setHover] = useState(false) // Para efecto del botón
  const [mensaje, setMensaje] = useState(""); // mensaje de error
  const navigate = useNavigate()

    const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje("");

    try {
      const respuesta = await fetch(
        "http://localhost/php-react/php-validar/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario, password }),
        }
      );

      const data = await respuesta.json();

      if (!data.ok) {
        setMensaje(data.mensaje || "Error en el inicio de sesión");
        return;
      }

      // Datos devueltos por PHP
      const { rol, nombre } = data.usuario;

      localStorage.setItem("userRole", rol);
      localStorage.setItem("userName", nombre);

      if (rol === "admin") {
        navigate("/admin");
      } else if (rol === "cajera") {
        navigate("/cajera");
      } else {
        setMensaje("Rol no reconocido en el sistema");
      }
    } catch (error) {
      console.error(error);
      setMensaje("No se pudo conectar con el servidor");
    }
  };
  return (
    <div className="login-container">
      <div className="login-card card">
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>
            <img src={Logo} alt="LOGO" style={{ width: "150px", height: "100px" }} />
          </div>
          <h1>SITAB</h1>
          <p>Punto de venta</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* USUARIO */}
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              onFocus={() => setInputFocus("usuario")}
              onBlur={() => setInputFocus(null)}
              style={{
                border: inputFocus === "usuario" ? "2px solid #007bff" : "1px solid #ccc",
                transition: "0.2s"
              }}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setInputFocus("password")}
              onBlur={() => setInputFocus(null)}
              style={{
                border: inputFocus === "password" ? "2px solid #007bff" : "1px solid #ccc",
                transition: "0.2s"
              }}
              required
            />
          </div>
          
           {mensaje && (
            <p className="text-danger" style={{ marginBottom: "0.5rem" }}>
              {mensaje}
            </p>
          )}

          {/* BOTÓN */}
          <button
            type="submit"
            className="btn btn-primary"
            style={{
              width: "100%",
              backgroundColor: hover ? "#a96500ff" : "#ea8807ff",
              transition: "0.2s"
            }}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="login-footer">
          <p style={{ fontSize: "0.875rem" }}>
            Contacta al administrador si tienes problemas para acceder
          </p>
        </div>
      </div>
    </div>
  )
}
