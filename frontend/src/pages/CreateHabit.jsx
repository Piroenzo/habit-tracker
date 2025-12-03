import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreateHabit() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [goalValue, setGoalValue] = useState("");
  const [frequency, setFrequency] = useState("daily");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("El nombre del hábito es obligatorio");
      return;
    }

    // Convertimos goalValue a null si está vacío
    const parsedGoal =
      goalValue === "" || goalValue === null ? null : parseInt(goalValue);

    try {
      await api.post("/habits/", {
        name,
        description,
        frequency,
        goal_value: parsedGoal,
      });

      alert("Hábito creado correctamente");
      navigate("/dashboard");
    } catch (error) {
      console.log("Error creando hábito:", error);
      alert("Error creando el hábito");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800/60 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md border border-gray-700"
      >
        <h1 className="text-3xl font-bold mb-6 text-purple-400">
          Crear Nuevo Hábito
        </h1>

        {/* Nombre */}
        <label className="block mb-2">Nombre del hábito *</label>
        <input
          type="text"
          className="w-full p-3 rounded bg-gray-700 mb-4 outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Ej: Ir al gimnasio"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Descripción */}
        <label className="block mb-2">Descripción (opcional)</label>
        <textarea
          className="w-full p-3 rounded bg-gray-700 mb-4 outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Ej: 30 minutos de cardio"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {/* Frecuencia */}
        <label className="block mb-2">Frecuencia</label>
        <select
          className="w-full p-3 rounded bg-gray-700 mb-4 outline-none focus:ring-2 focus:ring-purple-500"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
        >
          <option value="daily">Diario</option>
          <option value="weekly">Semanal</option>
          <option value="custom">Personalizado</option>
        </select>

        {/* Valor objetivo */}
        <label className="block mb-2">Meta (opcional)</label>
        <input
          type="number"
          className="w-full p-3 rounded bg-gray-700 mb-4 outline-none focus:ring-2 focus:ring-purple-500"
          placeholder="Ej: 30 (minutos)"
          value={goalValue}
          onChange={(e) => setGoalValue(e.target.value)}
        />

        {/* Botón */}
        <button className="w-full bg-purple-600 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition shadow-lg shadow-purple-500/30">
          Crear hábito
        </button>

        <p
          className="mt-4 text-purple-400 cursor-pointer text-center hover:underline"
          onClick={() => navigate("/dashboard")}
        >
          ← Volver al dashboard
        </p>
      </form>
    </div>
  );
}
