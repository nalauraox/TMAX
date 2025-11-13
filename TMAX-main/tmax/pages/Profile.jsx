import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  // Função para voltar à página anterior
  const handleGoBack = () => navigate(-1);

  // Dados de exemplo
  const user = {
    nome: "João da Silva",
    email: "joao@email.com",
    celular: "(11) 99999-9999",
  };

  const pedidos = [
    { id: 1, item: "Entrega de Pacote", status: "Concluído" },
    { id: 2, item: "Transporte de Documento", status: "Em andamento" },
    { id: 3, item: "Entrega de Compra Online", status: "Concluído" },
  ];

  const handleLogout = () => {
    if (window.confirm("Deseja mesmo sair da sua conta?")) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar */}
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
      {/* Conteúdo */}
      <main className="flex flex-col items-center py-10 px-6 flex-1 w-full">
        <h1 className="text-2xl font-bold mb-6">Olá, {user.nome}!</h1>

        <div className="w-[400px] bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Informações da Conta</h2>
          <p><strong>Nome:</strong> {user.nome}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Celular:</strong> {user.celular}</p>
        </div>

        <div className="w-[400px] bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Pedidos Feitos</h2>
          <ul className="list-disc list-inside">
            {pedidos.map(pedido => (
              <li key={pedido.id}>
                {pedido.item} - <span className="font-semibold">{pedido.status}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={handleLogout}
          className="w-[400px] bg-red-600 text-white p-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Sair da Conta
        </button>
      </main>

      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full">
        <p className="text-sm text-gray-500">© Webtagger - 2024 Todos os Direitos Reservados</p>
      </footer>
    </div>
  );
}
