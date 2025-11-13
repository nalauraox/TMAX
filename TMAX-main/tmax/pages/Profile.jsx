import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);

  // Carrega os dados salvos no localStorage
  useEffect(() => {
    const storedUser =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("driver")) ||
      JSON.parse(localStorage.getItem("registrationSummary"))?.driver ||
      null;

    const storedPedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

    setUser(storedUser);
    setPedidos(storedPedidos);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Deseja mesmo sair da sua conta?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("driver");
      localStorage.removeItem("registrationSummary");
      navigate("/login");
    }
  };

  // ✅ Função do botão Home
  const goHome = () => {
    navigate("/RoutesToDo");
  };

  // Se não houver login salvo
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white text-center font-sans">
        <h1 className="text-2xl font-bold mb-4">Você não está logado.</h1>
        <p className="mb-6 text-gray-600">Faça login para acessar seu perfil.</p>
        <Link
          to="/login"
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Ir para Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
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

        {/* Comissão */}
        <Link
          to="/commission"
          className="text-2xl font-bold hover:underline cursor-pointer"
        >

        </Link>

        {/* Logo central */}
        <img src="/logo.png" alt="Logo" className="h-20" />

        {/* Perfil */}
        <Link
          to="/profile"
          className="text-2xl font-bold hover:underline cursor-pointer"
        >
          Seu Perfil
        </Link>
      </nav>

      {/* ===== CONTEÚDO ===== */}
      <main className="flex flex-col items-center py-10 px-6 flex-1 w-full">
        <h1 className="text-2xl font-bold mb-6">
          Olá, {user.name || user.nome || "Usuário"}!
        </h1>

        {/* Card com informações */}
        <div className="w-[400px] bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Informações da Conta</h2>
          <p><strong>Nome:</strong> {user.name || user.nome || "—"}</p>
          <p><strong>Email:</strong> {user.email || "—"}</p>
          <p><strong>Celular:</strong> {user.phone || user.celular || "—"}</p>
          <p><strong>CPF:</strong> {user.cpf || "—"}</p>

          {user.profileDataUrl && (
            <img
              src={user.profileDataUrl}
              alt="Foto de perfil"
              className="w-24 h-24 rounded-full object-cover mt-4 mx-auto border"
            />
          )}
        </div>

        {/* Pedidos (opcional) */}
        <div className="w-[400px] bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="font-semibold mb-2">Pedidos Feitos</h2>
          {pedidos.length > 0 ? (
            <ul className="list-disc list-inside">
              {pedidos.map((pedido, index) => (
                <li key={index}>
                  {pedido.item} —{" "}
                  <span className="font-semibold">{pedido.status}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum pedido ainda.</p>
          )}
        </div>

        {/* Botão de sair */}
        <button
          onClick={handleLogout}
          className="w-[400px] bg-red-600 text-white p-2 rounded-lg font-semibold hover:bg-red-700 transition"
        >
          Sair da Conta
        </button>
      </main>

      {/* ===== FOOTER ===== */}
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
          © Webtagger - 2024 Todos os Direitos Reservados
        </p>
      </footer>
    </div>
  );
}
