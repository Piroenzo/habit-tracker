import { useEffect, useState } from "react";
import api from "../api/axios";
import { ALL_ACHIEVEMENTS } from "../data/achievementsList";

export default function Achievements() {
  const [unlocked, setUnlocked] = useState([]);

  useEffect(() => {
    api
      .get("/habits/achievements")
      .then((res) => setUnlocked(res.data))
      .catch(() => {});
  }, []);

  const unlockedKeys = unlocked.map((a) => a.title);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">
        🏆 Tus <span className="text-purple-400">Logros</span>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_ACHIEVEMENTS.map((ach) => {
          const isUnlocked = unlockedKeys.includes(ach.key);
          const unlockedData = unlocked.find((a) => a.title === ach.key);

          return (
            <div
              key={ach.key}
              className={`
                p-6 rounded-xl border shadow-lg transition transform
                ${
                  isUnlocked
                    ? "bg-gray-800 border-purple-500 shadow-purple-500/40 scale-105"
                    : "bg-gray-700/30 border-gray-600 opacity-50 grayscale"
                }
              `}
            >
              <div className="text-5xl mb-3 text-center">{ach.icon}</div>

              <h2 className="text-xl font-bold text-center">{ach.title}</h2>

              <p className="text-gray-300 text-center mt-2">
                {ach.description}
              </p>

              {isUnlocked && (
                <p className="text-sm text-green-400 mt-3 text-center">
                  Obtenido el{" "}
                  {new Date(unlockedData.unlocked_at).toLocaleDateString()}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
