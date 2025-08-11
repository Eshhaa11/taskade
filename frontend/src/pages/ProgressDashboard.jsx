import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend
} from "recharts";
import axios from "axios";
import { FiActivity, FiCheckSquare, FiTrendingUp, FiLoader, FiCalendar } from "react-icons/fi";
import "../styles/ProgressDashboard.css";

export default function ProgressDashboard() {
  const [pieData, setPieData] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState("week");

  const COLORS = ["#10b981", "#f59e0b", "#6366f1", "#ef4444"];

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`http://localhost:5000/api/progress?range=${timeRange}`);

        const { tasks, habits } = res.data;

        setPieData([
          { name: "Completed", value: tasks.completed },
          { name: "Pending", value: tasks.pending },
          { name: "Overdue", value: tasks.overdue },
        ]);

        setLineData(
          timeRange === "week" 
            ? tasks.trend_last_7 
            : timeRange === "month" 
              ? tasks.trend_last_30 
              : tasks.trend_last_90
        );

        const barChartData = habits.per_habit.map((habit) => ({
          name: habit.name.length > 10 ? `${habit.name.substring(0, 8)}...` : habit.name,
          current: habit.current_streak,
          longest: habit.longest_streak,
          completion: habit.completion_rate,
        }));
        setBarData(barChartData);
      } catch (err) {
        console.error("Error fetching dashboard data", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeRange]);

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="progress-dashboard">
      <div className="dashboard-header">
        <h2>
          <FiActivity className="header-icon" />
          Progress Dashboard
        </h2>
        <div className="time-range-buttons">
          <button
            className={timeRange === "week" ? "active" : ""}
            onClick={() => setTimeRange("week")}
          >
            <FiCalendar size={16} /> 7 Days
          </button>
          <button
            className={timeRange === "month" ? "active" : ""}
            onClick={() => setTimeRange("month")}
          >
            <FiCalendar size={16} /> 30 Days
          </button>
          <button
            className={timeRange === "quarter" ? "active" : ""}
            onClick={() => setTimeRange("quarter")}
          >
            <FiCalendar size={16} /> 90 Days
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <FiLoader className="spinner" size={40} />
          <p>Loading your progress data...</p>
        </div>
      ) : (
        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-header">
              <FiCheckSquare className="chart-icon" />
              <h3>Task Status</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={renderCustomizedLabel}
                  labelLine={false}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value} tasks`, name]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <div className="chart-header">
              <FiTrendingUp className="chart-icon" />
              <h3>Completion Trend</h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => 
                    timeRange === 'week' 
                      ? new Date(value).toLocaleDateString('en', { weekday: 'short' }) 
                      : new Date(value).toLocaleDateString('en', { day: 'numeric', month: 'short' })
                  }
                />
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  labelFormatter={(value) => 
                    new Date(value).toLocaleDateString('en', { 
                      weekday: 'short', 
                      month: 'short', 
                      day: 'numeric' 
                    })
                  }
                />
                <Line 
                  type="monotone" 
                  dataKey="completed" 
                  stroke="#6366f1" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card wide-card">
            <div className="chart-header">
              <FiActivity className="chart-icon" />
              <h3>Habit Performance</h3>
            </div>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  stroke="#10b981"
                  allowDecimals={false}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#6366f1"
                  domain={[0, 100]}
                />
                <Tooltip 
                  formatter={(value, name) => 
                    name === 'Completion %' 
                      ? [`${value}%`, name] 
                      : [`${value} days`, name]
                  }
                />
                <Legend />
                <Bar 
                  yAxisId="left"
                  dataKey="current" 
                  name="Current Streak" 
                  fill="#10b981" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  yAxisId="left"
                  dataKey="longest" 
                  name="Longest Streak" 
                  fill="#6366f1" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  yAxisId="right"
                  dataKey="completion" 
                  name="Completion %" 
                  fill="#f59e0b" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}