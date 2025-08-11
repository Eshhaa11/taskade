import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PlusCircle,
  CheckCircle,
  Calendar,
  Repeat,
  Info,
  XCircle,
  Flame,
  Trophy,
  ChevronRight,
  Loader2
} from 'lucide-react';
import '../styles/Habits.css';

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isCreating, setIsCreating] = useState(false);
  const [isCheckingIn, setIsCheckingIn] = useState(null);

  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("userName") || "User"; // Get from your auth system

  // Filter habits based on active tab
  const filteredHabits = habits.filter(habit => {
    if (activeTab === "all") return true;
    if (activeTab === "daily") return habit.frequency === "daily";
    if (activeTab === "weekly") return habit.frequency === "weekly";
    if (activeTab === "completed") return isCheckedInRecently(habit);
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if ((today - date) < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    }
  };

  const isCheckedInRecently = (habit) => {
    if (!habit.last_checkin) return false;
    const lastCheckinDate = new Date(habit.last_checkin);
    const now = new Date();

    if (habit.frequency === 'daily') {
      return lastCheckinDate.toDateString() === now.toDateString();
    } else if (habit.frequency === 'weekly') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      return lastCheckinDate >= startOfWeek;
    }
    return false;
  };

  const calculateStreak = (habit) => {
    // Implement your streak calculation logic here
    // This would typically come from your backend
    return habit.streak || 0;
  };

  const fetchHabits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:5000/api/habits", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabits(res.data);
    } catch (err) {
      console.error("Error fetching habits", err);
      setError("Failed to fetch habits. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsCreating(true);
    try {
      await axios.post(
        "http://localhost:5000/api/habits",
        { name, frequency },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setFrequency("daily");
      await fetchHabits();
    } catch (err) {
      console.error("Error creating habit", err);
      setError("Failed to create habit. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const checkIn = async (habitId) => {
    setIsCheckingIn(habitId);
    try {
      await axios.post(
        `http://localhost:5000/api/habits/${habitId}/checkin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchHabits();
    } catch (err) {
      console.error("Error checking in", err);
      setError("Failed to check in. Please try again.");
    } finally {
      setIsCheckingIn(null);
    }
  };

  const deleteHabit = async (habitId) => {
    if (!window.confirm("Are you sure you want to delete this habit?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/habits/${habitId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchHabits();
    } catch (err) {
      console.error("Error deleting habit", err);
      setError("Failed to delete habit. Please try again.");
    }
  };

  useEffect(() => {
    if (!token) {
      setError("You are not logged in. Please log in to view habits.");
      setLoading(false);
      return;
    }
    fetchHabits();
  }, [token]);

  return (
    <div className="habits-page-container">
      <div className="habits-header">
        <h1>Welcome back, {userName}</h1>
        <p>Track your progress and build lasting habits</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <section className="add-habit-section">
        <form onSubmit={createHabit} className="add-habit-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="e.g., Read for 30 min, Drink water"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="add-habit-input"
              required
            />
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="add-habit-select"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
          <button type="submit" className="add-habit-btn" disabled={isCreating}>
            {isCreating ? (
              <Loader2 className="spinner" size={20} />
            ) : (
              <>
                <PlusCircle size={20} />
                <span>Add Habit</span>
              </>
            )}
          </button>
        </form>
      </section>

      <div className="habits-tabs">
        <button 
          className={`tab-btn ${activeTab === "all" ? "active" : ""}`}
          onClick={() => setActiveTab("all")}
        >
          All Habits
        </button>
        <button 
          className={`tab-btn ${activeTab === "daily" ? "active" : ""}`}
          onClick={() => setActiveTab("daily")}
        >
          <Calendar size={16} /> Daily
        </button>
        <button 
          className={`tab-btn ${activeTab === "weekly" ? "active" : ""}`}
          onClick={() => setActiveTab("weekly")}
        >
          <Repeat size={16} /> Weekly
        </button>
        <button 
          className={`tab-btn ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          <CheckCircle size={16} /> Completed
        </button>
      </div>

      <section className="habits-list-section">
        {loading ? (
          <div className="loading-state">
            <Loader2 className="spinner" size={48} />
            <p>Loading your habits...</p>
          </div>
        ) : filteredHabits.length === 0 ? (
          <div className="empty-state">
            <Info size={48} className="empty-state-icon" />
            <p>
              {activeTab === "completed" 
                ? "No completed habits yet. Keep going!" 
                : "No habits found. Create your first habit above!"}
            </p>
          </div>
        ) : (
          <div className="habits-grid">
            {filteredHabits.map((habit) => (
              <div key={habit.id} className={`habit-card ${isCheckedInRecently(habit) ? 'checked-in' : ''}`}>
                <div className="habit-card-header">
                  <div className="habit-info">
                    <h3 className="habit-name">{habit.name}</h3>
                    <div className="habit-meta">
                      <span className={`habit-frequency ${habit.frequency}`}>
                        {habit.frequency === 'daily' ? (
                          <Calendar size={14} />
                        ) : (
                          <Repeat size={14} />
                        )}
                        {habit.frequency}
                      </span>
                      {calculateStreak(habit) > 0 && (
                        <span className="habit-streak">
                          <Flame size={14} /> {calculateStreak(habit)} day streak
                        </span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={20} className="chevron-icon" />
                </div>

                <div className="habit-card-body">
                  <div className="last-checkin">
                    <span>Last check-in:</span>
                    <span className="checkin-date">{formatDate(habit.last_checkin)}</span>
                  </div>
                  <div className="progress-indicator">
                    <div 
                      className="progress-bar" 
                      style={{ width: `${isCheckedInRecently(habit) ? 100 : 0}%` }}
                    ></div>
                  </div>
                </div>

                <div className="habit-card-actions">
                  <button
                    onClick={() => checkIn(habit.id)}
                    className={`checkin-btn ${isCheckedInRecently(habit) ? 'checked' : ''}`}
                    disabled={isCheckedInRecently(habit) || isCheckingIn === habit.id}
                  >
                    {isCheckingIn === habit.id ? (
                      <Loader2 className="spinner" size={16} />
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        <span>{isCheckedInRecently(habit) ? 'Completed' : 'Check In'}</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => deleteHabit(habit.id)}
                    className="delete-habit-btn"
                    title="Delete Habit"
                  >
                    <XCircle size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="habits-stats">
        <div className="stat-card">
          <Trophy size={24} />
          <div>
            <h3>Current Streak</h3>
            <p>{habits.reduce((max, habit) => Math.max(max, calculateStreak(habit)), 0)} days</p>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle size={24} />
          <div>
            <h3>Today's Progress</h3>
            <p>
              {habits.filter(h => h.frequency === 'daily' && isCheckedInRecently(h)).length}/
              {habits.filter(h => h.frequency === 'daily').length || 1}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}