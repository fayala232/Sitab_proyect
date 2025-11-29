"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function CajeraHistorial() {
  const navigate = useNavigate()
  const [salesHistory, setSalesHistory] = useState([])
  const [userName, setUserName] = useState("")
  const [totalSales, setTotalSales] = useState(0)

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "cajera") {
      navigate("/")
    }
    setUserName(localStorage.getItem("userName") || "Cajera")
    loadSalesHistory()
  }, [navigate])

  const loadSalesHistory = () => {
    const sales = JSON.parse(localStorage.getItem("sales") || "[]")
    const today = new Date().toDateString()
    const todaySales = sales.filter((sale) => new Date(sale.fecha).toDateString() === today)

    const total = todaySales.reduce((sum, sale) => sum + sale.total, 0)
    setTotalSales(total)
    setSalesHistory(todaySales.reverse())
  }

  const logout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    navigate("/")
  }

  return (
    <div>
      {/* Header */}
      <nav className="navigation">
        <div className="nav-container">
          <a href="/cajera" className="logo">
            🛒 SITAB
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "var(--color-muted-foreground)" }}>{userName}</span>
            <button onClick={logout} className="btn btn-outline">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: "2rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1>Historial de Ventas del Día</h1>
          <a href="/cajera" className="btn btn-primary">
            Volver a Ventas
          </a>
        </div>

        <div className="card">
          <div
            style={{
              marginBottom: "1.5rem",
              padding: "1rem",
              background: "var(--color-muted)",
              borderRadius: "var(--radius)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3>Total de Ventas Hoy</h3>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "var(--color-primary)",
                  }}
                >
                  ${totalSales.toFixed(2)}
                </p>
              </div>
              <div>
                <h3>Número de Ventas</h3>
                <p
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                    color: "var(--color-secondary)",
                  }}
                >
                  {salesHistory.length}
                </p>
              </div>
            </div>
          </div>

          <div>
            {salesHistory.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--color-muted-foreground)",
                }}
              >
                No hay ventas registradas hoy
              </p>
            ) : (
              salesHistory.map((sale) => (
                <div
                  key={sale.id}
                  style={{
                    border: "1px solid var(--color-border)",
                    borderRadius: "var(--radius)",
                    padding: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div>
                      <strong>Venta #{sale.id}</strong>
                      <p style={{ fontSize: "0.875rem", color: "var(--color-muted-foreground)" }}>
                        {new Date(sale.fecha).toLocaleString("es-MX")}
                      </p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "var(--color-primary)",
                        }}
                      >
                        ${sale.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "var(--color-muted)",
                      padding: "0.75rem",
                      borderRadius: "var(--radius)",
                    }}
                  >
                    {sale.items.map((item) => (
                      <div
                        key={item.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "0.25rem",
                        }}
                      >
                        <span>
                          {item.nombre} x{item.cantidad}
                        </span>
                        <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
