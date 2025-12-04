"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
//import { products } from "../../lib/product-data"
import "../../sitab.css"
import { fetchProductos } from "../../lib/api"; // <-- CAMBIO: ahora leemos de PHP

export default function AdminDashboard() {
  const [userName, setUserName] = useState("Administrador");
  const [products, setProducts] = useState([]);      // <-- productos desde la BD
  const [loading, setLoading] = useState(true);      // <-- estado de carga
  const [error, setError] = useState("");            // <-- mensaje de error si falla
  const navigate = useNavigate()
  //const [userName, setUserName] = useState("")

 /* useEffect(() => {
    const name = localStorage.getItem("userName")
    setUserName(name || "Administrador")
  }, [])

  
  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    navigate("/")
  }

  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock < 10).length
  //const totalValue = products.reduce((sum, p) => sum + p.precio * p.stock, 0).toFixed(2)
  const salestoday = "$0.00"*/
// Cargar nombre del usuario y productos desde la BD
   useEffect(() => {
    const name = localStorage.getItem("userName")
    setUserName(name || "Administrador")

    const cargarProductos = async () => {
      try {
        const prods = await fetchProductos()
        setProducts(prods)
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

  // --- Métricas calculadas a partir de los productos de la BD ---
  const totalProducts = products.length
  const lowStockProducts = products.filter((p) => p.stock < 10).length
  const salestoday = "$0.00"


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
              <div className="stat-value">{salestoday}</div>
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
              <div className="stat-value">3</div>
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
