import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { useAuth } from "../store/useAuth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const setToken = useAuth((state) => state.setToken);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      if (!data?.access_token) {
        throw new Error("Token no recibido");
      }
      setToken(data.access_token);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas o servicio no disponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg rounded-2xl border border-purple-900/40 bg-black/60 p-8 shadow-2xl shadow-purple-950/50 backdrop-blur"
      >
        <div className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Bienvenido</p>
          <h1 className="mt-2 text-3xl font-black">
            Reinicia tus <span className="text-purple-400">hábitos</span>
          </h1>
          <p className="mt-2 text-gray-400">
            Iniciá sesión para seguir tus objetivos diarios y desbloquear logros.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-purple-900/40 bg-gray-900 px-4 py-3 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              placeholder="usuario@correo.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-purple-900/40 bg-gray-900 px-4 py-3 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-purple-600 px-4 py-3 text-lg font-semibold tracking-wide shadow-lg shadow-purple-900/50 transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm text-gray-300">
          <span>¿No tenés cuenta?</span>
          <button
            onClick={() => navigate("/register")}
            className="font-semibold text-purple-300 transition hover:text-purple-200"
          >
            Crear una cuenta
          </button>
        </div>
      </motion.div>
    </div>
  );
}
