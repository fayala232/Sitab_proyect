"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../../sitab.css"

export default function AdminUsuarios() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([
    { id: 1, usuario: "admin", nombre: "Administrador", rol: "admin", estado: "activo" },
    { id: 2, usuario: "caja1", nombre: "Cajera 1", rol: "cajera", estado: "activo" },
    { id: 3, usuario: "caja2", nombre: "Cajera 2", rol: "cajera", estado: "activo" },
  ])
  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({ usuario: "", nombre: "", rol: "cajera", estado: "activo" })

  const handleLogout = () => {
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    navigate("/")
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData(user)
    setShowModal(true)
  }

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map((u) => (u.id === editingUser.id ? { ...formData, id: u.id } : u)))
    } else {
      setUsers([
        ...users,
        { ...formData, id: Math.max(...users.map((u) => u.id), 0) + 1 },
      ])
    }
    setShowModal(false)
    setFormData({ usuario: "", nombre: "", rol: "cajera", estado: "activo" })
    setEditingUser(null)
  }

  const handleDelete = (id) => {
    if (id !== 1) setUsers(users.filter((u) => u.id !== id))
  }

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
          <a href="/admin/usuarios" className="nav-item active">
            👥 Usuarios
          </a>
          <a href="/admin/inventario" className="nav-item">
            📋 Inventario
          </a>
          <a href="/admin/reportes" className="nav-item">
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
        <header className="top-bar d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
          <h1 className="mb-0">Gestión de Usuarios</h1>
          <div className="user-info">
            <button
              onClick={() => {
                setEditingUser(null)
                setFormData({ usuario: "", nombre: "", rol: "cajera", estado: "activo" })
                setShowModal(true)
              }}
              className="btn btn-success"
            >
              ➕ Nuevo Usuario
            </button>
          </div>
        </header>

        <div className="card">
          <div style={{ overflowX: "auto" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.usuario}</td>
                    <td>{user.nombre}</td>
                    <td>{user.rol}</td>
                    <td>
                      <span className={user.estado === "activo" ? "text-success" : "text-danger"}>
                        {user.estado}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleEdit(user)}
                        className="btn btn-small btn-primary me-2"
                      >
                        ✏️ Editar
                      </button>
                      {user.id !== 1 && (
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="btn btn-small btn-danger"
                        >
                          🗑️ Eliminar
                        </button>
                      )}
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
                <h2>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</h2>
                <button onClick={() => setShowModal(false)} className="btn-close">
                  ✕
                </button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label>Usuario</label>
                  <input
                    type="text"
                    value={formData.usuario}
                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                    className="input-field"
                    disabled={!!editingUser}
                  />
                </div>
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label>Rol</label>
                  <select
                    value={formData.rol}
                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    className="input-field"
                  >
                    <option value="admin">Administrador</option>
                    <option value="cajera">Cajera</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    className="input-field"
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
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
      </main>
    </div>
  )
}
