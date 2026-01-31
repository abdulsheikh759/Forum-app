import { Navigate } from "react-router-dom";
import { useAuth } from "../ContextApi/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

 
  if (loading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
