import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Finalization() {
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [motorcycle, setMotorcycle] = useState(null);
  const [loading, setLoading] = useState(true);

  // tenta várias chaves comuns no localStorage para ser robusto
  const tryGet = (keys) => {
    for (const k of keys) {
      const raw = localStorage.getItem(k);
      if (raw) {
        try {
          return JSON.parse(raw);
        } catch {
          // se não for JSON, retorna o raw
          return raw;
        }
      }
    }
    return null;
  };

  useEffect(() => {
    setLoading(true);
  
    // 🔹 Aqui você define as chaves onde o sistema vai tentar buscar os dados do motorista
    const driverKeys = ["driver", "user", "userData", "profile", "currentUser"];
    const motorcycleKeys = ["motorcycle", "vehicle", "motorbike", "bike", "motorcycleData"];
  
    const d = tryGet(driverKeys);
    const m = tryGet(motorcycleKeys);
  
    setDriver(d);
    setMotorcycle(m);
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinalize = () => {
    // validação simples — exige pelo menos dados do motorista
    if (!driver) {
      alert("Dados do motorista não encontrados. Por favor, complete o cadastro do motorista antes de finalizar.");
      return;
    }

    // Monta um summary combinado
    const summary = {
      driver: driver,
      motorcycle: motorcycle || null,
      finalizedAt: new Date().toISOString(),
      registrationComplete: true,
    };

    localStorage.setItem("registrationSummary", JSON.stringify(summary));

    // opcional: retirada temporária de chaves intermedias (comentado)
    // localStorage.removeItem("driver");
    // localStorage.removeItem("motorcycle");

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
      {/* NAVBAR compartilhada */}
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        <Link
          to="/"
          className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
        >
          ← Voltar para home
        </Link>

        <Link to="/commission" className="text-2xl font-bold hover:underline cursor-pointer">
        </Link>

        <img src="/logo.png" alt="Logo" className="h-20" />

        <Link to="/profile" className="text-2xl font-bold hover:underline cursor-pointer">
          Seu Perfil
        </Link>
      </nav>

      {/* Main */}
      <main className="flex justify-center py-10 px-6 flex-1 w-full">
        {/* Progress Bar */}
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

        {/* Form / Resumo */}
        <div className="w-[400px] flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Finalização do Cadastro</h1>

          {/* Se não houver dados do motorista */}
          {!driver && (
            <div className="w-full bg-yellow-100 p-4 rounded-lg mb-6">
              <p className="font-semibold">Nenhum dado do motorista encontrado</p>
              <p className="text-sm">Por favor, complete o cadastro do motorista antes de finalizar.</p>
              <button
                onClick={handleEditDriver}
                className="mt-3 w-full bg-gray-200 text-black p-2 rounded-lg font-semibold"
              >
                Ir para cadastro do motorista
              </button>
            </div>
          )}

          {/* Resumo do cadastro (motorista) */}
          {driver && (
            <div className="w-full bg-gray-100 p-4 rounded-lg mb-4">
              <h2 className="font-semibold mb-2">Dados do Motorista</h2>

              <div className="flex gap-4">
                <div>
                  {/* tenta exibir imagem de perfil se existir */}
                  {driver.profileDataUrl ? (
                    <img src={driver.profileDataUrl} alt="perfil" className="w-24 h-24 object-cover rounded-full" />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full">Sem foto</div>
                  )}
                </div>

                <div className="flex-1 text-sm">
                  <p><strong>Nome:</strong> {driver.name || "—"}</p>
                  <p><strong>Email:</strong> {driver.email || "—"}</p>
                  <p><strong>Celular:</strong> {driver.phone || "—"}</p>
                  <p><strong>CPF:</strong> {driver.cpf || "—"}</p>
                  <p><strong>Comprovante:</strong> {driver.addressProof || "—"}</p>
                  {driver.rgDataUrls && driver.rgDataUrls.length > 0 && (
                    <div className="mt-2">
                      <strong>RGs:</strong>
                      <div className="flex gap-2 mt-2">
                        {driver.rgDataUrls.map((d, i) => (
                          <img key={i} src={d} alt={`rg-${i}`} className="w-20 h-20 object-cover" />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={handleEditDriver} className="flex-1 bg-white border p-2 rounded-lg">Editar dados do motorista</button>
              </div>
            </div>
          )}

          {/* Resumo da motocicleta (se houver) */}
          {motorcycle ? (
            <div className="w-full bg-gray-100 p-4 rounded-lg mb-6">
              <h2 className="font-semibold mb-2">Dados da Moto</h2>

              {/* tenta mostrar campos comuns */}
              <p><strong>Marca/Modelo:</strong> {motorcycle.model || motorcycle.brand || motorcycle.marca || "—"}</p>
              <p><strong>Placa:</strong> {motorcycle.plate || motorcycle.placa || "—"}</p>
              <p><strong>Cor:</strong> {motorcycle.color || motorcycle.cor || "—"}</p>
              <p><strong>Ano:</strong> {motorcycle.year || motorcycle.ano || "—"}</p>

              <div className="mt-3 flex gap-2">
                <button onClick={handleEditMotorcycle} className="flex-1 bg-white border p-2 rounded-lg">Editar dados da moto</button>
              </div>
            </div>
          ) : (
            // se não existir motorcycle, mostra botão pra cadastrar
            <div className="w-full bg-yellow-50 p-4 rounded-lg mb-6">
              <p className="text-sm mb-3">Nenhum dado de motocicleta encontrado.</p>
              <button onClick={handleEditMotorcycle} className="w-full bg-gray-200 text-black p-2 rounded-lg font-semibold">
                Ir para cadastro da moto
              </button>
            </div>
          )}

          {/* Botão finalizar */}
          <button
            onClick={handleFinalize}
            className="w-full bg-red-600 text-white p-2 rounded-lg font-semibold mb-3 hover:bg-red-700 transition"
          >
            Finalizar Cadastro
          </button>

          <p className="text-xs text-center">
            Ao finalizar, você confirma que todas as informações estão corretas e concorda com a{" "}
            <span className="text-red-600 underline">Política de Serviço</span> e{" "}
            <span className="text-red-600 underline">termos de uso</span>.
          </p>
        </div>
      </main>

      {/* ===== Footer ===== */}
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
