import React from "react";
import { useNavigate, Link } from "react-router-dom";

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

  // Função chamada ao clicar no botão "Iniciar"
  const handleStartRoute = (delivery) => {
    navigate("/RouteStart", { state: { delivery } });
  };

  // 👉 Função do botão Home
  const goHome = () => {
    navigate("/RoutesToDo"); // ✅ Leva para a rota /RoutesToDo
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* ===== NAVBAR ===== */}
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">

        {/* 🔙 Voltar */}
        <Link
          to="/"
          className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
        >
          ← Voltar
        </Link>

        {/* 🏠 Botão Home */}
        <button
          onClick={goHome}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded transition duration-200"
        >
           Home
        </button>

        {/* Links da navbar */}
        <Link
          to="/commission"
          className="text-2xl font-bold hover:underline cursor-pointer"
        >
        </Link>

        {/* Logo central */}
        <img src="/logo.png" alt="Logo" className="h-20" />

        <Link
          to="/profile"
          className="text-2xl font-bold hover:underline cursor-pointer"
        >
          Seu Perfil
        </Link>
      </nav>

      {/* ===== MAIN ===== */}
      <main className="flex flex-1 p-6 gap-6">
        {/* Lista de entregas */}
        <div className="flex flex-col gap-4 w-1/3">
          <h2 className="text-xl font-bold mb-2">ROTAS A FAZER:</h2>
          {deliveries.map((d, idx) => (
            <div
              key={idx}
              className="bg-gray-200 p-4 rounded-lg flex flex-col gap-2"
            >
              <p><strong>Nome:</strong> {d.name}</p>
              <p><strong>Bairro:</strong> {d.neighborhood}</p>
              <p><strong>Rua:</strong> {d.street}</p>
              <p><strong>Número:</strong> {d.number}</p>
              <button
                onClick={() => handleStartRoute(d)}
                className="bg-red-600 text-white font-bold px-4 py-2 rounded hover:bg-red-700 w-max mt-2"
              >
                Iniciar
              </button>
              <p><strong>Tempo estimado da entrega:</strong> {d.estimatedTime} minutos</p>
            </div>
          ))}
        </div>

        {/* Mapa */}
<div className="flex-1">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.324508227437!2d-45.93872632560293!3d-22.230008479742334!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cb6ab651d7f6a3%3A0xd6820d1fdf3dd9e2!2sPouso%20Alegre%2C%20MG!5e0!3m2!1spt-BR!2sbr!4v1731507600000!5m2!1spt-BR!2sbr"
    width="100%"
    height="100%"
    className="rounded-lg"
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
  ></iframe>
</div>
{/* Mapa */}
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
            alt="Instagram"
            className="w-6 h-6"
          />
          <span className="text-gray-800 font-medium">
            Siga nosso Instagram
          </span>
        </div>
        <p className="text-sm text-gray-500">
          © Webtagger - 2024 Todos os Direitos Reservados
        </p>
      </footer>
    </div>
  );
}
