import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corrige ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// 🔹 Função para pegar rota otimizada
async function getOptimizedRoute(start, end) {
  const apiKey = "SUA_API_KEY";
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

  try {
    const res = await axios.get(url);
    return res.data; // retorna dados da rota
  } catch (err) {
    console.error("Erro ao gerar rota:", err);
  }
}

export default function RouteStarted() {
  const navigate = useNavigate();
  const location = useLocation();
  const { delivery } = location.state || {};

  const [routeCoords, setRouteCoords] = useState([]);

  const routeInfo = {
    lat: delivery?.lat ?? -19.8734,
    lng: delivery?.lng ?? -43.9419,
    address: delivery?.address ?? "Rua das Flores, 123",
    customer: delivery?.name ?? "João da Silva",
  };

  // 🔹 Exemplo: gerar rota quando o componente carrega
  useEffect(() => {
    async function fetchRoute() {
      const data = await getOptimizedRoute(
        { lat: -19.8734, lng: -43.9419 }, // ponto inicial
        { lat: routeInfo.lat, lng: routeInfo.lng } // destino
      );

      if (data?.features?.[0]?.geometry?.coordinates) {
        // Converte para [lat, lng] do Leaflet
        const coords = data.features[0].geometry.coordinates.map(c => [c[1], c[0]]);
        setRouteCoords(coords);
      }
    }

    fetchRoute();
  }, [routeInfo.lat, routeInfo.lng]);

  return (
    <div>
      <MapContainer center={[routeInfo.lat, routeInfo.lng]} zoom={15} style={{ height: "400px" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker position={[routeInfo.lat, routeInfo.lng]}>
          <Popup>{routeInfo.customer}</Popup>
        </Marker>

        {routeCoords.length > 0 && <Polyline positions={routeCoords} color="blue" />}
      </MapContainer>
    </div>
  );
}
