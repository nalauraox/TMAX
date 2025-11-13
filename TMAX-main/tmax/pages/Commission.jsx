import React from "react";
import { Link } from "react-router-dom";

export default function Commission() {
  const deliveries = [
    { id: 1, address: "Bairro: Árvore Grande, Av. Luís Gonzaga Nunes Maia número: 85", status: "Entregue", commission: 10.19 },
    { id: 2, address: "Bairro: Paraíso, R. Lázaro de Carvalho Número: 121", status: "Entregue", commission: 9.6 },
    { id: 3, address: "Bairro: São João, R. João pedro antonio numero: 180", status: "Entregue", commission: 11.7 },
    { id: 4, address: "Bairro: Fátima, R. Fernando Ferreira da Silva número: 90", status: "Entregue", commission: 12.6 },
    { id: 5, address: "Bairro: Fátima, R. Maestro Clóvis Siqueira Mamede numero: 45", status: "Entregue", commission: 11.5 },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        {/* Botão Voltar */}
        <Link
          to="/"
          className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
        >
          ← Voltar para home
        </Link>

        <span className="text-2xl font-bold">Comissão</span>

        <img src="/logo.png" alt="Logo" className="h-20" />

        <Link
          to="/profile"
          className="text-2xl font-bold hover:underline cursor-pointer"
        >
          Seu Perfil
        </Link>
      </nav>

      {/* Tabela de entregas */}
      <main className="flex flex-col items-center py-10 px-6 flex-1 w-full">
        <div className="w-full max-w-5xl">
          <div className="grid grid-cols-3 gap-4 font-semibold mb-4 text-center">
            <div>Entregas feitas:</div>
            <div>Status do pedido</div>
            <div>Comissão</div>
          </div>

          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="grid grid-cols-3 gap-4 items-center mb-2 p-2 rounded-lg bg-gray-100 text-center"
            >
              <div className="text-left px-2">{delivery.address}</div>
              <div>{delivery.status}</div>
              <div className="bg-green-200 rounded-full px-4 py-1 font-semibold">
                {delivery.commission.toFixed(2).replace(".", ",")}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
            alt="Instagram"
            className="w-6 h-6"
          />
          <span>Siga nosso Instagram</span>
        </div>
        <p className="text-sm text-gray-500">
          © Webtagger - 2024 Todos os Direitos Reservados
        </p>
      </footer>
    </div>
  );
}
