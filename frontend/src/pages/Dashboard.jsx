import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [habits, setHabits] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/habits/")
      .then((res) => setHabits(res.data))
      .catch(() => console.log("Error cargando hábitos"));
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Encabezado */}
      <header className="flex justify-between items-center mb-10">
        <motion.h1
          className="text-4xl font-bold"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          Hábitos <span className="text-purple-400">Activos</span>
        </motion.h1>

        <motion.button
          onClick={() => navigate("/create-habit")}
          className="px-5 py-2 bg-purple-600 hover:bg-purple-700 transition rounded-lg shadow-lg shadow-purple-500/30"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          + Crear hábito
        </motion.button>
      </header>

      {/* Grid de hábitos */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {habits.length === 0 && (
          <p className="text-gray-400">Todavía no tenés hábitos creados.</p>
        )}

        {habits.map((habit, index) => (
          <motion.div
            key={habit.id}
            onClick={() => navigate(`/habit/${habit.id}`)}
            className="cursor-pointer p-6 rounded-xl bg-gray-800/60 backdrop-blur-sm
                       hover:bg-gray-800 hover:scale-[1.02] transition-all
                       shadow-lg shadow-black border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1, // animación escalonada
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <h2 className="text-xl font-semibold mb-2">{habit.name}</h2>

            <p className="text-gray-400 text-sm mb-4">
              {habit.description || "Sin descripción"}
            </p>

            <div className="flex justify-between text-sm text-gray-300">
              <span className="flex items-center gap-1">🔥 Racha</span>
              <HabitStreak habitId={habit.id} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// =============================
// COMPONENTE: HabitStreak
// =============================
function HabitStreak({ habitId }) {
  const [streak, setStreak] = useState(null);

  useEffect(() => {
    api
      .get(`/habits/${habitId}/stats`)
      .then((res) => setStreak(res.data.current_streak))
      .catch(() => setStreak(0));
  }, [habitId]);

  if (streak === null) return <span>...</span>;

  return <span className="font-bold text-purple-400">{streak} días</span>;
}
