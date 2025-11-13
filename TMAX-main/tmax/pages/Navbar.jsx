import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // 🔙 volta para a página anterior
  };

  return (
    <nav className="bg-black text-white flex items-center justify-center gap-10 py-4 relative">
      {/* 🔙 Botão de voltar */}
      <button
        onClick={handleGoBack}
        className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
      >
        ← Voltar
      </button>

      {/* Texto à esquerda */}
      <div className="text-xl font-bold hover:underline cursor-pointer">
        Comissão
      </div>

      {/* Logo central */}
      <div className="flex items-center gap-2">
        <img
          src="/logo.png" // logo TMAX
          alt="Logo"
          className="h-16"
        />
      </div>

      {/* Texto à direita */}
      <a
        href="#"
        className="text-xl font-bold hover:underline cursor-pointer"
      >
        Seu perfil
      </a>
    </nav>
  );
}
