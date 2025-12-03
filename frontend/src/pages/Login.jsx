import { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 FORMA CORRECTA DE ZUSTAND
  const setToken = useAuth((state) => state.setToken);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/auth/login", { email, password });

      console.log("LOGIN RESPONSE:", data);

      // 🔥 GUARDAMOS EL TOKEN CORRECTO
      setToken(data.access_token);

      navigate("/dashboard");
    } catch {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl w-80">
        <h1 className="text-2xl font-bold mb-6">Iniciar Sesión</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 rounded bg-gray-700"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 mb-6 rounded bg-gray-700"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-purple-600 py-2 rounded hover:bg-purple-700">
          Entrar
        </button>

        <p className="mt-3 text-gray-400 text-sm">
          ¿No tenés cuenta?
          <span
            className="text-purple-400 cursor-pointer ml-1"
            onClick={() => navigate("/register")}
          >
            Registrate
          </span>
        </p>
      </form>
    </div>
  );
}
