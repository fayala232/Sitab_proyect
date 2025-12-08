"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../../sitab.css"
import { fetchProductos, fetchVentasHoy, fetchUsuarios  } from "../../lib/api";

export default function AdminDashboard() {
  const [userName, setUserName] = useState("Administrador");
  const [products, setProducts] = useState([]);      
  const [loading, setLoading] = useState(true);      
  const [error, setError] = useState("");            
  const navigate = useNavigate()

  const [salesToday, setSalesToday] = useState(0) 
  const [totalUsers, setTotalUsers] = useState(0) 
   useEffect(() => {
    const storedName = localStorage.getItem("userName")
    setUserName(storedName || "Administrador")

    const cargarProductos = async () => {
      try {
        const [prods, ventas, usuarios] = await Promise.all([
          fetchProductos(),
          fetchVentasHoy(),
          fetchUsuarios(),
        ])

        setProducts(prods)

        const totalVentasHoy = ventas.reduce((sum, v) => sum + v.total, 0)
        setSalesToday(totalVentasHoy)

        setTotalUsers(usuarios.length)
      } catch (err) {
        console.error(err)
        setError("No se pudieron cargar los productos")
      } finally {
        setLoading(false)
      }
    }

    cargarProductos()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock < 10).length


  return (
    <div className="admin-dashboard-wrapper">
      <header className="admin-header">
        <div className="admin-centered-wrapper">
        <div className="header-left">
          <div className="logo-section">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">SITAB</span>
          </div>
        </div>
        <div className="header-right">
          <span className="user-role">{userName}</span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-container">
          <h1 className="mb-0 titulo-interno">Panel de Administración</h1>

          {loading && (
          <p className="text-muted" style={{ marginBottom: "1rem" }}>
            Cargando productos...
          </p>
          )}

          {error && (
          <p className="text-danger" style={{ marginBottom: "1rem" }}>
          {error}
          </p>
          )}

          <div className="stats-grid-4">
            <div className="stat-card">
              <div className="stat-label">Ventas Hoy</div>
              <div className="stat-value">${salesToday.toFixed(2)}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Productos</div>
              <div className="stat-value" style={{ color: "#27ae60" }}>
                {totalProducts}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Stock Bajo</div>
              <div className="stat-value" style={{ color: "#e74c3c" }}>
                {lowStockProducts}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Usuarios</div>
              <div className="stat-value">{totalUsers}</div>
            </div>
          </div>

          <div className="features-grid">
            <div className="feature-card" onClick={() => navigate("/admin/productos")}>
              <div className="feature-icon">📦</div>
              <h3>Gestión de Productos</h3>
              <p>Agregar, editar y eliminar productos</p>
            </div>

            <div className="feature-card" onClick={() => navigate("/admin/inventario")}>
              <div className="feature-icon">📊</div>
              <h3>Inventario</h3>
              <p>Ver stock y alertas de productos</p>
            </div>

            <div className="feature-card" onClick={() => navigate("/admin/usuarios")}>
              <div className="feature-icon">👥</div>
              <h3>Gestión de Usuarios</h3>
              <p>Administrar empleados y permisos</p>
            </div>

            <div className="feature-card" onClick={() => navigate("/admin/reportes")}>
              <div className="feature-icon">📈</div>
              <h3>Reportes</h3>
              <p>Ventas, ingresos y estadísticas</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
