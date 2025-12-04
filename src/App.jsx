// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";

import DriverRegistration from "../pages/DriverRegistration";
import MotorcycleRegistration from "../pages/MotorcycleRegistration";

import RoutesToDo from "../pages/RoutesToDo";
import RouteStarted from "../pages/RouteStart";
import DeliveryFinalization from "../pages/DeliveryFinalization";

import FinalizationMotorcycle from "../pages/FinalizationMotorcycle"; 
import Profile from "../pages/Profile";
import RouteNavigation from "../pages/RouteNavigation";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Rotas principais */}
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Cadastros */}
        <Route path="/driver-registration" element={<DriverRegistration />} />
        <Route path="/motorcycle-registration" element={<MotorcycleRegistration />} />

        {/* Finalização */}
        <Route path="/finalization-motorcycle" element={<FinalizationMotorcycle />} />

        {/* Rotas do App */}
        <Route path="/routestodo" element={<RoutesToDo />} />
        <Route path="/routestart" element={<RouteStarted />} />
        <Route path="/deliveryfinalization" element={<DeliveryFinalization />} />
        <Route path="/route-navigation" element={<RouteNavigation />} />
        <Route path="/driver-registration" element={<DriverRegistration />} />
        {/* Perfil */}
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}
