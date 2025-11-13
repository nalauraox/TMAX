import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [vehicle, setVehicle] = useState("");
  const navigate = useNavigate();

  const handleContinue = () => {
    if (vehicle === "Moto") {
      navigate("/motorcycle-registration"); // rota do cadastro da moto
    } else if (vehicle === "Carro") {
      navigate("/car-registration"); // 🚗 rota do cadastro do carro
    } else if (vehicle === "Bike") {
      navigate("/bike-registration"); // rota da bike (pode criar depois)
    } else {
      alert("Por favor, selecione um tipo de veículo antes de continuar!");
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-start py-10 bg-white">
      <div className="bg-black text-white rounded-3xl p-8 w-[350px] shadow-lg flex flex-col items-center">
        <h2 className="text-center text-lg font-semibold mb-6">
          Comece com seus dados
        </h2>

        {/* ===== CAMPOS COM BALÃO BRANCO ===== */}
        <input
          type="text"
          placeholder="Seu nome completo"
          className="w-full mb-3 p-3 rounded-full bg-white text-gray-700 placeholder-gray-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="CPF"
          className="w-full mb-3 p-3 rounded-full bg-white text-gray-700 placeholder-gray-500 focus:outline-none"
        />
        <input
          type="text"
          placeholder="(11) 99999-9999"
          className="w-full mb-4 p-3 rounded-full bg-white text-gray-700 placeholder-gray-500 focus:outline-none"
        />

        {/* ===== LINK DE LOGIN ===== */}
        <p className="underline text-sm mb-5">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="font-semibold text-white hover:text-gray-300 transition"
          >
            Entre com sua conta
          </Link>
        </p>

        {/* ===== ESCOLHA DO VEÍCULO ===== */}
        <p className="text-center text-sm mb-3">Como vai fazer suas corridas?</p>

        <div className="flex gap-3 mb-5">
          {["Bike", "Moto", "Carro"].map((type) => (
            <button
              key={type}
              onClick={() => setVehicle(type)}
              className={`px-5 py-2 rounded-full font-semibold transition ${
                vehicle === type
                  ? "bg-white text-black"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* ===== BOTÃO CONTINUAR ===== */}
        <button
          className="bg-white text-black w-full py-3 rounded-full font-bold hover:bg-gray-200 transition"
          onClick={handleContinue}
        >
          Continuar
        </button>

        {/* ===== CHECKBOX ===== */}
        <div className="flex items-start gap-2 text-xs text-center mt-4">
          <input type="checkbox" />
          <span>
            Concordo em fornecer meus dados para receber conteúdos e ofertas
            por e-mail.
          </span>
        </div>
      </div>

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
