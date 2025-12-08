"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { fetchProductos, actualizarStock, registrarVenta } from "../../lib/api"

export default function CajeraDashboard() {
  const navigate = useNavigate()
  const [currentSale, setCurrentSale] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [userName, setUserName] = useState("")
  const [products, setProducts] = useState([])   
  const [loading, setLoading] = useState(true)   
  const [error, setError] = useState("")         

  useEffect(() => {
    const userRole = localStorage.getItem("userRole")
    if (userRole !== "cajera") {
      navigate("/")
      return
    }

    setUserName(localStorage.getItem("userName") || "Cajera")

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
  const completeSale = async () => {
    if (currentSale.length === 0) {
      alert("No hay productos en la venta")
      return
    }

    try {
      const itemsParaActualizar = currentSale.map((item) => ({
        id: item.id,
        cantidad: item.cantidad,
      }))
      await actualizarStock(itemsParaActualizar)

      const total = currentSale.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      )

      await registrarVenta({
        cajera: userName,
        items: currentSale.map((item) => ({
          id: item.id,
          nombre: item.nombre,
          cantidad: item.cantidad,
          precio: item.precio,
        })),
        total,
      })

      const sales = JSON.parse(localStorage.getItem("sales") || "[]")
      sales.push({
        id: Date.now(),
        fecha: new Date().toISOString(),
        cajera: userName,
        items: currentSale,
        total: total,
      })
      localStorage.setItem("sales", JSON.stringify(sales))

      setProducts((prev) =>
        prev.map((p) => {
          const vendido = currentSale.find((item) => item.id === p.id)
          if (!vendido) return p
          return { ...p, stock: p.stock - vendido.cantidad }
        })
      )

      alert(`Venta completada por $${total.toFixed(2)}`)
      setCurrentSale([])
    } catch (err) {
      console.error(err)
      alert(err.message || "Error al completar la venta")
    }
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
          <button
            className="btn-logout"
            onClick={logout}
          >
            Cerrar Sesión
          </button>
        </div>
      </header>


      <div className="container" style={{ padding: "2rem 1rem" }}>
        <h1 className="mb-0 titulo-interno">Registrar Venta</h1>

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

        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "2rem" }}>
          {/* Panel de búsqueda y productos */}
          <div>
            <div className="card" style={{ marginBottom: "1.5rem" }}>
              <h2 style={{ marginBottom: "1rem" }}>Buscar Producto</h2>
              <div style={{ display: "flex", gap: "1rem" }}>
                <input
                  type="text"
                  placeholder="Buscar por nombre o código..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "12px",
                    border: "1px solid #ddd",
                    background: "white",
                    color: "#333",
                    fontSize: "1rem",
                    outline: "none",
                    transition: "all 0.2s ease",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  }}
                  onFocus={(e) => {
                    e.target.style.boxShadow = "0 0 4px rgba(255,140,0,0.6)";
                    e.target.style.borderColor = "var(--color-primary)";
                  }}
                  onBlur={(e) => {
                    e.target.style.boxShadow = "0 2px 6px rgba(0,0,0,0.05)";
                    e.target.style.borderColor = "#ddd";
                  }}
                />
              </div>
            </div>

            {/* Lista de productos disponibles */}
            <div className="card">
              <h3 style={{ marginBottom: "1rem" }}>Productos Disponibles</h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "1rem",
                  maxHeight: "500px",
                  overflowY: "auto",
                  padding: "0.5rem",
                }}
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => addToSale(product.id)}
                    style={{
                      background: "#fff",
                      borderRadius: "12px",
                      padding: "1rem",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                      textAlign: "center",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "transform 0.15s ease, boxShadow 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.03)"
                      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.16)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)"
                      e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.08)"
                    }}
                  >
                    <img
                      src={product.icon || "/productos/default.png"}
                      alt={product.nombre}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "contain",
                        marginBottom: "0.5rem",
                      }}
                    />

                    <h4
                      style={{
                        marginBottom: "0.25rem",
                        fontSize: "1rem",
                        fontWeight: "600",
                        color: "#333",
                      }}
                    >
                      {product.nombre}
                    </h4>

                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "gray",
                        marginBottom: "0.25rem",
                      }}
                    >
                      Código: {product.codigo}
                    </p>

                    <p
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: "bold",
                        marginBottom: "0.25rem",
                        color: "var(--color-primary)",
                      }}
                    >
                      ${product.precio.toFixed(2)}
                    </p>

                    <p
                      style={{
                        fontSize: "0.85rem",
                        color: product.stock > 10 ? "#27ae60" : "#e74c3c",
                      }}
                    >
                      Stock: {product.stock}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Panel de venta actual */}
          <div>
            <div className="card" style={{ position: "sticky", top: "100px" }}>
              <h2 style={{ marginBottom: "1rem" }}>Venta Actual</h2>

              <div style={{ maxHeight: "300px", overflowY: "auto", marginBottom: "1rem" }}>
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
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="btn"
                          style={{ padding: "0.25rem 0.5rem" }}
                        >
                          -
                        </button>
                        <span style={{ minWidth: "30px", textAlign: "center" }}>{item.cantidad}</span>
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
                      <div style={{ minWidth: "80px", textAlign: "right", fontWeight: "bold" }}>
                        ${(item.precio * item.cantidad).toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={{ borderTop: "2px solid var(--color-border)", paddingTop: "1rem", marginTop: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
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
                  <span style={{ color: "var(--color-primary)" }}>${total.toFixed(2)}</span>
                </div>

                <button
                  onClick={completeSale}
                  className="btn btn-primary"
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                >
                  Completar Venta
                </button>
                <button onClick={cancelSale} className="btn btn-outline" style={{ width: "100%" }}>
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
