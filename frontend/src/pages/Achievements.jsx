import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import { ALL_ACHIEVEMENTS } from "../data/achievementsList";

export default function Achievements() {
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    api
      .get("/habits/achievements")
      .then((res) => setUnlocked(res.data || []))
      .catch(() => setUnlocked([]));
  }, []);

  const unlockedKeys = useMemo(() => unlocked.map((a) => a.title), [unlocked]);

  return (
    <div className="min-h-screen text-white">
      <div className="mb-8 max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Logros</p>
        <h1 className="text-4xl font-black">
          Celebra tus <span className="text-purple-400">hitos</span>
        </h1>
        <p className="mt-2 text-gray-300">
          Cada logro refleja tu constancia. Desbloquea más completando hábitos de forma consistente.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ALL_ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlockedKeys.includes(ach.key);
          const unlockedData = unlocked.find((a) => a.title === ach.key);

          return (
            <div
              key={ach.key}
              className={`relative overflow-hidden rounded-2xl border p-6 shadow-xl transition ${
                isUnlocked
                  ? "border-purple-500/60 bg-gradient-to-br from-purple-900/40 via-black to-gray-900"
                  : "border-purple-900/40 bg-gray-900/60 grayscale"
              }`}
            >
              {isUnlocked && (
                <span className="absolute right-4 top-4 rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-200">
                  Desbloqueado
                </span>
              )}
              <div className="text-5xl mb-3 text-center">{ach.icon}</div>

              <h2 className="text-xl font-bold text-center text-white">{ach.title}</h2>

              <p className="text-gray-300 text-center mt-2">{ach.description}</p>

              {isUnlocked && unlockedData?.unlocked_at && (
                <p className="text-sm text-green-300 mt-3 text-center">
                  Obtenido el {new Date(unlockedData.unlocked_at).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
