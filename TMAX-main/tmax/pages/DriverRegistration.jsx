import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function DriverRegistration() {
  const navigate = useNavigate();

  // campos do form
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [addressProof, setAddressProof] = useState("");

  // arquivos / previews (previews são object URLs para exibição imediata)
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [rgFiles, setRgFiles] = useState([]); // array de File
  const [rgPreviews, setRgPreviews] = useState([]); // array de object URLs

  // dados salvos (dataURLs e texto) para mostrar resumo
  const [savedDriver, setSavedDriver] = useState(null);

  // util: converte File -> dataURL (para salvar no localStorage)
  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });

  // handlers de upload (apenas atualizam preview e guardam File)
  const handleProfileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleRgUpload = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 2);
    setRgFiles(files);
    setRgPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // salvar dados no localStorage e mostrar resumo
  const handleSave = async () => {
    // validação simples
    if (!name || !email || !phone || !cpf) {
      alert("Preencha pelo menos Nome, Email, Celular e CPF.");
      return;
    }

    try {
      const profileDataUrl = await fileToDataUrl(profileFile); // pode ser null
      const rgDataUrls = await Promise.all(rgFiles.map((f) => fileToDataUrl(f)));

      const driverData = {
        name,
        password: password ? "(oculta)" : "", // alternativa: não salvar senha em plain text em produção
        email,
        phone,
        cpf,
        addressProof,
        profileDataUrl,
        rgDataUrls, // array (pode conter 0..2 items)
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem("driver", JSON.stringify(driverData));
      setSavedDriver(driverData);

      alert("Dados salvos com sucesso! Você pode ver o resumo abaixo.");
    } catch (err) {
      console.error("Erro ao converter imagens:", err);
      alert("Erro ao processar imagens. Tente novamente.");
    }
  };

  // carregar dados salvos (se houver) ao montar o componente
  useEffect(() => {
    const raw = localStorage.getItem("driver");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setSavedDriver(parsed);

        // preencher campos do formulário com os dados salvos (opcional)
        if (parsed.name) setName(parsed.name);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.cpf) setCpf(parsed.cpf);
        if (parsed.addressProof) setAddressProof(parsed.addressProof);

        // se houver profileDataUrl, usa como preview
        if (parsed.profileDataUrl) {
          setProfilePreview(parsed.profileDataUrl);
          // profileFile não pode ser reconstruído do dataURL — ok, só precisamos do preview/savedDriver
        }

        if (Array.isArray(parsed.rgDataUrls) && parsed.rgDataUrls.length > 0) {
          setRgPreviews(parsed.rgDataUrls);
        }
      } catch (e) {
        console.warn("driver no localStorage inválido:", e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // botão que leva pra próxima etapa (só use se já salvou dados)
  const handleNextStep = () => {
    if (!savedDriver) {
      alert("Salve seus dados antes de prosseguir.");
      return;
    }
    navigate("/motorcycle-registration");
  };

  // limpar dados salvos (opcional, para editar do zero)
  const handleClearSaved = () => {
    localStorage.removeItem("driver");
    setSavedDriver(null);
    // não limpa campos automaticamente — usuário pode editar manualmente
    alert("Dados salvos removidos. Edite o formulário e salve novamente.");
  };

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
          Comissão
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
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            <span>Cadastro da moto</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-400 mr-2"></div>
            <span>Finalização</span>
          </div>
        </div>

        {/* Form */}
        <div className="w-[400px] flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Cadastro do motorista</h1>

          {/* Profile Upload */}
          <label className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 flex flex-col items-center cursor-pointer w-full">
            {profilePreview ? (
              <img src={profilePreview} alt="Profile" className="w-24 h-24 object-cover rounded-full" />
            ) : (
              <div className="text-center">
                <div className="text-4xl">📷</div>
                <div>Foto de perfil</div>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
          </label>

          {/* Input Fields */}
          <input
            type="text"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100"
          />
          <div className="flex w-full gap-3 mb-3">
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 p-2 rounded-lg border bg-gray-100"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 p-2 rounded-lg border bg-gray-100"
            />
          </div>
          <div className="flex w-full gap-3 mb-3">
            <input
              type="text"
              placeholder="Celular"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="flex-1 p-2 rounded-lg border bg-gray-100"
            />
            <input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              className="flex-1 p-2 rounded-lg border bg-gray-100"
            />
          </div>
          <input
            type="text"
            placeholder="Comprovante de residência"
            value={addressProof}
            onChange={(e) => setAddressProof(e.target.value)}
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100"
          />

          {/* RG Upload */}
          <label className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-6 w-full flex flex-col items-center cursor-pointer">
            <div className="w-full flex justify-center gap-2">
              {rgPreviews.length > 0
                ? rgPreviews.map((img, idx) => (
                    <img key={idx} src={img} alt={`RG ${idx}`} className="w-20 h-20 object-cover" />
                  ))
                : (
                  <div className="text-4xl">📷</div>
                )}
            </div>
            <div className="mt-2 text-sm text-gray-600">Frente e verso 0/2 imagens</div>
            <input type="file" accept="image/*" className="hidden" multiple onChange={handleRgUpload} />
          </label>

          {/* Ações: salvar, limpar, próxima etapa */}
          <div className="w-full flex gap-2 mb-3">
            <button
              className="flex-1 bg-gray-200 text-black p-2 rounded-lg font-semibold"
              onClick={handleSave}
            >
              Salvar informações
            </button>
            <button
              className="bg-white border p-2 rounded-lg"
              onClick={handleClearSaved}
              title="Remove os dados salvos"
            >
              Limpar salvos
            </button>
          </div>

          <button
            className="w-full bg-red-600 text-white p-2 rounded-lg font-semibold mb-3"
            onClick={handleNextStep}
          >
            Próxima etapa
          </button>

          <p className="text-xs text-center">
            Ao continuar você concorda com essa{" "}
            <span className="text-red-600 underline">Política de Serviço</span> e{" "}
            <span className="text-red-600 underline">termos de uso</span>
          </p>

          {/* RESUMO: aparece se já salvou */}
          {savedDriver && (
            <div className="mt-6 w-full bg-gray-50 border p-4 rounded-lg">
              <h2 className="font-bold mb-2">Resumo do cadastro</h2>
              <div className="flex gap-4">
                <div>
                  {savedDriver.profileDataUrl ? (
                    <img src={savedDriver.profileDataUrl} alt="perfil salvo" className="w-24 h-24 object-cover rounded-full" />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full">No foto</div>
                  )}
                </div>
                <div className="flex-1">
                  <p><strong>Nome:</strong> {savedDriver.name}</p>
                  <p><strong>Email:</strong> {savedDriver.email}</p>
                  <p><strong>Celular:</strong> {savedDriver.phone}</p>
                  <p><strong>CPF:</strong> {savedDriver.cpf}</p>
                  <p><strong>Comprovante:</strong> {savedDriver.addressProof || "—"}</p>
                  <p className="text-xs text-gray-500 mt-1">Salvo em: {new Date(savedDriver.savedAt).toLocaleString()}</p>
                </div>
              </div>

              {savedDriver.rgDataUrls && savedDriver.rgDataUrls.length > 0 && (
                <div className="mt-3">
                  <strong>RGs salvos:</strong>
                  <div className="flex gap-2 mt-2">
                    {savedDriver.rgDataUrls.map((d, i) => (
                      <img key={i} src={d} alt={`rg-saved-${i}`} className="w-20 h-20 object-cover" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
