import { useNavigate, useLocation, Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Corrige ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function RouteStarted() {
  const navigate = useNavigate();
  const location = useLocation();
  const { delivery } = location.state || {};

  const handleFinishRoute = () => {
    navigate("/DeliveryFinalization"); // 🔹 Agora vai para a nova página
  };

  const handleCancelRoute = () => {
    navigate("/RoutesToDo");
  };

  const routeInfo = {
    customer: delivery?.name || "João da Silva",
    address: delivery?.address || "Rua Olinto da costa garcia, 137 - Arvore Grande",
    lat: delivery?.lat ?? -19.8734,
    lng: delivery?.lng ?? -43.9419,
    order: delivery?.order || "Onigiri e Poke",
    estimatedTime: delivery?.estimatedTime ? `${delivery.estimatedTime} min` : "15 min",

  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* 🔹 NAVBAR ATUALIZADA */}
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
  {/* Botão Voltar usando Link */}
  <Link
    to="/"  // Coloque a rota para a qual quer voltar
    className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
  >
    ← Voltar para home
  </Link>

  <Link
    to="/commission"
    className="text-2xl font-bold hover:underline cursor-pointer"
  >
    Comissão
  </Link>

  <img src="/logo.png" alt="Logo" className="h-20" />

  <Link
    to="/profile"
    className="text-2xl font-bold hover:underline cursor-pointer"
  >
    Seu Perfil
  </Link>
</nav>

      {/* Main */}
      <main className="flex flex-col items-center justify-center flex-1 p-6 w-full">
        <h1 className="text-2xl font-bold mb-6">Rota Iniciada</h1>

        <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-4">Informações da Entrega</h2>
          <p><strong>Cliente:</strong> {routeInfo.customer}</p>
          <p><strong>Endereço:</strong> {routeInfo.address}</p>
          <p><strong>Pedido:</strong> {routeInfo.order}</p>
          <p><strong>Tempo Estimado:</strong> {routeInfo.estimatedTime}</p>
        </div>

        {/* Mapa */}
        {routeInfo.lat && routeInfo.lng && (
          <div className="w-full max-w-md h-64 mb-6">
            <MapContainer
              center={[routeInfo.lat, routeInfo.lng]}
              zoom={15}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <Marker position={[routeInfo.lat, routeInfo.lng]}>
                <Popup>{routeInfo.customer} - {routeInfo.address}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}

        {/* Botões */}
        <div className="flex gap-4">
          <button
            onClick={handleFinishRoute}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Finalizar Entrega
          </button>
          <button
            onClick={handleCancelRoute}
            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Cancelar Rota
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full">
        <p className="text-sm text-gray-500">
          © Webtagger - 2024 Todos os Direitos Reservados
        </p>
      </footer>
    </div>
  );
}
