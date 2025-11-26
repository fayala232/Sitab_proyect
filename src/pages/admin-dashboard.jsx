import { useEffect, useState } from "react";
import "./styles.css";

export default function AdminDashboard() {
  const [ventasHoy, setVentasHoy] = useState(0);
  const [totalProductos, setTotalProductos] = useState(0);
  const [stockBajo, setStockBajo] = useState(0);
  const [totalUsuarios, setTotalUsuarios] = useState(0);
  const [userName, setUserName] = useState("");

  // Cargar datos del dashboard
  useEffect(() => {
    // Validar rol
    if (localStorage.getItem("userRole") !== "admin") {
      window.location.href = "login.html";
      return;
    }

    setUserName(localStorage.getItem("userName"));

    loadDashboardStats();
  }, []);

  const loadDashboardStats = () => {
    // === VENTAS HOY ===
    const sales = JSON.parse(localStorage.getItem("sales") || "[]");
    const today = new Date().toDateString();

    const todaySales = sales.filter(
      (sale) => new Date(sale.fecha).toDateString() === today
    );

    const totalToday = todaySales.reduce((sum, sale) => sum + sale.total, 0);
    setVentasHoy(totalToday);

    // === PRODUCTOS (usa products de pos-data.js) ===
    if (window.products) {
      setTotalProductos(window.products.length);

      const lowStock = window.products.filter((p) => p.stock < 10).length;
      setStockBajo(lowStock);
    }

    // === USUARIOS ===
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    setTotalUsuarios(users.length + 1); // +1 admin
  };

  const logout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    window.location.href = "login.html";
  };

  return (
    <>
      {/* NAV */}
      <nav className="navigation">
        <div className="nav-container">
          <a href="admin-dashboard.html" className="logo">
            <img
              src="img/SITAB CANASTA.png"
              alt="logo"
              style={{ width: "90px", height: "50px" }}
            />
            SITAB
          </a>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ color: "var(--color-muted-foreground)" }}>
              {userName}
            </span>
            <button
              onClick={logout}
              className="btn btn-outline"
              style={{ padding: "0.5rem 1rem" }}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </nav>

      {/* CONTENIDO */}
      <div className="container" style={{ padding: "2rem 1rem" }}>
        <h1 style={{ marginBottom: "2rem" }}>Panel de Administración</h1>

        {/* ESTADÍSTICAS */}
        <div className="grid grid-4" style={{ marginBottom: "2rem" }}>
          <div className="card">
            <h3
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
              }}
            >
              Ventas Hoy
            </h3>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "var(--color-primary)",
              }}
            >
              ${ventasHoy.toFixed(2)}
            </p>
          </div>

          <div className="card">
            <h3
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
              }}
            >
              Productos
            </h3>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "var(--color-secondary)",
              }}
            >
              {totalProductos}
            </p>
          </div>

          <div className="card">
            <h3
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
              }}
            >
              Stock Bajo
            </h3>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "#ef4444",
              }}
            >
              {stockBajo}
            </p>
          </div>

          <div className="card">
            <h3
              style={{
                color: "var(--color-muted-foreground)",
                fontSize: "0.875rem",
                marginBottom: "0.5rem",
              }}
            >
              Usuarios
            </h3>
            <p
              style={{
                fontSize: "2rem",
                fontWeight: "bold",
                color: "var(--color-primary)",
              }}
            >
              {totalUsuarios}
            </p>
          </div>
        </div>

        {/* MENÚ DE OPCIONES */}
        <div className="grid grid-3">
          <a
            href="admin-productos.html"
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
              <h2 style={{ marginBottom: "0.5rem" }}>Gestión de Productos</h2>
              <p style={{ color: "var(--color-muted-foreground)" }}>
                Agregar, editar y eliminar productos
              </p>
            </div>
          </a>

          <a
            href="admin-inventario.html"
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📊</div>
              <h2 style={{ marginBottom: "0.5rem" }}>Inventario</h2>
              <p style={{ color: "var(--color-muted-foreground)" }}>
                Ver stock y alertas de productos
              </p>
            </div>
          </a>

          <a
            href="admin-usuarios.html"
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>👥</div>
              <h2 style={{ marginBottom: "0.5rem" }}>Gestión de Usuarios</h2>
              <p style={{ color: "var(--color-muted-foreground)" }}>
                Administrar empleados y permisos
              </p>
            </div>
          </a>

          <a
            href="admin-reportes.html"
            className="card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📈</div>
              <h2 style={{ marginBottom: "0.5rem" }}>Reportes</h2>
              <p style={{ color: "var(--color-muted-foreground)" }}>
                Ventas, ingresos y estadísticas
              </p>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
