import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // <-- import necessário

export default function DriverRegistration() {
  const [profileImage, setProfileImage] = useState(null);
  const [rgImages, setRgImages] = useState([]);

  const navigate = useNavigate(); // <-- hook de navegação

  const handleProfileUpload = (e) => {
    const file = e.target.files[0];
    if (file) setProfileImage(URL.createObjectURL(file));
  };

  const handleRgUpload = (e) => {
    const files = Array.from(e.target.files).slice(0, 2);
    setRgImages(files.map((file) => URL.createObjectURL(file)));
  };

  // Função para ir para a próxima etapa
  const handleNextStep = () => {
    navigate("/motorcycle-registration"); // redireciona para cadastro da moto
  };

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans">
      {/* NAVBAR compartilhada */}
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
    Comissão
  </Link>

  <img src="/logo.png" alt="Logo" className="h-20" />

  <Link
    to="/profile"
    className="text-2xl font-bold hover:underline cursor-pointer"
  >
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
          <label className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-4 flex flex-col items-center cursor-pointer">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-24 h-24 object-cover rounded-full" />
            ) : (
              <div className="text-center">
                <div className="text-4xl">📷</div>
                <div>Foto de perfil</div>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleProfileUpload} />
          </label>

          {/* Input Fields */}
          <input type="text" placeholder="Nome completo" className="mb-3 w-full p-2 rounded-lg border bg-gray-100" />
          <div className="flex w-full gap-3 mb-3">
            <input type="password" placeholder="Senha" className="flex-1 p-2 rounded-lg border bg-gray-100" />
            <input type="email" placeholder="Email" className="flex-1 p-2 rounded-lg border bg-gray-100" />
          </div>
          <div className="flex w-full gap-3 mb-3">
            <input type="text" placeholder="Celular" className="flex-1 p-2 rounded-lg border bg-gray-100" />
            <input type="text" placeholder="CPF" className="flex-1 p-2 rounded-lg border bg-gray-100" />
          </div>
          <input type="text" placeholder="Comprovante de residencia" className="mb-3 w-full p-2 rounded-lg border bg-gray-100" />

          {/* RG Upload */}
          <label className="border-2 border-dashed border-gray-600 rounded-lg p-4 mb-6 w-full flex flex-col items-center cursor-pointer">
            <div className="w-full flex justify-center gap-2">
              {rgImages.length > 0
                ? rgImages.map((img, idx) => <img key={idx} src={img} alt={`RG ${idx}`} className="w-20 h-20 object-cover" />)
                : <div className="text-4xl">📷</div>}
            </div>
            <div className="mt-2 text-sm text-gray-600">Frente e verso 0/2 imagens</div>
            <input type="file" accept="image/*" className="hidden" multiple onChange={handleRgUpload} />
          </label>

          {/* Botão que leva para a próxima página */}
          <button
            className="w-full bg-gray-200 text-black p-2 rounded-lg font-semibold mb-3"
            onClick={handleNextStep}
          >
            Concluir esta etapa
          </button>

          <p className="text-xs text-center">
            Ao continuar você concorda com essa <span className="text-red-600 underline">Política de Serviço</span> e <span className="text-red-600 underline">termos de uso</span>
          </p>
        </div>
      </main>

      {/* ===== Footer ===== */}
      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full">
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
          © Webtagger - 2024 Todos os Direitos Reservados
        </p>
      </footer>
    </div>
  );
}
