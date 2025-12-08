import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { fetchProductos, createProducto, updateProducto, deleteProducto } from "../../lib/api"   // <-- en vez de products del JSON
import "../../sitab.css"

const iconOptions = [
  { label: "Arroz Blanco 1kg", value: "/productos/Arroz_Blanco.png" },
  { label: "Frijol Pinto 1kg", value: "/productos/Frijol_pinto.png" },
  { label: "Azúcar Morena 1kg", value: "/productos/Azucar_Morena.png" },
  { label: "Leche Entera 1L", value: "/productos/Leche_Entera.png"},
  { label: "Huevo Blanco 12 pzas", value: "/productos/Huevos_12pzas.png"},
]

export default function AdminProductos() {
  const navigate = useNavigate()
  const [productList, setProductList] = useState([])       
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [loading, setLoading] = useState(true)            
  const [error, setError] = useState("")                 
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    codigo: "",
    nombre: "",
    precio: "",
    stock: "",
    categoria: "",
    proveedor: "",
    icon: "",
  })

  useEffect(() => {
  const cargarProductos = async () => {
    try {
      const prods = await fetchProductos()
      setProductList(prods)
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

  const handleSave = async () => {
  const productoData = {
    id: editingProduct?.id,
    codigo: formData.codigo,
    nombre: formData.nombre,
    precio: parseFloat(formData.precio),
    stock: parseInt(formData.stock),
    categoria: formData.categoria,
    proveedor: formData.proveedor, 
    icon: formData.icon,   
  }

  try {
    if (editingProduct) {
      await updateProducto(productoData)

      setProductList(prev =>
        prev.map(p => p.id === productoData.id ? { ...p, ...productoData } : p)
      )
    } else {
      const nuevo = await createProducto(productoData)
      setProductList(prev => [...prev, nuevo])
    }

    setShowModal(false)
    setEditingProduct(null)
  } catch (err) {
    alert(err.message)
  }
}


  const handleDelete = async (id) => {
  if (!window.confirm("¿Eliminar producto?")) return

  try {
    await deleteProducto(id)
    setProductList(prev => prev.filter(p => p.id !== id))
  } catch (err) {
    alert(err.message)
  }
}



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
          <span className="user-role">Administrador</span>
          <button onClick={handleLogout} className="btn-logout">
            Cerrar Sesión
          </button>
        </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
            <h1 className="page-title">Gestión de Productos</h1>
            {loading && (
              <p className="text-muted" style={{ marginBottom: "0.5rem" }}>
                Cargando productos...
              </p>
              )}

            {error && (
              <p className="text-danger" style={{ marginBottom: "0.5rem" }}>
                {error}
              </p>
              )}

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                onClick={() => {
                  setEditingProduct(null)
                  setFormData({ codigo: "", nombre: "", precio: "", stock: "", categoria: "", proveedor: "", icon: "" })
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

          <div className="card" style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field"
                style={{ flex: 1 }}
              />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="input-field"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

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
                        <span className={product.stock < 10 ? "text-danger" : "text-success"}>{product.stock}</span>
                      </td>
                      <td>{product.categoria}</td>
                      <td>{product.proveedor}</td>
                      <td>
                        <button onClick={() => handleEdit(product)} className="btn btn-small btn-primary">
                          ✏️ Editar
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="btn btn-small btn-danger">
                          🗑️ Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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
                      onChange={(e) => setFormData({ ...formData, precio: Number.parseFloat(e.target.value) })}
                      className="input-field"
                      step="0.01"
                    />
                  </div>
                  <div className="form-group">
                    <label>Stock</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) })}
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
                  <div className="form-group">
                      <label>Imagen  del producto</label>
                      <select
                        className="input-field"
                        value={formData.icon}
                         onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      >
                      <option value="">-- Selecciona una imagen --</option>
                         {iconOptions.map((opt) => (
                       <option key={opt.value} value={opt.value}>
                          {opt.label}
                      </option>
                          ))}
                      </select>
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
