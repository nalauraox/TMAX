import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function FinalizationMotorcycle() {
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [motorcycle, setMotorcycle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // 📌 Pega o usuário atual
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser || !currentUser.email) {
      setLoading(false);
      return;
    }

    // 📌 Monta chave individual para este usuário
    const driverKey = `driver_${currentUser.email}`;
    const motorcycleKey = `motorcycle_${currentUser.email}`;

    // 📌 Tenta buscar os dados
    const savedDriver = localStorage.getItem(driverKey);
    const savedMoto = localStorage.getItem(motorcycleKey);

    if (savedDriver) setDriver(JSON.parse(savedDriver));
    if (savedMoto) setMotorcycle(JSON.parse(savedMoto));

    setLoading(false);
  }, []);

  const handleFinalize = () => {
    if (!driver) {
      alert("Você precisa completar o cadastro do motorista antes de finalizar.");
      return;
    }

    const summary = {
      driver,
      motorcycle,
      finalizedAt: new Date().toISOString(),
      registrationComplete: true,
    };

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const summaryKey = `registrationSummary_${currentUser.email}`;

    localStorage.setItem(summaryKey, JSON.stringify(summary));

    alert("Cadastro finalizado com sucesso!");
    navigate("/RoutesToDo");
  };

  const handleEditDriver = () => navigate("/driver-registration");
  const handleEditMotorcycle = () => navigate("/motorcycle-registration");

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">

      {/* NAVBAR */}
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        <Link
          to="/"
          className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
        >
          ← Voltar para home
        </Link>

        <img src="/logo.png" alt="Logo" className="h-20" />

        <Link to="/profile" className="text-2xl font-bold hover:underline cursor-pointer">
          Seu Perfil
        </Link>
      </nav>

      {/* Main */}
      <main className="flex justify-center py-10 px-6 flex-1 w-full">

        {/* Barra lateral */}
        <div className="flex flex-col items-start mr-10">
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            <span className="text-red-600 font-semibold">Cadastro do motorista</span>
          </div>
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            <span className="text-red-600 font-semibold">Cadastro da moto</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            <span className="text-red-600 font-semibold">Finalização</span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="w-[400px] flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Finalização do Cadastro</h1>

          {/* MOTORISTA */}
          {driver ? (
            <div className="w-full bg-gray-100 p-4 rounded-lg mb-4">
              <h2 className="font-semibold mb-2">Dados do Motorista</h2>

              <div className="flex gap-4">
                <div>
                  {driver.profileDataUrl ? (
                    <img
                      src={driver.profileDataUrl}
                      alt="perfil"
                      className="w-24 h-24 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full">
                      Sem foto
                    </div>
                  )}
                </div>

                <div className="flex-1 text-sm">
                  <p><strong>Nome:</strong> {driver.name}</p>
                  <p><strong>Email:</strong> {driver.email}</p>
                  <p><strong>Telefone:</strong> {driver.phone}</p>
                  <p><strong>CPF:</strong> {driver.cpf}</p>
                </div>
              </div>

              <button
                onClick={handleEditDriver}
                className="mt-3 w-full bg-white border p-2 rounded-lg"
              >
                Editar dados do motorista
              </button>
            </div>
          ) : (
            <div className="w-full bg-yellow-100 p-4 rounded-lg mb-4">
              <p>Nenhum dado do motorista encontrado.</p>
              <button
                onClick={handleEditDriver}
                className="mt-3 w-full bg-gray-200 p-2 rounded-lg"
              >
                Cadastrar motorista
              </button>
            </div>
          )}

          {/* MOTO */}
          {motorcycle ? (
            <div className="w-full bg-gray-100 p-4 rounded-lg mb-6">
              <h2 className="font-semibold mb-2">Dados da moto</h2>

              <p><strong>Marca:</strong> {motorcycle.marca}</p>
              <p><strong>Modelo:</strong> {motorcycle.modelo}</p>
              <p><strong>Ano:</strong> {motorcycle.ano}</p>
              <p><strong>Placa:</strong> {motorcycle.placa}</p>
              <p><strong>Cor:</strong> {motorcycle.cor}</p>

              <button
                onClick={handleEditMotorcycle}
                className="mt-3 w-full bg-white border p-2 rounded-lg"
              >
                Editar dados da moto
              </button>
            </div>
          ) : (
            <div className="w-full bg-yellow-50 p-4 rounded-lg mb-6">
              <p>Nenhum dado de motocicleta encontrado.</p>
              <button
                onClick={handleEditMotorcycle}
                className="mt-3 w-full bg-gray-200 p-2 rounded-lg"
              >
                Cadastrar moto
              </button>
            </div>
          )}

          {/* Finalizar */}
          <button
            onClick={handleFinalize}
            className="w-full bg-red-600 text-white p-2 rounded-lg font-semibold mb-3 hover:bg-red-700 transition"
          >
            Finalizar Cadastro
          </button>
        </div>
      </main>

      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full">
        <p className="text-sm text-gray-500">© Turma Senac Tec - 2025</p>
      </footer>
    </div>
  );
}
