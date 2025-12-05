import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function DriverRegistration() {
  const navigate = useNavigate();

  // ===== ESTADOS DO FORMULÁRIO =====
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");

  // ===== DADOS SALVOS =====
  const [savedDriver, setSavedDriver] = useState(null);

  // ===== SALVAR FORMULÁRIO =====
  const handleSave = () => {
    if (!name || !email || !phone || !cpf) {
      alert("Preencha pelo menos Nome, Email, Celular e CPF.");
      return;
    }

    const driverData = {
      name,
      password: password ? "(oculta)" : "",
      email,
      phone,
      cpf,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem("driver", JSON.stringify(driverData));
    setSavedDriver(driverData);

    alert("Dados salvos com sucesso!");
  };

  // ===== CARREGAR DADOS DO LOCALSTORAGE =====
  useEffect(() => {
    const raw = localStorage.getItem("driver");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setSavedDriver(parsed);

      setName(parsed.name || "");
      setEmail(parsed.email || "");
      setPhone(parsed.phone || "");
      setCpf(parsed.cpf || "");
    } catch (err) {
      console.warn("Erro ao carregar localStorage:", err);
    }
  }, []);

  // ===== NEXT STEP =====
  const handleNextStep = () => {
    if (!savedDriver) {
      alert("Salve seus dados antes de prosseguir.");
      return;
    }
    navigate("/motorcycle-registration");
  };

  // ===== CLEAR =====
  const handleClearSaved = () => {
    localStorage.removeItem("driver");
    setSavedDriver(null);
    alert("Dados removidos.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* NAVBAR */}
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        <Link to="/" className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer">
          ← Voltar para home
        </Link>

        <img src="/logo.png" alt="Logo" className="h-20" />

        <Link to="/profile" className="text-2xl font-bold hover:underline cursor-pointer">
          Seu Perfil
        </Link>
      </nav>

      {/* MAIN */}
      <main className="flex justify-center py-10 px-6 flex-1 w-full">
        <div className="flex flex-col items-start mr-10">
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            <span className="text-red-600 font-semibold">Cadastro do motorista</span>
          </div>
          <div className="flex items-center mb-6">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            <span>Cadastro da moto</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            <span>Finalização</span>
          </div>
        </div>

        {/* FORM */}
        <div className="w-[400px] flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Cadastro do motorista</h1>

          {/* CAMPOS */}
          <input
            type="text"
            placeholder="Nome completo"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="flex w-full gap-3 mb-3">
            <input
              type="password"
              placeholder="Senha"
              className="flex-1 p-2 rounded-lg border bg-gray-100"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              className="flex-1 p-2 rounded-lg border bg-gray-100"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="flex w-full gap-3 mb-3">
            <input
              type="text"
              placeholder="Celular"
              className="flex-1 p-2 rounded-lg border bg-gray-100"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <input
              type="text"
              placeholder="CPF"
              className="flex-1 p-2 rounded-lg border bg-gray-100"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>

          {/* BOTÕES */}
          <div className="w-full flex gap-2 mb-3">
            <button className="flex-1 bg-gray-200 text-black p-2 rounded-lg font-semibold" onClick={handleSave}>
              Salvar informações
            </button>
          </div>

          <button
            className="w-full bg-red-600 text-white p-2 rounded-lg font-semibold mb-3"
            onClick={handleNextStep}
          >
            Próxima etapa
          </button>

          <p className="text-xs text-center">
            Ao continuar você concorda com a{" "}
            <span className="text-red-600 underline">Política de Serviço</span> e{" "}
            <span className="text-red-600 underline">Termos de uso</span>.
          </p>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
            className="w-6 h-6"
          />
          <span className="text-gray-800 font-medium">Siga nosso Instagram</span>
        </div>

        <p className="text-sm text-gray-500">© Turma Senac Tec - 2025 Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
