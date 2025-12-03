import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const setToken = useAuth((state) => state.setToken);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Registrar usuario
      const res = await api.post("/auth/register", { email, password });

      // Si el backend devuelve token: iniciamos sesión automático
      if (res.data?.token) {
        setToken(res.data.token);
        return navigate("/dashboard");
      }

      // Si el backend NO devuelve token → pedir login manual
      alert("Registro exitoso. Ahora inicia sesión.");
      navigate("/");
    } catch (error) {
      console.log(error);
      alert("Error al registrar. ¿El email ya existe?");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-xl w-80">
        <h1 className="text-2xl font-bold mb-6">Crear Cuenta</h1>

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
          Registrarme
        </button>

        <p className="mt-3 text-gray-400 text-sm">
          ¿Ya tenés cuenta?
          <span
            className="text-purple-400 cursor-pointer ml-1"
            onClick={() => navigate("/")}
          >
            Iniciar Sesión
          </span>
        </p>
      </form>
    </div>
  );
}
