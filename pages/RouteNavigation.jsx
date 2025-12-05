import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ================= ICONES =====================
const driverIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/4873/4873625.png",
  iconSize: [35, 35],
});

const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/14831/14831545.png",
  iconSize: [45, 45],
});

// Controla o movimento da câmera
function FlyTo({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 17, { duration: 1 });
    }
  }, [position]);
  return null;
}

export default function RouteNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const delivery = location.state?.delivery;

  const [currentPos, setCurrentPos] = useState(null);
  const [route, setRoute] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  // Atualiza GPS em tempo real
  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error("Erro GPS:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  // Calcular rota atual + instruções
  async function loadRoute() {
    if (!currentPos || !delivery?.coords) return;

    const url = `https://router.project-osrm.org/route/v1/driving/${currentPos.lng},${currentPos.lat};${delivery.coords.lng},${delivery.coords.lat}?overview=full&steps=true&geometries=geojson`;

    const res = await fetch(url);
    const data = await res.json();

    // Linha da rota
    const points = data.routes[0].geometry.coordinates.map((p) => [p[1], p[0]]);
    setRoute(points);

    // Instruções
    const steps = data.routes[0].legs[0].steps.map((s) => s.maneuver.instruction);
    setInstructions(steps);
  }

  useEffect(() => {
    if (currentPos) {
      loadRoute();
    }
  }, [currentPos]);

  // Falar instrução
  const speakInstruction = () => {
    if (!instructions.length) {
      const fallback = "Nenhuma instrução disponível no momento.";
      const utter = new SpeechSynthesisUtterance(fallback);
      utter.lang = "pt-BR";
      utter.rate = 1;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utter);
      return;
    }

    const step = instructions[currentStep] || "Continue seguindo em frente.";
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(step);
    utter.lang = "pt-BR";
    utter.rate = 1;

    setTimeout(() => {
      window.speechSynthesis.speak(utter);
    }, 50);

    if (currentStep < instructions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Finalizar corrida
  const finishRide = () => {
    navigate("/DeliveryFinalization", { state: { delivery } });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">

      {/* TÍTULO */}
      <div className="text-center p-4 border-b mb-3">
        <h1 className="text-2xl font-bold">Navegação em andamento</h1>
        <p className="text-gray-600">{delivery?.name}</p>
      </div>

      {/* MAPA */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-3xl h-[70vh] rounded-lg overflow-hidden shadow-xl">
          <MapContainer
            center={currentPos || [-22.2267, -45.9389]}
            zoom={16}
            className="w-full h-full"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {currentPos && <FlyTo position={[currentPos.lat, currentPos.lng]} />}

            {currentPos && (
              <Marker position={[currentPos.lat, currentPos.lng]} icon={driverIcon} />
            )}

            {delivery?.coords && (
              <Marker
                position={[delivery.coords.lat, delivery.coords.lng]}
                icon={destinationIcon}
              />
            )}

            {route.length > 0 && (
              <Polyline positions={route} color="blue" weight={6} />
            )}
          </MapContainer>
        </div>
      </div>

      {/* BOTOES */}
      <div className="w-full max-w-3xl flex flex-col gap-3 mt-6 px-4 mx-auto">

        <button
          onClick={speakInstruction}
          className="w-full bg-black text-white py-3 rounded-lg text-lg font-bold"
        >
          🔊 Próxima instrução
        </button>

        <button
          onClick={finishRide}
          className="w-full bg-green-600 text-white py-3 rounded-lg text-lg font-bold"
        >
          ✔ Finalizar Entrega
        </button>
      </div>

      <footer className="text-center text-gray-500 text-sm mt-auto py-6">
       © Turma Senac Tec - 2025 Todos os direitos reservados.
      </footer>
    </div>
  );
}
