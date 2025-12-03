import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import { Line, Bar } from "react-chartjs-2";
import { motion } from "framer-motion";

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement
);

export default function HabitDetail() {
  const { id } = useParams();
  const [habit, setHabit] = useState(null);
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [isTodayDone, setIsTodayDone] = useState(false);

  // Cargar datos iniciales
  useEffect(() => {
    api.get("/habits/").then((res) => {
      const h = res.data.find((x) => x.id == id);
      setHabit(h);
    });

    api.get(`/habits/${id}/stats`).then((res) => {
      setStats(res.data);
    });

    api.get(`/habits/${id}/charts`).then((res) => {
      setCharts(res.data);

      // Detectamos si HOY está completado
      const today = new Date().toISOString().slice(0, 10);
      const found = res.data.daily.find((d) => d.date === today);
      if (found?.completed) setIsTodayDone(true);
    });
  }, [id]);

  if (!habit || !stats || !charts) return <p>Cargando...</p>;

  // === DAILY CHART ===
  const dailyLabels = charts.daily.map((d) => d.date.slice(5));
  const dailyData = charts.daily.map((d) => (d.completed ? 1 : 0));

  // === WEEKLY BAR CHART ===
  const weeklyLabels = charts.weekly.map((w) => w.week);
  const weeklyData = charts.weekly.map((w) => w.completed);

  // === MARCAR HOY ===
  const toggleToday = async () => {
    const today = new Date().toISOString().slice(0, 10);

    await api.post(`/habits/${id}/log`, {
      date: today,
      completed: !isTodayDone,
    });

    setIsTodayDone(!isTodayDone);

    api.get(`/habits/${id}/stats`).then((res) => setStats(res.data));
    api.get(`/habits/${id}/charts`).then((res) => setCharts(res.data));
  };

  // === TOGGLE DE DÍA EN CALENDARIO ===
  const toggleDay = async (dateStr, currentCompleted) => {
    await api.post(`/habits/${id}/log`, {
      date: dateStr,
      completed: !currentCompleted,
    });

    const today = new Date().toISOString().slice(0, 10);
    if (dateStr === today) {
      setIsTodayDone(!currentCompleted);
    }

    api.get(`/habits/${id}/stats`).then((res) => setStats(res.data));
    api.get(`/habits/${id}/charts`).then((res) => setCharts(res.data));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Encabezado */}
      <motion.div
        className="flex justify-between items-center mb-6"
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div>
          <h1 className="text-4xl font-bold">
            {habit.name}
            <span className="text-purple-400"> · Detalle</span>
          </h1>

          {habit.description && (
            <p className="text-gray-300 mt-2">{habit.description}</p>
          )}
        </div>

        <motion.button
          onClick={toggleToday}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.94 }}
          className={`px-6 py-3 rounded-xl text-lg font-semibold shadow-lg transition 
            ${
              isTodayDone
                ? "bg-green-600 hover:bg-green-700"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
        >
          {isTodayDone ? "✔ Completado hoy" : "Marcar hoy"}
        </motion.button>
      </motion.div>

      {/* Resumen de rachas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta 1 */}
        <motion.div
          className="p-6 bg-gray-800 rounded-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-xl font-bold">🔥 Racha actual</h3>
          <p className="text-purple-400 text-3xl font-bold">
            {stats.current_streak} días
          </p>
        </motion.div>

        {/* Tarjeta 2 */}
        <motion.div
          className="p-6 bg-gray-800 rounded-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <h3 className="text-xl font-bold">🏆 Mejor racha</h3>
          <p className="text-green-400 text-3xl font-bold">
            {stats.best_streak} días
          </p>
        </motion.div>

        {/* Tarjeta 3 */}
        <motion.div
          className="p-6 bg-gray-800 rounded-xl"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="text-xl font-bold">📊 Porcentaje</h3>
          <p className="text-blue-400 text-3xl font-bold">
            {stats.percentage}%
          </p>
        </motion.div>
      </div>

      {/* PROGRESO DIARIO */}
      <motion.div
        className="bg-gray-900 p-6 rounded-xl shadow-lg mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-xl mb-4">📈 Progreso diario (últimos 30 días)</h2>
        <Line
          data={{
            labels: dailyLabels,
            datasets: [
              {
                label: "Completado",
                data: dailyData,
                borderColor: "#a855f7",
                backgroundColor: "rgba(168, 85, 247, 0.4)",
                tension: 0.4,
              },
            ],
          }}
        />
      </motion.div>

      {/* PROGRESO SEMANAL */}
      <motion.div
        className="bg-gray-900 p-6 rounded-xl shadow-lg mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-xl mb-4">📊 Progreso semanal</h2>
        <Bar
          data={{
            labels: weeklyLabels,
            datasets: [
              {
                label: "Completados",
                data: weeklyData,
                backgroundColor: "#4f46e5",
              },
            ],
          }}
        />
      </motion.div>

      {/* CALENDARIO VISUAL */}
      <motion.div
        className="bg-gray-900 p-6 rounded-xl shadow-lg mb-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h2 className="text-xl mb-4">📅 Calendario visual (últimos 30 días)</h2>

        <div className="grid grid-cols-7 gap-3 text-center text-sm">
          {charts.daily.map((d, i) => {
            const label = new Date(d.date).getDate();

            return (
              <motion.button
                key={i}
                onClick={() => toggleDay(d.date, d.completed)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg border text-xs
                  ${
                    d.completed
                      ? "bg-green-600 border-green-400 text-white"
                      : "bg-gray-800 border-gray-600 text-gray-300"
                  }`}
              >
                <span className="font-bold">{label}</span>
                <span className="mt-1">{d.completed ? "✔" : "·"}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* HISTORIAL LISTA */}
      <motion.div
        className="bg-gray-800 p-6 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-4">📚 Historial (lista)</h2>

        <div className="flex flex-wrap gap-3">
          {charts.daily.map((d, i) => (
            <motion.div
              key={i}
              className={`px-4 py-2 rounded-lg text-sm font-semibold shadow 
                ${d.completed ? "bg-green-600" : "bg-gray-700"}`}
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
            >
              {d.date} → {d.completed ? "✔" : "✖"}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
