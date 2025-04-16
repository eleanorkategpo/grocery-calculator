import { createRoutesFromElements, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../components/Login";
import Register from "../components/Register";
import Dashboard from "../components/Dashboard";

// Mock authentication function
const isAuthenticated = () => {
  // Replace this with your actual authentication logic
  return !!localStorage.getItem("user"); // Example: check if user is stored in localStorage
};

// Higher-order component for protected routes
const ProtectedRoute = ({ element }: { element: React.ReactNode }) => {
  return isAuthenticated() ? element : <Navigate to="/" />;
};

export const routes = createRoutesFromElements(
  <Route element={<Layout />}>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route element={<ProtectedRoute element={<Dashboard />} />}>
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>
  </Route>
);
