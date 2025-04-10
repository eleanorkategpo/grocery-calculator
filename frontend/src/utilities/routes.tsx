import { createRoutesFromElements, Route } from "react-router-dom";
import Layout from "../components/Layout";
import Login from "../components/Login";
import Register from "../components/Register";
import Dashboard from "../components/Dashboard";

export const routes = createRoutesFromElements(
  <Route element={<Layout />}>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route path="/dashboard" element={<Dashboard />} />
  </Route>
);
