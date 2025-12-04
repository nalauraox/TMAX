import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  const goHome = () => {
    navigate("/RoutesToDo");
  };

  const handlePhotoUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const updatedUser = { ...user, profileDataUrl: reader.result };
      setUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    };

    reader.readAsDataURL(file);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Você não está logado
        </h2>
        <Link
          to="/login"
          className="bg-black text-white px-6 py-3 rounded-full mt-4 hover:bg-gray-900 transition"
        >
          Fazer Login
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">

      {/* NAV BAR enviada por você */}
      <nav className="relative bg-black text-white flex items-center justify-center gap-10 w-full py-3">
        
        <Link
          to="/"
          className="absolute left-6 text-lg font-semibold hover:underline cursor-pointer"
        >
          ← Voltar
        </Link>

        <button
          onClick={goHome}
          className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded transition duration-200"
        >
          Home
        </button>

        <img src="/logo.png" alt="Logo" className="h-20" />

      </nav>

      {/* CONTEÚDO */}
      <div className="flex flex-col items-center mt-10 px-6 w-full">

       {/* FOTO */}
<div className="flex flex-col items-center">
  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-red-600 shadow-xl">
    {user.profileDataUrl ? (
      <img
        src={user.profileDataUrl}
        alt="Foto de perfil"
        className="w-full h-full object-cover"
      />
    ) : (
      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-700 font-semibold">
        Sem Foto
      </div>
    )}
  </div>

  <label className="mt-4 bg-black text-white px-4 py-2 rounded-full cursor-pointer hover:bg-gray-900 transition text-sm">
    {user.profileDataUrl ? "Editar Foto" : "Adicionar Foto"}
    <input
      type="file"
      accept="image/*"
      onChange={handlePhotoUpload}
      className="hidden"
    />
  </label>
</div>


        {/* INFORMAÇÕES */}
        <div className="bg-white shadow-lg rounded-3xl p-8 mt-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Meu Perfil
          </h2>

          <div className="space-y-4">
            <p><span className="font-semibold text-gray-700">Nome:</span> {user.name}</p>
            <p><span className="font-semibold text-gray-700">E-mail:</span> {user.email}</p>
            <p><span className="font-semibold text-gray-700">Telefone:</span> {user.phone}</p>
            <p><span className="font-semibold text-gray-700">CPF:</span> {user.cpf}</p>
            <p><span className="font-semibold text-gray-700">Veículo:</span> Moto</p>
          </div>

         <button
  onClick={handleLogout}
  className="mt-8 w-full bg-red-600 text-white font-semibold py-3 rounded-full hover:bg-red-700 transition"
>
  Sair da Conta
</button>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-50 text-center py-6 mt-auto border-t w-full">
        <p className="text-sm text-gray-500">
          © Turma Senac Tec - 2025 Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}
