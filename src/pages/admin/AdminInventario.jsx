"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { products } from "../../lib/product-data"
import "../../sitab.css"

export default function AdminInventario() {
  const navigate = useNavigate()
  const [inventory, setInventory] = useState(products)
  const [searchTerm, setSearchTerm] = useState("")

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    navigate("/")
  }

  const filtered = inventory.filter(
    (item) =>
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleUpdateStock = (id, newStock) => {
    setInventory(inventory.map((item) => (item.id === id ? { ...item, stock: Math.max(0, newStock) } : item)))
  }

  const lowStockItems = inventory.filter((item) => item.stock < 10)

  return (
    <div className="dashboard-container">
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
          <a href="/admin/inventario" className="nav-item active">
            📋 Inventario
          </a>
          <a href="/admin/reportes" className="nav-item">
            📈 Reportes
          </a>
        </nav>

        <button onClick={handleLogout} className="btn btn-danger" style={{ width: "100%", marginTop: "auto" }}>
          🚪 Cerrar Sesión
        </button>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <h1>Control de Inventario</h1>
        </header>

        {lowStockItems.length > 0 && (
          <div className="card alert-warning" style={{ marginBottom: "2rem" }}>
            <h3>⚠️ Alerta de Stock Bajo</h3>
            <p>{lowStockItems.length} productos con stock menor a 10 unidades</p>
          </div>
        )}

        <div className="card" style={{ marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
            style={{ marginBottom: "1rem" }}
          />

          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Código</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Stock Mínimo</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>{item.codigo}</td>
                    <td>{item.nombre}</td>
                    <td>{item.categoria}</td>
                    <td>
                      <input
                        type="number"
                        value={item.stock}
                        onChange={(e) => handleUpdateStock(item.id, Number.parseInt(e.target.value))}
                        style={{ width: "60px", padding: "4px" }}
                        min="0"
                      />
                    </td>
                    <td>10</td>
                    <td>
                      <span className={item.stock < 10 ? "text-danger" : "text-success"}>
                        {item.stock < 10 ? "Bajo" : "Normal"}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleUpdateStock(item.id, item.stock + 5)}
                        className="btn btn-small btn-success"
                      >
                        ➕ +5
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
