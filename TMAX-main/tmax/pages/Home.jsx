import React from "react";
import { Link } from "react-router-dom"; // Importa o Link para navegação

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* ===== Banner ===== */}
      <div
        className="relative h-[60vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url("/bg.png")`, // imagem dentro da pasta public
        }}
      >
        <div className="absolute inset-0 bg-black/50" /> {/* filtro escuro */}
        <h1 className="relative text-white text-4xl md:text-5xl font-bold text-center px-4">
          Bem-vindo ao <span className="text-red-500">Tmax</span> Entregas!
        </h1>
      </div>

      {/* ===== Login Section ===== */}
      <div className="flex flex-col items-center justify-center flex-grow py-10 bg-white">
        <h2 className="text-2xl font-bold mb-4">Comece fazendo seu login</h2>

        {/* ✅ Botão que leva para a página de Login */}
        <Link
          to="/login"
          className="bg-red-600 text-white text-lg px-10 py-2 rounded-full hover:bg-red-700 transition"
        >
          Login
        </Link>

        <p className="mt-4 text-gray-700">
          Não tem uma conta?{" "}
          {/* ✅ Link que leva direto para a página Register */}
          <Link
            to="/register"
            className="text-red-600 font-semibold hover:underline"
          >
            Crie uma!
          </Link>
        </p>
      </div>

      {/* ===== Footer ===== */}
      <footer className="bg-gray-50 text-center py-6 border-t">
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
        © Turma Senac Tec - 2025 Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
