import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Ícone do DESTINO
const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [40, 40],
});

// Ícone do ENTREGADOR
const currentIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4873/4873625.png",
  iconSize: [35, 35],
});

// Mover mapa suavemente
function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 16, { duration: 1.0 });
    }
  }, [position, map]);

  return null;
}

export default function RouteStart() {
  const location = useLocation();
  const navigate = useNavigate();

  const delivery = location.state?.delivery;

  const [currentPos, setCurrentPos] = useState(null);
  const [route, setRoute] = useState([]);

  // Localização real do entregador
  useEffect(() => {
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error("Erro no GPS:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  // Calcular rota via backend
  async function calculateRoute() {
    if (!currentPos || !delivery?.coords) return;

    try {
      const url = `http://127.0.0.1:8000/navigation/route?fromLat=${currentPos.lat}&fromLng=${currentPos.lng}&toLat=${delivery.coords.lat}&toLng=${delivery.coords.lng}`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data.route) {
        console.error("Erro: backend não retornou rota.");
        return;
      }

      setRoute(data.route);
    } catch (err) {
      console.error("Erro ao calcular rota:", err);
    }
  }

  function startRide() {
    navigate("/route-navigation", {
      state: {
        delivery,
        currentPos,
        route,
      },
    });
  }

  // 🔥 FUNÇÃO HOME CORRIGIDA (vai para /routestodo)
  const goHome = () => navigate("/routestodo");

  return (
    <div className="flex flex-col min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">

        {/* 🔙 Voltar — CORRIGIDO */}
        <Link
          to="/routestodo"
          className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
        >
          ← Voltar
        </Link>

        {/* 🏠 Home — CORRIGIDO */}
        <button
          onClick={goHome}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded transition duration-200"
        >
          Home
        </button>

        <img src="/logo.png" alt="Logo" className="h-20" />

        <Link
          to="/profile"
          className="text-2xl font-bold hover:underline cursor-pointer"
        >
          Seu Perfil
        </Link>
      </nav>

      {/* CONTEÚDO */}
      <div className="flex flex-col items-center p-4">

        <h2 className="text-xl font-bold mb-3">
          Rota para {delivery?.name || "Destino"}
        </h2>

        <div className="w-full max-w-3xl h-96 rounded-lg overflow-hidden shadow-lg mb-6">
          <MapContainer
            center={[-22.2267, -45.9389]}
            zoom={14}
            className="w-full h-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {currentPos && <FlyTo position={[currentPos.lat, currentPos.lng]} />}

            {currentPos && (
              <Marker
                position={[currentPos.lat, currentPos.lng]}
                icon={currentIcon}
              />
            )}

            {delivery?.coords && (
              <Marker
                position={[delivery.coords.lat, delivery.coords.lng]}
                icon={destinationIcon}
              />
            )}

            {route.length > 0 && (
              <Polyline positions={route} color="blue" weight={5} />
            )}
          </MapContainer>
        </div>

        <button
          onClick={calculateRoute}
          className="bg-blue-600 text-white px-5 py-3 rounded-lg shadow-lg mb-4"
        >
          Calcular Rota
        </button>

        <button
          onClick={startRide}
          className="bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg"
        >
          Iniciar Corrida
        </button>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
            alt="Instagram"
            className="w-6 h-6"
          />
          <span className="text-gray-800 font-medium">Siga nosso Instagram</span>
        </div>
        <p className="text-sm text-gray-500">
          © Turma Senac Tec - 2025 Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
