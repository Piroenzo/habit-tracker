import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import MotionContainer from "./MotionContainer";

const navLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/create-habit", label: "Crear hábito" },
  { to: "/achievements", label: "Logros" },
];

export default function Layout({ children }) {
  const logout = useAuth((s) => s.logout);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
      <nav className="sticky top-0 z-10 w-full backdrop-blur border-b border-purple-900/30 bg-black/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div
            className="cursor-pointer text-2xl font-black tracking-tight"
            onClick={() => navigate("/dashboard")}
          >
            Habit<span className="text-purple-400">Tracker</span>
          </div>

          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition hover:text-purple-300 ${
                    isActive ? "text-purple-400" : "text-gray-300"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold shadow-lg shadow-red-900/40 transition hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <MotionContainer>{children}</MotionContainer>
      </div>
    </div>
  );
}
