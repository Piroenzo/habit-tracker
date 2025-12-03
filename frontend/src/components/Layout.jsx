import { useAuth } from "../store/useAuth";
import { useNavigate } from "react-router-dom";
import MotionContainer from "./MotionContainer";
export default function Layout({ children }) {
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* NAVBAR */}
      <nav className="w-full p-4 bg-gray-900/60 backdrop-blur border-b border-gray-700 flex justify-between items-center">
        <h1
          onClick={() => navigate("/dashboard")}
          className="text-xl font-bold cursor-pointer"
        >
          Habit<span className="text-purple-400">Tracker</span>
        </h1>

        <button
          onClick={() => {
            logout();
            navigate("/");
          }}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 transition rounded-lg"
        >
          Cerrar sesión
        </button>
      </nav>

      {/* CONTENIDO */}

      <div className="p-6">
        <MotionContainer>{children}</MotionContainer>
      </div>
    </div>
  );
}
