import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [checked, setChecked] = useState(false);
  const [vehicle, setVehicle] = useState(""); // novo estado
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!name || !cpf || !phone || !vehicle) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    const userData = {
      name,
      cpf,
      phone,
      vehicle,
      marketing: checked,
      loggedIn: true,
    };

    localStorage.setItem("user", JSON.stringify(userData));

    alert(`Bem-vindo, ${name}!`);

    // Redireciona conforme o tipo de veículo
    if (vehicle === "carro") {
      navigate("/carregistration");
    } else if (vehicle === "moto") {
      navigate("/motorcycle-registration");
    }
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

      {/* CONTEÚDO CENTRAL */}
      <div className="flex flex-col items-center justify-center mt-20">
        <div className="bg-black text-white p-10 rounded-3xl w-96 text-center">
          <h2 className="text-xl font-bold mb-6">Entre na sua conta</h2>

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
            type="text"
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mb-6 px-4 py-3 rounded-full bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
          />

          {/* Seleção de veículo */}
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
            className="w-full bg-white text-black font-semibold py-3 rounded-full hover:bg-gray-200 transition"
            onClick={handleLogin}
          >
            Continuar
          </button>

          {/* Checkbox */}
          <div className="flex items-start text-xs text-left mt-4">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
              className="mr-2 mt-0.5 accent-white"
            />
            <p>
              Concordo em fornecer meus dados para receber conteúdos e ofertas por{" "}
              <span className="font-bold underline">e-mail</span>.
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
          © Webtagger - 2024 Todos os Direitos Reservados
        </p>
      </footer>
    </div>
  );
}
