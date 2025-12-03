import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/habits/")
      .then((res) => setHabits(res.data))
      .catch(() => setError("No pudimos cargar tus hábitos. Intenta nuevamente."))
      .finally(() => setLoading(false));
  }, []);

  const quickStats = useMemo(() => {
    const total = habits.length;
    const withDescription = habits.filter((h) => h.description).length;
    return [
      { label: "Hábitos activos", value: total },
      { label: "Con descripción", value: withDescription },
      { label: "Última actualización", value: new Date().toLocaleDateString() },
    ];
  }, [habits]);

  return (
    <motion.div
      className="min-h-screen text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-wrap items-start justify-between gap-6 pb-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Resumen</p>
          <h1 className="text-4xl font-black">
            Tus <span className="text-purple-400">hábitos</span> en un vistazo
          </h1>
          <p className="mt-2 max-w-2xl text-gray-300">
            Controla tus rachas, identifica brechas y celebra logros con un tablero
            limpio y enfocado en la constancia diaria.
          </p>
          <div className="mt-4 flex gap-3">
            <button
              onClick={() => navigate("/create-habit")}
              className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold shadow-lg shadow-purple-900/50 transition hover:bg-purple-700"
            >
              + Crear hábito
            </button>
            <button
              onClick={() => navigate("/achievements")}
              className="rounded-lg border border-purple-700/60 px-4 py-2 text-sm font-semibold text-purple-200 transition hover:border-purple-400"
            >
              Ver logros
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 rounded-2xl border border-purple-900/40 bg-black/40 p-4 shadow-lg shadow-purple-950/40">
          {quickStats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-xs uppercase tracking-widest text-purple-300/80">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-purple-100">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div
              key={idx}
              className="h-36 animate-pulse rounded-2xl border border-purple-900/30 bg-gray-900/70"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {!loading && !error && habits.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-purple-700/50 bg-black/40 p-10 text-center text-gray-300">
          <p className="text-xl font-semibold text-purple-200">No tienes hábitos aún</p>
          <p className="mt-2 max-w-xl text-sm text-gray-400">
            Comenzá con un hábito sencillo. Podés añadir metas, frecuencia y descripción
            para darle más contexto a tu rutina.
          </p>
          <button
            onClick={() => navigate("/create-habit")}
            className="mt-4 rounded-lg bg-purple-600 px-5 py-2 text-sm font-semibold shadow-lg shadow-purple-900/50 transition hover:bg-purple-700"
          >
            Crear mi primer hábito
          </button>
        </div>
      )}

      {!loading && !error && habits.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              onClick={() => navigate(`/habit/${habit.id}`)}
              className="group cursor-pointer rounded-2xl border border-purple-900/40 bg-gradient-to-br from-gray-900 to-black p-6 shadow-xl shadow-black/60 transition hover:-translate-y-1 hover:border-purple-500/60"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-widest text-purple-300/80">Hábito</p>
                  <h2 className="text-xl font-semibold text-white">{habit.name}</h2>
                </div>
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-bold text-purple-200">
                  {habit.frequency || "--"}
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm text-gray-300">
                {habit.description || "Sin descripción"}
              </p>

              <div className="mt-6 flex items-center justify-between text-sm text-gray-300">
                <span className="flex items-center gap-2 font-semibold text-purple-200">
                  🔥 Racha
                </span>
                <HabitStreak habitId={habit.id} />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function HabitStreak({ habitId }) {
  const [streak, setStreak] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    api
      .get(`/habits/${habitId}/stats`)
      .then((res) => setStreak(res.data.current_streak))
      .catch(() => setError(true));
  }, [habitId]);

  if (error) {
    return <span className="text-red-300">Sin datos</span>;
  }
  if (streak === null) return <span className="text-gray-500">...</span>;

  return <span className="font-bold text-purple-400">{streak} días</span>;
}
