import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";

const frequencyOptions = [
  { value: "daily", label: "Diario" },
  { value: "weekly", label: "Semanal" },
  { value: "monthly", label: "Mensual" },
];

export default function CreateHabit() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goalValue, setGoalValue] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ type: "", message: "" });

    if (!name.trim()) {
      setFeedback({ type: "error", message: "El nombre del hábito es obligatorio." });
      return;
    }

    const parsedGoal = goalValue === "" ? null : parseInt(goalValue, 10);
    if (goalValue !== "" && Number.isNaN(parsedGoal)) {
      setFeedback({ type: "error", message: "La meta debe ser un número válido." });
      return;
    }

    setLoading(true);
    try {
      await api.post("/habits/", {
        name,
        description,
        frequency,
        goal_value: parsedGoal,
      });
      setFeedback({ type: "success", message: "Hábito creado correctamente." });
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "No pudimos crear el hábito. Reintentá." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Nuevo hábito</p>
        <h1 className="text-4xl font-black">
          Diseña una rutina <span className="text-purple-400">consistente</span>
        </h1>
        <p className="mt-2 text-gray-300">
          Establecé objetivos claros, frecuencia y una descripción para mantenerte motivado.
        </p>
      </div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-3xl space-y-4 rounded-2xl border border-purple-900/40 bg-black/50 p-8 shadow-xl shadow-purple-950/40"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm text-gray-300">Nombre del hábito *</label>
            <input
              type="text"
              className="w-full rounded-lg border border-purple-900/40 bg-gray-900 px-4 py-3 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              placeholder="Ej: Meditar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-gray-300">Meta opcional (número)</label>
            <input
              type="number"
              className="w-full rounded-lg border border-purple-900/40 bg-gray-900 px-4 py-3 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
              placeholder="Ej: 30 minutos"
              value={goalValue}
              onChange={(e) => setGoalValue(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Descripción</label>
          <textarea
            className="min-h-[120px] w-full rounded-lg border border-purple-900/40 bg-gray-900 px-4 py-3 text-white outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
            placeholder="Explica por qué este hábito es importante para vos"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-gray-300">Frecuencia</label>
          <div className="grid gap-3 sm:grid-cols-3">
            {frequencyOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setFrequency(option.value)}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  frequency === option.value
                    ? "border-purple-500 bg-purple-500/20 text-purple-100"
                    : "border-purple-900/40 bg-gray-900 text-gray-200 hover:border-purple-700"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {feedback.message && (
          <div
            className={`rounded-lg px-4 py-3 text-sm ${
              feedback.type === "success"
                ? "border border-green-500/40 bg-green-500/10 text-green-200"
                : "border border-red-500/40 bg-red-500/10 text-red-200"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-purple-600 px-6 py-3 text-sm font-semibold shadow-lg shadow-purple-900/40 transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creando..." : "Guardar hábito"}
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-purple-800 px-6 py-3 text-sm font-semibold text-purple-100 transition hover:border-purple-500"
          >
            Cancelar
          </button>
        </div>
      </motion.form>
    </div>
  );
}
