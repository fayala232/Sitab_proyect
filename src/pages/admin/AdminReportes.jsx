"use client"

//import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { products } from "../../lib/product-data"
import "../../sitab.css"

export default function AdminReportes() {
  const navigate = useNavigate()
  //const [filterType, setFilterType] = useState("todos")

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    navigate("/")
  }

  const totalProducts = products.length
  const totalValue = products.reduce((sum, p) => sum + p.precio * p.stock, 0)
  const averagePrice = (products.reduce((sum, p) => sum + p.precio, 0) / totalProducts).toFixed(2)
  const averageStock = (products.reduce((sum, p) => sum + p.stock, 0) / totalProducts).toFixed(2)
  const lowStockCount = products.filter((p) => p.stock < 10).length

  const byCategory = {}
  products.forEach((p) => {
    byCategory[p.categoria] = (byCategory[p.categoria] || 0) + 1
  })

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>SITAB</h2>
          <p>Admin Panel</p>
        </div>

        <nav className="sidebar-nav">
          <a href="/admin" className="nav-item">
            📊 Dashboard
          </a>
          <a href="/admin/productos" className="nav-item">
            📦 Productos
          </a>
          <a href="/admin/usuarios" className="nav-item">
            👥 Usuarios
          </a>
          <a href="/admin/inventario" className="nav-item">
            📋 Inventario
          </a>
          <a href="/admin/reportes" className="nav-item active">
            📈 Reportes
          </a>
        </nav>

        <button
          onClick={handleLogout}
          className="btn btn-danger"
          style={{ width: "100%", marginTop: "auto" }}
        >
          🚪 Cerrar Sesión
        </button>
      </aside>

      {/* Contenido */}
      <main className="main-content">
        <header className="top-bar mb-4">
          <h1>Reportes y Análisis</h1>
        </header>

        {/* Grid de estadísticas */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stats-card h-100">
              <h3>Productos Totales</h3>
              <p className="big-number">{totalProducts}</p>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stats-card h-100">
              <h3>Valor Total Inventario</h3>
              <p className="big-number">${totalValue.toFixed(2)}</p>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stats-card h-100">
              <h3>Precio Promedio</h3>
              <p className="big-number">${averagePrice}</p>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <div className="card stats-card h-100">
              <h3>Stock Promedio</h3>
              <p className="big-number">{averageStock}</p>
            </div>
          </div>
        </div>

        {/* Por categoría */}
        <div className="card mt-3">
          <h2>Productos por Categoría</h2>
          <div className="summary-table">
            {Object.entries(byCategory).map(([category, count]) => (
              <div key={category} className="summary-row">
                <span>{category}</span>
                <strong>{count} productos</strong>
              </div>
            ))}
          </div>
        </div>

        {/* Alertas */}
        <div className="card mt-3">
          <h2>Alertas de Inventario</h2>
          <div className="summary-table">
            <div className="summary-row">
              <span>Productos con stock bajo</span>
              <strong className="text-danger">{lowStockCount}</strong>
            </div>
            <div className="summary-row">
              <span>Productos sin stock</span>
              <strong>{products.filter((p) => p.stock === 0).length}</strong>
            </div>
            <div className="summary-row">
              <span>Tasa de rotación promedio</span>
              <strong>65%</strong>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
