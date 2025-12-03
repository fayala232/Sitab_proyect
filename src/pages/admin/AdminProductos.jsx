"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { products } from "../../lib/product-data"
import "../../sitab.css"

export default function AdminProductos() {
  const navigate = useNavigate()
  const [productList, setProductList] = useState(products)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    precio: "",
    stock: "",
    categoria: "",
    proveedor: "",
  })

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    navigate("/")
  }

  const categories = [...new Set(productList.map((p) => p.categoria))]

  const filtered = productList.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.codigo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || p.categoria === filterCategory
    return matchesSearch && matchesCategory
  })

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData(product)
    setShowModal(true)
  }

  const handleSave = () => {
    if (editingProduct) {
      setProductList(productList.map((p) => (p.id === editingProduct.id ? { ...formData, id: p.id } : p)))
    } else {
      setProductList([
        ...productList,
        { ...formData, id: Math.max(...productList.map((p) => p.id)) + 1 },
      ])
    }
    setShowModal(false)
    setFormData({ codigo: "", nombre: "", precio: "", stock: "", categoria: "", proveedor: "" })
    setEditingProduct(null)
  }

  const handleDelete = (id) => {
    setProductList(productList.filter((p) => p.id !== id))
  }

  return (
    <div className="admin-dashboard-wrapper">
      {/* Header global admin */}
      <header className="admin-header">
        <div className="admin-centered-wrapper d-flex justify-content-between align-items-center">
          <div className="header-left">
            <div className="logo-section">
              <span className="logo-icon">🛒</span>
              <span className="logo-text">SITAB</span>
            </div>
          </div>
          <div className="header-right d-flex align-items-center gap-3">
            <span className="user-role">Administrador</span>
            <button onClick={handleLogout} className="btn-logout">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-container">
          {/* Header interno responsivo */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
            <h1 className="page-title mb-0">Gestión de Productos</h1>
            <div className="d-flex flex-wrap gap-2">
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setFormData({
                    codigo: "",
                    nombre: "",
                    precio: "",
                    stock: "",
                    categoria: "",
                    proveedor: "",
                  })
                  setShowModal(true)
                }}
                className="btn btn-success"
              >
                ➕ Agregar Producto
              </button>
              <button onClick={() => navigate("/admin")} className="btn btn-secondary">
                Volver
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="card mb-4">
            <div className="row g-3 mb-3">
              <div className="col-12 col-md-8">
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field w-100"
                />
              </div>
              <div className="col-12 col-md-4">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="input-field w-100"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tabla */}
            <div style={{ overflowX: "auto" }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Categoría</th>
                    <th>Proveedor</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <tr key={product.id}>
                      <td>{product.codigo}</td>
                      <td>{product.nombre}</td>
                      <td>${product.precio.toFixed(2)}</td>
                      <td>
                        <span className={product.stock < 10 ? "text-danger" : "text-success"}>
                          {product.stock}
                        </span>
                      </td>
                      <td>{product.categoria}</td>
                      <td>{product.proveedor}</td>
                      <td>
                        <button
                          onClick={() => handleEdit(product)}
                          className="btn btn-small btn-primary me-2"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn btn-small btn-danger"
                        >
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h2>{editingProduct ? "Editar Producto" : "Nuevo Producto"}</h2>
                  <button onClick={() => setShowModal(false)} className="btn-close">
                    ✕
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>Código</label>
                    <input
                      type="text"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="form-group">
                    <label>Categoría</label>
                    <input
                      type="text"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      className="input-field"
                    />
                  </div>
                  <div className="form-group">
                    <label>Precio</label>
                    <input
                      type="number"
                      value={formData.precio}
                      onChange={(e) =>
                        setFormData({ ...formData, precio: Number.parseFloat(e.target.value) })
                      }
                      className="input-field"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({ ...formData, stock: Number.parseInt(e.target.value) })
                      }
                      className="input-field"
                    />
                  </div>
                  <div className="form-group">
                    <label>Proveedor</label>
                    <input
                      type="text"
                      value={formData.proveedor}
                      onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                      className="input-field"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button onClick={() => setShowModal(false)} className="btn btn-secondary">
                    Cancelar
                  </button>
                  <button onClick={handleSave} className="btn btn-primary">
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
