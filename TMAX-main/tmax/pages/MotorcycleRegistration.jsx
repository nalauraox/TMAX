// src/pages/MotorcycleRegistration.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function MotorcycleRegistration() {
  const [motorcycle, setMotorcycle] = useState({
    marca: "",
    modelo: "",
    ano: "",
    placa: "",
    cor: "",
    imagem: null, // armazenaremos dataURL (base64) aqui
  });

  const navigate = useNavigate();

  // Se já houver dados salvos (editar), carrega para os campos
  useEffect(() => {
    const saved = localStorage.getItem("motorcycleData");
    if (saved) setMotorcycle(JSON.parse(saved));
  }, []);

  // Converte arquivo em base64 (DataURL) para persistir no localStorage
  const handleMotorcycleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setMotorcycle((prev) => ({ ...prev, imagem: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (field) => (e) => {
    setMotorcycle((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleNextStep = () => {
    // validação simples (opcional)
    // if (!motorcycle.marca || !motorcycle.modelo) { alert("Preencha marca e modelo"); return; }

    localStorage.setItem("motorcycleData", JSON.stringify(motorcycle));
    // Navega para a página que mostra os dados / finalização
    navigate("/finalization");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        <Link to="/" className="absolute left-6 text-lg font-semibold hover:underline">
          ← Voltar para home
        </Link>
        <Link to="/commission" className="text-2xl font-bold hover:underline">Comissão</Link>
        <img src="/logo.png" alt="Logo" className="h-20" />
        <Link to="/profile" className="text-2xl font-bold hover:underline">Seu Perfil</Link>
      </nav>

      <main className="flex justify-center py-10 px-6 flex-1 w-full">
        <div className="w-[400px] flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Cadastro da Moto</h1>

          <label className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 flex flex-col items-center cursor-pointer w-full">
            {motorcycle.imagem ? (
              <img src={motorcycle.imagem} alt="Moto" className="w-48 h-32 object-cover rounded-lg" />
            ) : (
              <div className="text-center">
                <div className="text-4xl">🏍️</div>
                <div>Foto da moto</div>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleMotorcycleUpload}
            />
          </label>

          <input
            type="text"
            placeholder="Marca"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100"
            value={motorcycle.marca}
            onChange={handleChange("marca")}
          />
          <input
            type="text"
            placeholder="Modelo"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100"
            value={motorcycle.modelo}
            onChange={handleChange("modelo")}
          />
          <div className="flex w-full gap-3 mb-3">
            <input
              type="text"
              placeholder="Ano"
              className="flex-1 p-2 rounded-lg border bg-gray-100"
              value={motorcycle.ano}
              onChange={handleChange("ano")}
            />
            <input
              type="text"
              placeholder="Placa"
              className="flex-1 p-2 rounded-lg border bg-gray-100"
              value={motorcycle.placa}
              onChange={handleChange("placa")}
            />
          </div>
          <input
            type="text"
            placeholder="Cor"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100"
            value={motorcycle.cor}
            onChange={handleChange("cor")}
          />

          <button
            className="w-full bg-red-600 text-white p-2 rounded-lg font-semibold mb-3"
            onClick={handleNextStep}
          >
            Concluir esta etapa
          </button>

          <p className="text-xs text-center">
            Ao continuar você concorda com essa <span className="text-red-600 underline">Política de Serviço</span> e <span className="text-red-600 underline">termos de uso</span>
          </p>
        </div>
      </main>

      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" className="w-6 h-6" />
          <span className="text-gray-800 font-medium">Siga nosso Instagram</span>
        </div>
        <p className="text-sm text-gray-500">© Webtagger - 2024 Todos os Direitos Reservados</p>
      </footer>
    </div>
  );
}
