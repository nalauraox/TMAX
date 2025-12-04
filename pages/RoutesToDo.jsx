import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import openrouteservice from "openrouteservice-js";

export default function RoutesToDo() {
  const navigate = useNavigate();

  const deliveries = [
    {
      name: "Frederico Souza",
      neighborhood: "Árvore Grande",
      street: "Olinto da Costa Garcia",
      number: 137,
      estimatedTime: 15,
    },
    {
      name: "Meire da Silva",
      neighborhood: "Paraíso",
      street: "R. Lázaro de Carvalho",
      number: 121,
      estimatedTime: 20,
    },
    {
      name: "Joyce Carvalho",
      neighborhood: "Árvore Grande",
      street: "Av. Luís Gonzaga Nunes Maia",
      number: 85,
      estimatedTime: 12,
    },
  ];

  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const markersRef = useRef([]);
  const [instructions, setInstructions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const autoplayRef = useRef(null);
  const [isAutoplay, setIsAutoplay] = useState(false);

  const handleStartRoute = (delivery) => {
    navigate("/RouteStart", { state: { delivery } });
  };

  const goHome = () => navigate("/RoutesToDo");

  useEffect(() => {
    const apiKey = "SUA_API_KEY_AQUI";

    mapRef.current = L.map("map", { zoomControl: false }).setView(
      [-22.23, -45.938726],
      13
    );

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    L.control
      .zoom({
        position: "topright",
      })
      .addTo(mapRef.current);

    const style = document.createElement("style");
    style.innerHTML = `
      .pulse-marker {
        width: 18px;
        height: 18px;
        background: #fff;
        border: 3px solid #ff3b30;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(255,59,48,0.7);
      }
      .pulse-marker::after {
        content: "";
        width: 18px;
        height: 18px;
        border-radius: 50%;
        position: absolute;
        left: -3px; top: -3px;
        animation: pulse 1.6s infinite;
        box-shadow: 0 0 0 rgba(255,59,48,0.6);
      }
      @keyframes pulse {
        0% { transform: scale(0.9); opacity: 0.9; }
        70% { transform: scale(2.4); opacity: 0; }
        100% { transform: scale(2.4); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    const GeocodeClient = new openrouteservice.Geocode({ api_key: apiKey });
    const Directions = new openrouteservice.Directions({ api_key: apiKey });

    const clearMap = () => {
      if (routeLayerRef.current) {
        mapRef.current.removeLayer(routeLayerRef.current);
        routeLayerRef.current = null;
      }
      markersRef.current.forEach((m) => {
        try {
          mapRef.current.removeLayer(m);
        } catch {}
      });
      markersRef.current = [];
      setInstructions([]);
      setCurrentStep(0);
    };

    const geocodeAll = async () => {
      const coords = [];
      for (const d of deliveries) {
        const fullAddress = `${d.street}, ${d.number}, ${d.neighborhood}, Pouso Alegre, MG`;
        try {
          const res = await GeocodeClient.geocode({
            text: fullAddress,
            size: 1,
            boundary_country: "BR",
          });

          if (!res || !res.features || res.features.length === 0) continue;

          const [lng, lat] = res.features[0].geometry.coordinates;
          coords.push([lng, lat]);

          const div = L.divIcon({
            className: "",
            html: `<div class="pulse-marker"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });

          const marker = L.marker([lat, lng], { icon: div })
            .addTo(mapRef.current)
            .bindPopup(
              `<strong>${d.name}</strong><br/>${d.street}, ${d.number}<br/>${d.neighborhood}`
            );
          markersRef.current.push(marker);
        } catch {}
      }
      return coords;
    };

    const calculateRoute = async () => {
      clearMap();
      const coords = await geocodeAll();

      if (!coords || coords.length < 2) return;

      try {
        const routeResponse = await Directions.calculate({
          coordinates: coords,
          profile: "driving-car",
          format: "geojson",
          optimize_waypoints: true,
        });

        routeLayerRef.current = L.geoJSON(routeResponse, {
          style: { color: "#ff3b30", weight: 6, opacity: 0.95 },
        }).addTo(mapRef.current);

        mapRef.current.fitBounds(routeLayerRef.current.getBounds(), {
          padding: [60, 60],
        });

        const feat = routeResponse.features && routeResponse.features[0];
        const segs =
          feat && feat.properties && feat.properties.segments
            ? feat.properties.segments
            : null;

        if (segs && segs.length > 0) {
          const steps = segs[0].steps || [];
          const texts = steps.map((s, i) => ({
            text: `${i + 1}. ${s.instruction} (${Math.round(
              s.distance
            )} m • ${Math.round(s.duration)} s)`,
            raw: s,
          }));
          setInstructions(texts);
        } else {
          setInstructions([]);
        }
      } catch {}
    };

    calculateRoute();

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
      try {
        mapRef.current.remove();
      } catch {}
      document.head.removeChild(style);
    };
  }, []);


  const speakText = (text) => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-BR";
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  };

  const speakNext = () => {
    if (!instructions.length) return;
    const nextIndex = Math.min(currentStep, instructions.length - 1);
    speakText(instructions[nextIndex].text);
    setCurrentStep((i) => Math.min(i + 1, instructions.length - 1));
  };

  const speakPrev = () => {
    if (!instructions.length) return;
    const prev = Math.max(0, currentStep - 1);
    speakText(instructions[prev].text);
    setCurrentStep(prev);
  };

  const startAutoplay = () => {
    if (!instructions.length) return;
    setIsAutoplay(true);
    let idx = currentStep;
    speakText(instructions[idx].text);
    idx++;
    autoplayRef.current = setInterval(() => {
      if (idx >= instructions.length) {
        clearInterval(autoplayRef.current);
        setIsAutoplay(false);
        return;
      }
      speakText(instructions[idx].text);
      setCurrentStep(idx);
      idx++;
    }, 4000);
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    setIsAutoplay(false);
    window.speechSynthesis.cancel();
  };

  const recalcRoute = () => {
    window.location.reload();
  };

  const openInGoogleMaps = () => {
    const coords = markersRef.current.map((m) => {
      const latlng = m.getLatLng();
      return `${latlng.lat},${latlng.lng}`;
    });
    if (!coords.length) return;
    const origin = coords[0];
    const destination = coords[coords.length - 1];
    const waypoints = coords.slice(1, coords.length - 1).join("|");
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      origin
    )}&destination=${encodeURIComponent(
      destination
    )}&travelmode=driving${
      waypoints ? `&waypoints=${encodeURIComponent(waypoints)}` : ""
    }`;
    window.open(url, "_blank");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        <Link
          to="/"
          className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
        >
          ← Voltar
        </Link>

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

      <main className="flex flex-1 p-6 gap-6 relative">
        <div className="flex flex-col gap-4 w-1/3">
          <h2 className="text-2xl font-bold mb-2">ROTAS A FAZER</h2>

          {deliveries.map((d, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-4 rounded-lg flex flex-col gap-2 shadow"
            >
              <p>
                <strong>Nome:</strong> {d.name}
              </p>
              <p>
                <strong>Bairro:</strong> {d.neighborhood}
              </p>
              <p>
                <strong>Rua:</strong> {d.street}
              </p>
              <p>
                <strong>Número:</strong> {d.number}
              </p>

              <button
                onClick={() => handleStartRoute(d)}
                className="bg-red-600 text-white font-bold px-3 py-2 rounded hover:bg-red-700"
              >
                Iniciar
              </button>

              <p>
                <strong>Tempo estimado:</strong> {d.estimatedTime} minutos
              </p>
            </div>
          ))}

          <div className="mt-4 instruction-card">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold">Instruções ({instructions.length})</h3>
              <div className="flex gap-2">
                <button
                  onClick={speakPrev}
                  className="px-3 py-1 rounded bg-gray-100"
                >
                  ◀
                </button>
                <button
                  onClick={speakNext}
                  className="px-3 py-1 rounded bg-red-600 text-white"
                >
                  ▶ Falar próxima
                </button>
              </div>
            </div>

            <ol className="text-sm space-y-2">
              {instructions.length === 0 && (
                <li className="text-gray-500">Carregando instruções...</li>
              )}
              {instructions.map((it, i) => (
                <li
                  key={i}
                  className={`p-2 rounded ${
                    i === currentStep ? "bg-red-50 border-l-4 border-red-600" : ""
                  }`}
                >
                  {it.text}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex-1 relative">
          <div
            id="map"
            style={{
              width: "100%",
              height: "70vh",
              borderRadius: "12px",
              overflow: "hidden",
            }}   
          />
        </div>
      </main>

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
