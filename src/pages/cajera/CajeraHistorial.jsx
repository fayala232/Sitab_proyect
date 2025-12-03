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
      <header className="cajera-header">
        <div className="header-left">
          <div className="logo-section">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">SITAB</span>
          </div>
        </div>

        <div className="header-right">
          <span className="user-role">{userName}</span>
          <button className="btn-logout" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL CON BOOTSTRAP */}
      <div className="container py-4">
        {/* Título + botón volver con layout responsivo */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <h1 className="mb-0">Historial de Ventas del Día</h1>
          <a href="/cajera" className="btn btn-primary align-self-md-end">
            Volver a Ventas
          </a>
        </div>

        <div className="card p-3">
          {/* Resumen de totales con grid Bootstrap */}
          <div
            className="row g-3 mb-3 p-3"
            style={{
              background: "var(--color-muted)",
              borderRadius: "var(--radius)",
            }}
          >
            <div className="col-12 col-md-6">
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
            <div className="col-12 col-md-6">
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

          {/* Lista de ventas */}
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
              <div className="row g-3">
                {salesHistory.map((sale) => (
                  <div
                    key={sale.id}
                    className="col-12"
                  >
                    <div
                      style={{
                        border: "1px solid var(--color-border)",
                        borderRadius: "var(--radius)",
                        padding: "1rem",
                      }}
                    >
                      {/* Encabezado de la venta */}
                      <div className="d-flex flex-column flex-md-row justify-content-between mb-3">
                        <div>
                          <strong>Venta #{sale.id}</strong>
                          <p
                            style={{
                              fontSize: "0.875rem",
                              color: "var(--color-muted-foreground)",
                            }}
                          >
                            {new Date(sale.fecha).toLocaleString("es-MX")}
                          </p>
                        </div>
                        <div className="text-md-end mt-2 mt-md-0">
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

                      {/* Detalle de productos de la venta */}
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
                            className="d-flex justify-content-between mb-1"
                          >
                            <span>
                              {item.nombre} x{item.cantidad}
                            </span>
                            <span>${(item.precio * item.cantidad).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
