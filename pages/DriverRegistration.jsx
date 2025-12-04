import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api"; // Se a sua API estiver em outro lugar, me avise!


export default function DriverRegistration() {

  // ===== IMAGEM DA MOTO (SEM ERRO AGORA) =====
  const [motorcycleImage, setMotorcycleImage] = useState(null);

  const handleImage = (e) => {
    setMotorcycleImage(e.target.files[0]);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("motorcycle_image", motorcycleImage);

    await api.post("/driver/vehicle", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  };

  const navigate = useNavigate();

  // ===== ESTADOS DO FORMULÁRIO =====
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cpf, setCpf] = useState("");
  const [addressProof, setAddressProof] = useState("");

  // ===== UPLOADS E PREVIEWS =====
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [rgFiles, setRgFiles] = useState([]);       
  const [rgPreviews, setRgPreviews] = useState([]);

  // ===== DADOS SALVOS =====
  const [savedDriver, setSavedDriver] = useState(null);

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  // ===== HANDLERS =====
  const handleProfileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (profilePreview) URL.revokeObjectURL(profilePreview);

    setProfileFile(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  const handleRgUpload = (e) => {
    const files = Array.from(e.target.files || []).slice(0, 2);

    rgPreviews.forEach((p) => URL.revokeObjectURL(p));

    setRgFiles(files);
    setRgPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  // ===== SALVAR FORMULÁRIO =====
  const handleSave = async () => {
    if (!name || !email || !phone || !cpf) {
      alert("Preencha pelo menos Nome, Email, Celular e CPF.");
      return;
    }

    try {
      const profileDataUrl = await fileToDataUrl(profileFile);
      const rgDataUrls = await Promise.all(rgFiles.map((f) => fileToDataUrl(f)));

      const driverData = {
        name,
        password: password ? "(oculta)" : "",
        email,
        phone,
        cpf,
        addressProof,
        profileDataUrl,
        rgDataUrls,
        savedAt: new Date().toISOString(),
      };

      localStorage.setItem("driver", JSON.stringify(driverData));
      setSavedDriver(driverData);

      alert("Dados salvos com sucesso!");
    } catch (err) {
      console.error("Erro ao processar imagens:", err);
      alert("Erro ao processar as imagens.");
    }
  };

  // ===== CARREGAR DADOS SALVOS =====
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
      setAddressProof(parsed.addressProof || "");

      if (parsed.profileDataUrl) setProfilePreview(parsed.profileDataUrl);
      if (parsed.rgDataUrls) setRgPreviews(parsed.rgDataUrls);
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

  // ===== LIMPAR SALVOS =====
  const handleClearSaved = () => {
    localStorage.removeItem("driver");
    setSavedDriver(null);
    alert("Dados removidos. Edite e salve novamente.");
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

          {/* FOTO DE PERFIL */}
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

          <input
            type="text"
            placeholder="Comprovante de residência"
            className="mb-3 w-full p-2 rounded-lg border bg-gray-100"
            value={addressProof}
            onChange={(e) => setAddressProof(e.target.value)}
          />

          {/* RG UPLOAD */}
          <label className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-6 w-full flex flex-col items-center cursor-pointer">
            <div className="w-full flex justify-center gap-2">
              {rgPreviews.length > 0 ? (
                rgPreviews.map((img, idx) => (
                  <img key={idx} src={img} className="w-20 h-20 object-cover" />
                ))
              ) : (
                <div className="text-4xl">📷</div>
              )}
            </div>

            <div className="mt-2 text-sm text-gray-600">
              Frente e verso {rgPreviews.length}/2
            </div>

            <input type="file" accept="image/*" multiple className="hidden" onChange={handleRgUpload} />
          </label>

          {/* BOTÕES */}
          <div className="w-full flex gap-2 mb-3">
            <button className="flex-1 bg-gray-200 text-black p-2 rounded-lg font-semibold" onClick={handleSave}>
              Salvar informações
            </button>

            <button className="bg-white border p-2 rounded-lg" onClick={handleClearSaved}>
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
            Ao continuar você concorda com a{" "}
            <span className="text-red-600 underline">Política de Serviço</span> e{" "}
            <span className="text-red-600 underline">Termos de uso</span>.
          </p>

          {/* RESUMO */}
          {savedDriver && (
            <div className="mt-6 w-full bg-gray-50 border p-4 rounded-lg">
              <h2 className="font-bold mb-2">Resumo do cadastro</h2>

              <div className="flex gap-4">
                <div>
                  {savedDriver.profileDataUrl ? (
                    <img src={savedDriver.profileDataUrl} className="w-24 h-24 object-cover rounded-full" />
                  ) : (
                    <div className="w-24 h-24 flex items-center justify-center bg-gray-200 rounded-full">
                      Sem foto
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <p><strong>Nome:</strong> {savedDriver.name}</p>
                  <p><strong>Email:</strong> {savedDriver.email}</p>
                  <p><strong>Celular:</strong> {savedDriver.phone}</p>
                  <p><strong>CPF:</strong> {savedDriver.cpf}</p>
                  <p><strong>Comprovante:</strong> {savedDriver.addressProof || "—"}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Salvo em: {new Date(savedDriver.savedAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {savedDriver.rgDataUrls?.length > 0 && (
                <div className="mt-3">
                  <strong>RGs salvos:</strong>
                  <div className="flex gap-2 mt-2">
                    {savedDriver.rgDataUrls.map((d, i) => (
                      <img key={i} src={d} className="w-20 h-20 object-cover" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
