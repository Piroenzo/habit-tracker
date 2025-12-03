import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateHabit from "./pages/CreateHabit";
import HabitDetail from "./pages/HabitDetail";
import Achievements from "./pages/Achievements";
import Layout from "./components/Layout";

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
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        <Route
          path="/create-habit"
          element={
            <Layout>
              <CreateHabit />
            </Layout>
          }
        />

        <Route
          path="/habit/:id"
          element={
            <Layout>
              <HabitDetail />
            </Layout>
          }
        />

        <Route
          path="/achievements"
          element={
            <Layout>
              <Achievements />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
