"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { products } from "../../lib/product-data"

export default function CajeraDashboard() {
  const navigate = useNavigate()
  const [currentSale, setCurrentSale] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "cajera") {
      navigate("/")
    }
    setUserName(localStorage.getItem("userName") || "Cajera")
  }, [navigate])

  const filteredProducts = searchTerm
    ? products.filter(
        (p) =>
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.codigo.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : products

  const addToSale = (productId) => {
    const product = products.find((p) => p.id === productId)
    if (!product || product.stock <= 0) {
      alert("Producto no disponible")
      return
    }

    const existingItem = currentSale.find((item) => item.id === productId)
    if (existingItem) {
      if (existingItem.cantidad < product.stock) {
        existingItem.cantidad++
      } else {
        alert("No hay suficiente stock")
        return
      }
    } else {
      currentSale.push({
        id: product.id,
        nombre: product.nombre,
        precio: product.precio,
        cantidad: 1,
        stock: product.stock,
      })
    }
    setCurrentSale([...currentSale])
  }

  const removeFromSale = (productId) => {
    setCurrentSale(currentSale.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, change) => {
    const item = currentSale.find((item) => item.id === productId)
    if (item) {
      item.cantidad += change
      if (item.cantidad <= 0) {
        removeFromSale(productId)
      } else if (item.cantidad > item.stock) {
        item.cantidad = item.stock
        alert("No hay suficiente stock")
      }
      setCurrentSale([...currentSale])
    }
  }

  const completeSale = () => {
    if (currentSale.length === 0) {
      alert("No hay productos en la venta")
      return
    }

    const total = currentSale.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

    const sales = JSON.parse(localStorage.getItem("sales") || "[]")
    sales.push({
      id: Date.now(),
      fecha: new Date().toISOString(),
      cajera: userName,
      items: currentSale,
      total: total,
    })
    localStorage.setItem("sales", JSON.stringify(sales))

    currentSale.forEach((item) => {
      const product = products.find((p) => p.id === item.id)
      if (product) {
        product.stock -= item.cantidad
      }
    })

    alert(`Venta completada por $${total.toFixed(2)}`)
    setCurrentSale([])
  }

  const cancelSale = () => {
    if (confirm("¿Estás seguro de cancelar esta venta?")) {
      setCurrentSale([])
    }
  }

  const logout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    navigate("/")
  }

  const total = currentSale.reduce((sum, item) => sum + item.precio * item.cantidad, 0)

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

      {/* CONTENIDO PRINCIPAL CON BOOTSTRAP GRID */}
      <div className="container py-4">
        <h1 className="mb-4">Registrar Venta</h1>

        {/* Grid principal: izquierda = productos, derecha = venta actual */}
        <div className="row g-4">
          {/* Columna izquierda: búsqueda + productos */}
          <div className="col-12 col-md-7 col-lg-8">
            <div className="card mb-3">
              <h2 className="mb-3">Buscar Producto</h2>
              <div className="d-flex gap-3">
                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  className="search-input form-control"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Lista de productos disponibles */}
            <div className="card">
              <h3 className="mb-3">Productos Disponibles</h3>
              <div
                className="row g-3"
                style={{ maxHeight: "500px", overflowY: "auto" }}
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="col-12 col-sm-6 col-lg-4"
                  >
                    <div
                      className="card h-100"
                      style={{ cursor: "pointer" }}
                      onClick={() => addToSale(product.id)}
                    >
                      <div style={{ textAlign: "center", padding: "1rem 0" }}>
                        <div
                          style={{ fontSize: "2rem", marginBottom: "0.5rem" }}
                        >
                          {product.icon}
                        </div>
                        <h4 style={{ marginBottom: "0.5rem" }}>
                          {product.nombre}
                        </h4>
                        <p
                          style={{
                            color: "var(--color-muted-foreground)",
                            fontSize: "0.875rem",
                            marginBottom: "0.5rem",
                          }}
                        >
                          Código: {product.codigo}
                        </p>
                        <p
                          style={{
                            fontSize: "1.25rem",
                            fontWeight: "bold",
                            color: "var(--color-primary)",
                          }}
                        >
                          ${product.precio.toFixed(2)}
                        </p>
                        <p
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--color-muted-foreground)",
                          }}
                        >
                          Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha: venta actual */}
          <div className="col-12 col-md-5 col-lg-4">
            <div className="card" style={{ position: "sticky", top: "100px" }}>
              <h2 className="mb-3">Venta Actual</h2>

              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  marginBottom: "1rem",
                }}
              >
                {currentSale.length === 0 ? (
                  <p
                    style={{
                      textAlign: "center",
                      color: "var(--color-muted-foreground)",
                      padding: "2rem",
                    }}
                  >
                    No hay productos agregados
                  </p>
                ) : (
                  currentSale.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.75rem",
                        borderBottom: "1px solid var(--color-border)",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600 }}>{item.nombre}</div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            color: "var(--color-muted-foreground)",
                          }}
                        >
                          ${item.precio.toFixed(2)} c/u
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="btn"
                          style={{ padding: "0.25rem 0.5rem" }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            minWidth: "30px",
                            textAlign: "center",
                          }}
                        >
                          {item.cantidad}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
                          className="btn"
                          style={{ padding: "0.25rem 0.5rem" }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromSale(item.id)}
                          className="btn"
                          style={{
                            padding: "0.25rem 0.5rem",
                            background: "#ef4444",
                            color: "white",
                          }}
                        >
                          ×
                        </button>
                      </div>
                      <div
                        style={{
                          minWidth: "80px",
                          textAlign: "right",
                          fontWeight: "bold",
                        }}
                      >
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div
                style={{
                  borderTop: "2px solid var(--color-border)",
                  paddingTop: "1rem",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                  }}
                >
                  <span>Subtotal:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  <span>Total:</span>
                  <span style={{ color: "var(--color-primary)" }}>
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={completeSale}
                  className="btn btn-primary"
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                >
                  Completar Venta
                </button>
                <button
                  onClick={cancelSale}
                  className="btn btn-outline"
                  style={{ width: "100%" }}
                >
                  Cancelar Venta
                </button>
              </div>

              <div className="card" style={{ marginTop: "1rem" }}>
                <a
                  href="/cajera/historial"
                  className="btn btn-secondary"
                  style={{ width: "100%", textAlign: "center" }}
                >
                  Ver Historial del Día
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
