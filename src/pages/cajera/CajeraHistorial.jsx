"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { fetchVentasHoy } from "../../lib/api"

export default function CajeraHistorial() {
  const navigate = useNavigate()
  const [salesHistory, setSalesHistory] = useState([])
  const [userName, setUserName] = useState("")
  const [totalSales, setTotalSales] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")


  /*useEffect(() => {
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
  }*/
 useEffect(() => {
  const userRole = localStorage.getItem("userRole")
  if (userRole !== "cajera") {
    navigate("/")
    return
  }

  setUserName(localStorage.getItem("userName") || "Cajera")

  const cargarVentas = async () => {
    try {
      const ventas = await fetchVentasHoy()
      setSalesHistory(ventas)

      const total = ventas.reduce((sum, v) => sum + v.total, 0)
      setTotalSales(total)
    } catch (err) {
      console.error(err)
      setError("No se pudieron cargar las ventas")
    } finally {
      setLoading(false)
    }
  }

  cargarVentas()
}, [navigate])


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
            <button 
              className="btn-logout"
              onClick={logout}
            >
              Cerrar Sesión
            </button>
        </div>
      </header>


      <div className="container" style={{ padding: "2rem 1rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h1 className="mb-0 titulo-interno">Historial de Ventas del Día</h1>
          {loading && (
            <p className="text-muted" style={{ marginBottom: "0.5rem" }}>
              Cargando ventas...
            </p>
          )}

          {error && (
            <p className="text-danger" style={{ marginBottom: "0.5rem" }}>
              {error}
            </p>
          )}

          <a href="/cajera" className="btn btn-primary btn-interno align-self-md-end">
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
