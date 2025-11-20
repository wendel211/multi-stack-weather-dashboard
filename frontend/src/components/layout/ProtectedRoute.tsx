import { Navigate } from "react-router-dom";
import { Layout } from "./Layout";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
}
