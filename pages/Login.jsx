import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");   
  const [password, setPassword] = useState(""); 
  const [checked, setChecked] = useState(false);
  const [vehicle, setVehicle] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password || !vehicle) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    // Carregar usuários cadastrados
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const existingUser = storedUsers.find((u) => u.email === email);

    if (!existingUser) {
      alert("Este e-mail não está cadastrado!");
      return;
    }

    if (existingUser.password !== password) {
      alert("Senha incorreta! Tente novamente.");
      return;
    }

    // 🔥 Salva no formato EXATO que o Profile espera 🔥
    const userData = {
      name: existingUser.name,
      nome: existingUser.name,
      email: existingUser.email,
      phone: existingUser.phone,
      celular: existingUser.phone,
      cpf: existingUser.cpf,
      vehicle,
      marketing: checked,
      loggedIn: true,
      profileDataUrl: existingUser.profileDataUrl || null, // Foto de perfil
    };

    // Salva como o Profile espera:
    localStorage.setItem("currentUser", JSON.stringify(userData));

    alert("Login realizado com sucesso!");
    navigate("/RoutesToDo");
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        <Link
          to="/"
          className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
        >
          ← Voltar para home
        </Link>

        <img src="/logo.png" alt="Logo" className="h-20" />
      </nav>

      {/* CONTEÚDO */}
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="bg-black text-white p-10 rounded-3xl w-96 text-center">
          <h2 className="text-xl font-bold mb-6">Entre na sua conta</h2>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />

          {/* SENHA */}
          <div className="relative w-full mb-6">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer select-none text-black text-xl"
            >
              ⦿
            </span>
          </div>

          {/* VEÍCULO */}
          <div className="flex justify-center gap-6 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="vehicle"
                value="moto"
                checked={vehicle === "moto"}
                onChange={(e) => setVehicle(e.target.value)}
                className="accent-white"
              />
              Moto 🏍️
            </label>
          </div>

          <button
            className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition"
            onClick={handleLogin}
          >
            Continuar
          </button>

          <p className="mt-4 text-sm">
            Ainda não tem conta?{" "}
            <Link
              to="/register"
              className="underline text-red-400 hover:text-red-300"
            >
              Criar conta
            </Link>
          </p>

          <div className="flex items-start text-xs text-left mt-4">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
              className="mr-2 mt-0.5 accent-white"
            />
            <p>
              Concordo em fornecer meus dados para receber conteúdos e ofertas
              por <span className="font-bold underline">e-mail</span>.
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-50 text-center py-6 border-t mt-auto w-full">
        <div className="flex items-center justify-center gap-2 mb-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/174/174855.png"
            alt="Instagram"
            className="w-6 h-6"
          />
          <a
            href="https://www.instagram.com/tmaxrestaurante?igsh=MWk2NWpqbmNlazFjNw=="
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 font-medium hover:underline"
          >
            Siga nosso Instagram
          </a>
        </div>
        <p className="text-sm text-gray-500">
          © Turma Senac Tec - 2025 Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
