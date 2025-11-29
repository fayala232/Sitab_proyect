import { BrowserRouter, Routes, Route } from "react-router-dom"
import RutasPrivadas from "./components/Rutasprivadas"
import Login from "./pages/Login"
import AdminDashboard from "./pages/admin/AdminDashboard"
import AdminProductos from "./pages/admin/AdminProductos"
import AdminUsuarios from "./pages/admin/AdminUsuarios"
import AdminInventario from "./pages/admin/AdminInventario"
import AdminReportes from "./pages/admin/AdminReportes"
import CajeraDashboard from "./pages/cajera/CajeraDashboard"
import CajeraHistorial from "./pages/cajera/CajeraHistorial"
// import "./sitab.css"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* RUTAS PROTEGIDAS - ADMIN */}
        <Route
          path="/admin"
          element={
            <RutasPrivadas rol="admin">
              <AdminDashboard />
            </RutasPrivadas>
          }
        />
        <Route
          path="/admin/productos"
          element={
            <RutasPrivadas rol="admin">
              <AdminProductos />
            </RutasPrivadas>
          }
        />
        <Route
          path="/admin/usuarios"
          element={
            <RutasPrivadas rol="admin">
              <AdminUsuarios />
            </RutasPrivadas>
          }
        />
        <Route
          path="/admin/inventario"
          element={
            <RutasPrivadas rol="admin">
              <AdminInventario />
            </RutasPrivadas>
          }
        />
        <Route
          path="/admin/reportes"
          element={
            <RutasPrivadas rol="admin">
              <AdminReportes />
            </RutasPrivadas>
          }
        />

        <Route
          path="/cajera"
          element={
            <RutasPrivadas rol="cajera">
              <CajeraDashboard />
            </RutasPrivadas>
          }
        />
        <Route
          path="/cajera/historial"
          element={
            <RutasPrivadas rol="cajera">
              <CajeraHistorial />
            </RutasPrivadas>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
