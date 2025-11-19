import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import openrouteservice from "openrouteservice-js";

/**
 * RoutesToDo.jsx
 * - Estilo B: profissional (marcadores animados, rota vermelha, controles)
 * - Usa OpenRouteService (ORS) para Geocoding + Directions (optimize)
 * - Navegação por voz: fala instruções passo-a-passo + autoplay
 *
 * Substitua SUA_API_KEY_AQUI pela sua chave ORS.
 */

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
  const [instructions, setInstructions] = useState([]); // array de passos (textos)
  const [currentStep, setCurrentStep] = useState(0);
  const autoplayRef = useRef(null);
  const [isAutoplay, setIsAutoplay] = useState(false);

  const handleStartRoute = (delivery) => {
    navigate("/RouteStart", { state: { delivery } });
  };

  const goHome = () => navigate("/RoutesToDo");

  useEffect(() => {
    const apiKey = "SUA_API_KEY_AQUI"; // <<< substitua aqui

    // init map
    mapRef.current = L.map("map", { zoomControl: false }).setView(
      [-22.23, -45.938726],
      13
    );

    // Tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);

    // Zoom control (posicionado direito)
    L.control
      .zoom({
        position: "topright",
      })
      .addTo(mapRef.current);

    // Small custom CSS for markers animation & buttons
    const style = document.createElement("style");
    style.innerHTML = `
      .pulse-marker {
        width: 18px;
        height: 18px;
        background: #fff;
        border: 3px solid #ff3b30; /* vermelho forte */
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

      .floating-controls {
        position: absolute;
        right: 18px;
        top: 120px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .floating-btn {
        background: #ff3b30;
        color: white;
        border: none;
        border-radius: 999px;
        padding: 10px 14px;
        box-shadow: 0 6px 16px rgba(0,0,0,0.2);
        cursor: pointer;
        font-weight: 600;
      }
      .floating-btn.secondary {
        background: white;
        color: #111;
      }
      .instruction-card {
        background: white;
        padding: 8px 12px;
        border-radius: 10px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        max-height: 220px;
        overflow-y: auto;
      }
    `;
    document.head.appendChild(style);

    const GeocodeClient = new openrouteservice.Geocode({ api_key: apiKey });
    const Directions = new openrouteservice.Directions({ api_key: apiKey });

    // limpar camadas existentes (se recarregar)
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

    // converte endereços em coordenadas (lon, lat) usando ORS Geocode
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

          if (!res || !res.features || res.features.length === 0) {
            console.warn("Sem resultado de geocoding para:", fullAddress);
            continue;
          }

          const [lng, lat] = res.features[0].geometry.coordinates;
          coords.push([lng, lat]);

          // marker com estilo profissional/animado (divIcon)
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
        } catch (err) {
          console.error("Erro geocoding:", fullAddress, err);
        }
      }
      return coords;
    };

    // calcula rota otimizada e desenha no mapa
    const calculateRoute = async () => {
      clearMap();
      const coords = await geocodeAll();

      if (!coords || coords.length < 2) {
        console.warn("Precisa de pelo menos 2 pontos para rotas");
        return;
      }

      try {
        const routeResponse = await Directions.calculate({
          coordinates: coords,
          profile: "driving-car",
          format: "geojson",
          optimize_waypoints: true,
          // language: "pt-BR" // ORS aceita language em alguns endpoints; deixe se quiser
        });

        // desenha rota
        routeLayerRef.current = L.geoJSON(routeResponse, {
          style: { color: "#ff3b30", weight: 6, opacity: 0.95 },
        }).addTo(mapRef.current);

        // centra mapa
        mapRef.current.fitBounds(routeLayerRef.current.getBounds(), {
          padding: [60, 60],
        });

        // extrai instruções (ORS returns features[0].properties.segments[0].steps)
        const feat = routeResponse.features && routeResponse.features[0];
        const segs =
          feat && feat.properties && feat.properties.segments
            ? feat.properties.segments
            : null;

        if (segs && segs.length > 0) {
          // ORS segments[0].steps -> array of { distance, duration, type, instruction, name, way_points }
          const steps = segs[0].steps || [];
          const texts = steps.map((s, i) => ({
            text: `${i + 1}. ${s.instruction} (${Math.round(
              s.distance
            )} m • ${Math.round(s.duration)} s)`,
            raw: s,
          }));
          setInstructions(texts);
          setCurrentStep(0);
        } else {
          setInstructions([]);
        }
      } catch (err) {
        console.error("Erro ao calcular rota:", err);
      }
    };

    // start: calcula assim que monta
    calculateRoute();

    // cleanup on unmount
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
      try {
        mapRef.current.remove();
      } catch {}
      document.head.removeChild(style);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // VOZ: fala instrução (usa Web Speech API)
  const speakText = (text) => {
    if (!("speechSynthesis" in window)) {
      alert("Seu navegador não suporta síntese de voz.");
      return;
    }
    window.speechSynthesis.cancel(); // cancela falas anteriores
    const utter = new SpeechSynthesisUtterance(text);
    // voz e parâmetros profissionais
    utter.lang = "pt-BR";
    utter.rate = 1; // velocidade
    utter.pitch = 1; // timbre
    // Escolhe voz mais adequada se houver
    const voices = window.speechSynthesis.getVoices();
    const chosen = voices.find((v) =>
      /brazilian|portuguese|pt-BR/i.test(v.name || v.lang)
    );
    if (chosen) utter.voice = chosen;
    window.speechSynthesis.speak(utter);
  };

  // fala próxima instrução
  const speakNext = () => {
    if (!instructions || instructions.length === 0) return;
    const nextIndex = Math.min(currentStep, instructions.length - 1);
    speakText(instructions[nextIndex].text);
    setCurrentStep((i) => Math.min(i + 1, instructions.length - 1));
  };

  // fala instrução anterior
  const speakPrev = () => {
    if (!instructions || instructions.length === 0) return;
    const prev = Math.max(0, currentStep - 1);
    speakText(instructions[prev].text);
    setCurrentStep(prev);
  };

  // autoplay: lê todas instruções sequencialmente
  const startAutoplay = () => {
    if (!instructions || instructions.length === 0) return;
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
    }, 4000); // a cada 4s (ajustável)
  };

  const stopAutoplay = () => {
    if (autoplayRef.current) {
      clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    setIsAutoplay(false);
    window.speechSynthesis.cancel();
  };

  // Recalcula rota (botão)
  const recalcRoute = () => {
    // força re-execução do effect removendo e reconstruindo o mapa é pesado.
    // Em vez disso, dispararemos uma simulação: recarregamos o componente do mapa criando/removendo elemento e chamando useEffect não é simples sem hooks. 
    // Então aqui só informamos ao usuário para recarregar a rota chamando o endpoint ORS novamente via trigger simples:
    // EASIER: Simplesmente remove camadas e chama calculateRoute - mas calculateRoute está em scope do useEffect.
    // Solução: forçar reload do componente inteiro pela navegação (simples): navigate to same route (re-render).
    window.location.reload(); // solução prática e direta
  };

  // Open in Google Maps: cria URL com origin + waypoints + destination
  const openInGoogleMaps = () => {
    // extrai coordenadas dos markers (lat,lng)
    const coords = markersRef.current.map((m) => {
      const latlng = m.getLatLng();
      return `${latlng.lat},${latlng.lng}`;
    });
    if (coords.length === 0) return;
    // origin: primeiro, destination: last, waypoints: middle
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
      {/* NAV */}
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

      {/* MAIN */}
      <main className="flex flex-1 p-6 gap-6 relative">
        {/* LEFT: lista */}
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

              <div className="flex gap-2 items-center mt-2">
                <button
                  onClick={() => handleStartRoute(d)}
                  className="bg-red-600 text-white font-bold px-3 py-2 rounded hover:bg-red-700"
                >
                  Iniciar
                </button>

                <button
                  onClick={() => {
                    // center map on this marker if exists
                    const m = markersRef.current[idx];
                    if (m) mapRef.current.panTo(m.getLatLng());
                  }}
                  className="bg-white text-gray-800 font-semibold px-3 py-2 rounded shadow"
                >
                  Localizar no mapa
                </button>
              </div>

              <p>
                <strong>Tempo estimado:</strong> {d.estimatedTime} minutos
              </p>
            </div>
          ))}

          {/* instruções */}
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

        {/* RIGHT: mapa */}
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

          {/* floating controls (posicionado via CSS injetado) */}
          <div className="floating-controls">
            <button
              className="floating-btn"
              onClick={() => (isAutoplay ? stopAutoplay() : startAutoplay())}
            >
              {isAutoplay ? "Parar leitura" : "Ler instruções"}
            </button>

            <button className="floating-btn secondary" onClick={recalcRoute}>
              Recalcular rota
            </button>

            <button className="floating-btn" onClick={openInGoogleMaps}>
              Abrir no Google Maps
            </button>
          </div>
        </div>
      </main>

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
