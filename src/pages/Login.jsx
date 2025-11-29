"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../assets/SITABCANASTA.png"
import "../sitab.css"

export default function Login() {
  const [usuario, setUsuario] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()

    if (usuario === "admin" && password === "admin123") {
      localStorage.setItem("userRole", "admin")
      localStorage.setItem("userName", "Administrador")
      navigate("/admin")
    } else if (usuario.startsWith("caja") && password === "caja123") {
      localStorage.setItem("userRole", "cajera")
      localStorage.setItem("userName", "Cajera")
      navigate("/cajera")
    } else {
      alert("Usuario o contraseña incorrectos")
    }
  }

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
          <div className="form-group">
            <label htmlFor="usuario">Usuario</label>
            <input type="text" id="usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%" }}>
            Iniciar Sesión
          </button>
        </form>

        <div className="login-footer">
          <p style={{ fontSize: "0.875rem" }}>Contacta al administrador si tienes problemas para acceder</p>
        </div>
      </div>
    </div>
  )
}
