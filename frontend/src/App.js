import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import TaskList from "./pages/TaskList";
import ProtectedRoute from "./components/ProtectedRoute";
import Habits from "./pages/Habits";
import ProgressDashboard from "./pages/ProgressDashboard";
import AISidebar from "./components/AISidebar";
import ThemeToggle from "./components/ThemeToggle";
import PomodoroTimer from "./components/PomodoroTimer";

export default function App() {
  return (
    <Router>
      {/* Navbar with Theme Toggle */}
      <Navbar />
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px" }}>
        <ThemeToggle />
      </div>

      {/* Pomodoro Timer (global access, below toggle) */}
      <div style={{ padding: "10px 20px" }}>
        <PomodoroTimer />
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TaskList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/habits"
          element={
            <ProtectedRoute>
              <Habits />
            </ProtectedRoute>
          }
        />
        <Route
          path="/progress"
          element={
            <ProtectedRoute>
              <ProgressDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistant"
          element={
            <ProtectedRoute>
              <AISidebar />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}
