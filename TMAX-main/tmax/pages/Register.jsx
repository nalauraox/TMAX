import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [vehicle, setVehicle] = useState("");
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();

  const handleRegister = () => {
    if (!name || !cpf || !email || !phone || !password || !vehicle) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    const newUser = {
      name,
      cpf,
      email,
      phone,
      password,
      vehicle,
      marketing: checked,
      loggedIn: true,
    };

    // 🔹 Salva como 'driver' (para Finalization ler)
    localStorage.setItem("driver", JSON.stringify(newUser));
    // 🔹 Também salva como 'user' (compatibilidade)
    localStorage.setItem("user", JSON.stringify(newUser));

    alert("Conta criada com sucesso!");
    navigate("/finalization"); // Redireciona direto para a página de Finalização
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white">
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        <Link to="/" className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer">
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

      <div className="flex flex-col items-center justify-center mt-20">
        <div className="bg-black text-white p-10 rounded-3xl w-96 text-center">
          <h2 className="text-xl font-bold mb-6">Crie sua conta</h2>

          <input
            type="text"
            placeholder="Seu nome completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />
          <input
            type="text"
            placeholder="Telefone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />

          <div className="flex justify-center gap-6 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="vehicle"
                value="carro"
                checked={vehicle === "carro"}
                onChange={(e) => setVehicle(e.target.value)}
                className="accent-white"
              />
              Carro 🚗
            </label>

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
            onClick={handleRegister}
            className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition"
          >
            Criar Conta
          </button>

          <div className="flex items-start text-xs text-left mt-4">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
              className="mr-2 mt-0.5 accent-white"
            />
            <p>
              Concordo em receber ofertas e novidades por{" "}
              <span className="font-bold underline">e-mail</span>.
            </p>
          </div>

          <p className="mt-6 text-sm text-gray-300">
            Já tem uma conta?{" "}
            <Link to="/login" className="text-white font-semibold underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>

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
          © Webtagger - 2024 Todos os Direitos Reservados
        </p>
      </footer>
    </div>
  );
}
