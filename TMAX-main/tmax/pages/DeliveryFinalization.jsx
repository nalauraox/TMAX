import { useNavigate, useLocation, Link } from "react-router-dom";

export default function DeliveryFinalization() {
  const navigate = useNavigate();
  const location = useLocation();
  const { delivery } = location.state || {};

  const handleBackToRoutes = () => {
    navigate("/RoutesToDo");
  };

  const routeInfo = {
    customer: delivery?.name || "João da Silva",
    address: delivery?.address || "Rua das Flores, 123 - Nova Serra Verde",
    order: delivery?.order || "Entrega de documentos",
    estimatedTime: delivery?.estimatedTime ? `${delivery.estimatedTime} min` : "15 min",
    vehicle: delivery?.vehicle || "Honda CG 160 - Placa ABC-1234",
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
        <div className="w-full max-w-md bg-gray-100 p-6 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4 text-green-600">Entrega Concluída!</h1>
          <p className="mb-4">A entrega foi finalizada com sucesso.</p>

          <div className="bg-white p-4 rounded-lg mb-6 shadow-inner text-left">
            <h2 className="font-semibold mb-2">Resumo da Entrega:</h2>
            <p><strong>Cliente:</strong> {routeInfo.customer}</p>
            <p><strong>Endereço:</strong> {routeInfo.address}</p>
            <p><strong>Pedido:</strong> {routeInfo.order}</p>
            <p><strong>Tempo Estimado:</strong> {routeInfo.estimatedTime}</p>
            <p><strong>Veículo:</strong> {routeInfo.vehicle}</p>
          </div>

          <button
            onClick={handleBackToRoutes}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Voltar para Rotas
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
