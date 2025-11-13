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
import CarRegistration from "../pages/CarRegistration";
import FinalizationCar from "../pages/FinalizationCar";
import FinalizationMotorcycle from "../pages/FinalizationMotorcycle";
import Profile from "../pages/Profile";
import Commission from "../pages/Commission";
import Finalization from "../pages/FinalizationMotorcycle";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/driver-registration" element={<DriverRegistration />} />
        <Route path="/motorcycle-registration" element={<MotorcycleRegistration />} />
        <Route path="/finalization" element={<Finalization />} />
        <Route path="/routestodo" element={<RoutesToDo />} />
        <Route path="/routestart" element={<RouteStarted />} />
        <Route path="/deliveryfinalization" element={<DeliveryFinalization />} />
        <Route path="/carregistration" element={<CarRegistration />} />
        <Route path="/commission" element={<Commission/>} />
        <Route path="/profile" element={<Profile/>} />
        

        {/* ✅ Novas rotas específicas */}
        <Route path="/finalizationcar" element={<FinalizationCar />} />
        <Route path="/finalizationmotorcycle" element={<FinalizationMotorcycle />} />
      </Routes>
    </Router>
  );
}
