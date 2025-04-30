import { createRoutesFromElements, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../components/Login";
import Register from "../components/Register";
import Dashboard from "../components/Dashboard";
import ErrorPage from "../components/shared/ErrorPage";
import MyCart from "../components/Dashboard/MyCart";
import GroceryGenerate from "../components/Dashboard/GroceryGenerate";
import PreviousCarts from "../components/Dashboard/PreviousCarts";
import ShoppingList from "../components/Dashboard/ShoppingList";

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
    <Route
      path="/dashboard"
      element={<ProtectedRoute element={<Dashboard />} />}
    >
      <Route path=":groceryId/cart" element={<MyCart />} />
      <Route path="new-grocery" element={<GroceryGenerate />} />
      <Route path="previous-carts" element={<PreviousCarts />} />
      <Route path="shopping-list" element={<ShoppingList />} />
    </Route>
    <Route path="*" element={<ErrorPage />} />
  </Route>
);
