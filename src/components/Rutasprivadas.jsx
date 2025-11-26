import { Navigate } from "react-router-dom";

export default function RutasPrivadas({ children, rol }) {
  const userRole = localStorage.getItem("userRole");

  if (userRole !== rol) {
    return <Navigate to="/" />;
  }

  return children;
}
