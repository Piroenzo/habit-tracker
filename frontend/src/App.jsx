import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateHabit from "./pages/CreateHabit";
import HabitDetail from "./pages/HabitDetail";
import Achievements from "./pages/Achievements";
import Layout from "./components/Layout";
import { useAuth } from "./store/useAuth";

function ProtectedRoute({ children }) {
  const token = useAuth((state) => state.token);
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PÚBLICAS */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PRIVADAS */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-habit"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateHabit />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/habit/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <HabitDetail />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/achievements"
          element={
            <ProtectedRoute>
              <Layout>
                <Achievements />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
