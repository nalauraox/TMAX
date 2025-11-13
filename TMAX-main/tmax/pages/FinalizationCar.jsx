import { useNavigate, Link } from "react-router-dom";

export default function FinalizationCar() {
  const navigate = useNavigate();

  const handleFinalize = () => {
    // Aqui você pode adicionar lógica extra antes de navegar, se quiser
    navigate("/RoutesToDo"); // redireciona para a página RoutesToDo
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
      {/* ===== MAIN ===== */}
      <main className="flex justify-center py-10 px-6 flex-1 w-full">
        {/* Barra de progresso */}
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
            <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
            <span className="text-red-600 font-semibold">Finalização</span>
          </div>
        </div>

        {/* Resumo / Formulário */}
        <div className="w-[400px] flex flex-col items-center">
          <h1 className="text-2xl font-bold mb-6">Finalização do Cadastro do Carro</h1>

          {/* Resumo do cadastro */}
          <div className="w-full bg-gray-100 p-4 rounded-lg mb-6">
            <h2 className="font-semibold mb-2">Resumo do Cadastro:</h2>
            <p><strong>Nome:</strong> João da Silva</p>
            <p><strong>Email:</strong> joao@email.com</p>
            <p><strong>Celular:</strong> (11) 99999-9999</p>
            <p><strong>CPF:</strong> 000.000.000-00</p>
            <p><strong>Carro:</strong> Toyota Corolla, Placa DEF-5678</p>
            <p><strong>Cor:</strong> Prata</p>
            <p><strong>RENAVAM:</strong> 12345678900</p>
          </div>

          {/* Botão de finalização */}
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

      {/* ===== FOOTER ===== */}
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
