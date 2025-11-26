import { BrowserRouter, Routes, Route } from "react-router-dom";
import RutasPrivadas from './components/Rutasprivadas'
import Login from "./pages/Login";
import AdminDashboard from "./pages/admin-dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* RUTAS PROTEGIDAS */}
        <Route
          path="/admin"
          element={
            <RutasPrivadas rol="admin">
              <AdminDashboard />
            </RutasPrivadas>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
