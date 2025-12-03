"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { products } from "../../lib/product-data"
import "../../sitab.css"

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [userName, setUserName] = useState("")

  useEffect(() => {
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
  const salestoday = "$0.00"

  return (
    <div className="admin-dashboard-wrapper">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-centered-wrapper d-flex justify-content-between align-items-center">
          <div className="header-left">
            <div className="logo-section">
              <span className="logo-icon">🛒</span>
              <span className="logo-text">SITAB</span>
            </div>
          </div>
          <div className="header-right d-flex align-items-center gap-3">
            <span className="user-role">{userName}</span>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-container">
          <h1 className="page-title mb-4">Panel de Administración</h1>

          {/* Grid de estadísticas con Bootstrap */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="stat-card h-100">
                <div className="stat-label">Ventas Hoy</div>
                <div className="stat-value">{salestoday}</div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="stat-card h-100">
                <div className="stat-label">Productos</div>
                <div className="stat-value" style={{ color: "#27ae60" }}>
                  {totalProducts}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="stat-card h-100">
                <div className="stat-label">Stock Bajo</div>
                <div className="stat-value" style={{ color: "#e74c3c" }}>
                  {lowStockProducts}
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="stat-card h-100">
                <div className="stat-label">Usuarios</div>
                <div className="stat-value">3</div>
              </div>
            </div>
          </div>

          {/* Grid de módulos con Bootstrap */}
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-3">
              <div
                className="feature-card h-100"
                onClick={() => navigate("/admin/productos")}
              >
                <div className="feature-icon">📦</div>
                <h3>Gestión de Productos</h3>
                <p>Agregar, editar y eliminar productos</p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div
                className="feature-card h-100"
                onClick={() => navigate("/admin/inventario")}
              >
                <div className="feature-icon">📊</div>
                <h3>Inventario</h3>
                <p>Ver stock y alertas de productos</p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div
                className="feature-card h-100"
                onClick={() => navigate("/admin/usuarios")}
              >
                <div className="feature-icon">👥</div>
                <h3>Gestión de Usuarios</h3>
                <p>Administrar empleados y permisos</p>
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <div
                className="feature-card h-100"
                onClick={() => navigate("/admin/reportes")}
              >
                <div className="feature-icon">📈</div>
                <h3>Reportes</h3>
                <p>Ventas, ingresos y estadísticas</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
