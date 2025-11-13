import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function CarRegistration() {
  const [carImage, setCarImage] = useState(null);
  const navigate = useNavigate();

  const handleCarUpload = (e) => {
    const file = e.target.files[0];
    if (file) setCarImage(URL.createObjectURL(file));
  };

  const handleNextStep = () => {
    navigate("/finalization"); // redireciona para a página de finalização
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* ===== NAVBAR compartilhada ===== */}
      
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
  </Link>

  <img src="/logo.png" alt="Logo" className="h-20" />

  <Link
    to="/profile"
    className="text-2xl font-bold hover:underline cursor-pointer"
  >
    Seu Perfil
  </Link>
</nav>
      {/* ===== CONTEÚDO PRINCIPAL ===== */}
      <main className="flex justify-center py-10 px-6 flex-1 w-full">
        {/* Barra de progresso lateral */}
        <div className="flex flex-col items-start mr-10">
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            <span className="text-red-600 font-semibold">Cadastro do motorista</span>
          </div>
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            <span className="text-red-600 font-semibold">Cadastro do carro</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            <span>Finalização</span>
          </div>
        </div>

        {/* ===== FORMULÁRIO ===== */}
        <div className="w-[400px] flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Cadastro do Carro</h1>

          {/* Upload da foto do carro */}
          <label className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 flex flex-col items-center cursor-pointer w-full">
            {carImage ? (
              <img
                src={carImage}
                alt="Carro"
                className="w-48 h-32 object-cover rounded-lg"
              />
            ) : (
              <div className="text-center">
                <div className="text-4xl">🚗</div>
                <div>Foto do carro</div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleCarUpload}
            />
          </label>

          {/* Campos de cadastro */}
          <input
            type="text"
            placeholder="Marca"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100"
          />
          <input
            type="text"
            placeholder="Modelo"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100"
          />
          <div className="flex w-full gap-3 mb-3">
            <input
              type="text"
              placeholder="Ano"
              className="flex-1 p-2 rounded-lg border bg-gray-100"
            />
            <input
              type="text"
              placeholder="Placa"
              className="flex-1 p-2 rounded-lg border bg-gray-100"
            />
          </div>
          <input
            type="text"
            placeholder="Cor"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100"
          />
          <input
            type="text"
            placeholder="Número do Renavam"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100"
          />

          {/* Botão para avançar */}
          <button
            className="w-full bg-gray-200 text-black p-2 rounded-lg font-semibold mb-3 hover:bg-gray-300 transition"
            onClick={handleNextStep}
          >
            Concluir esta etapa
          </button>

          <p className="text-xs text-center">
            Ao continuar, você concorda com nossa{" "}
            <span className="text-red-600 underline">Política de Serviço</span> e{" "}
            <span className="text-red-600 underline">Termos de Uso</span>.
          </p>
        </div>
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
