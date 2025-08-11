import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/Dashboard.css";

// Icons
import { FiCheckCircle, FiTrendingUp, FiZap, FiAward, FiPlus, FiSearch } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function Dashboard() {
  const quotes = [
    { text: "Success is the sum of small efforts, repeated day in and day out.", author: "Robert Collier" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Motivation is what gets you started. Habit is what keeps you going.", author: "Jim Ryun" },
    { text: "Small daily improvements are the key to staggering long-term results.", author: "Unknown" },
    { text: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" }
  ];
  
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [timeOfDay, setTimeOfDay] = useState("");
  const [username] = useState("User"); // Would come from auth
  const [activeQuickAction, setActiveQuickAction] = useState(null);
  const [stats] = useState({
    tasksCompleted: 12,
    totalTasks: 18,
    streak: 7,
    productivityIncrease: 18
  });

  useEffect(() => {
    // Rotate quotes every 8 seconds
    const quoteInterval = setInterval(() => {
      setCurrentQuote(prev => {
        const currentIndex = quotes.findIndex(q => q.text === prev.text);
        return quotes[(currentIndex + 1) % quotes.length];
      });
    }, 8000);

    // Set time-based greeting
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("morning");
    else if (hour < 18) setTimeOfDay("afternoon");
    else setTimeOfDay("evening");

    return () => clearInterval(quoteInterval);
  }, []);

  const quickActions = [
    { icon: <FiPlus />, label: "Add Task", action: () => console.log("Add task") },
    { icon: <FiSearch />, label: "Search", action: () => console.log("Search") },
    { icon: <FiAward />, label: "Goals", action: () => console.log("Goals") }
  ];

  return (
    <div className="dashboard-container">
      {/* Particle background */}
      <div className="particle-bg">
        {[...Array(20)].map((_, i) => (
          <div key={i} className="particle" style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 5}px`,
            height: `${Math.random() * 10 + 5}px`,
            animationDelay: `${Math.random() * 5}s`
          }} />
        ))}
      </div>

      {/* Welcome Header */}
      <motion.header 
        className="dashboard-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="greeting-container">
          <h2>Good {timeOfDay}, <span className="username">{username}</span> 👋</h2>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote.text}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="quote-container"
            >
              <p className="quote">"{currentQuote.text}"</p>
              <p className="quote-author">— {currentQuote.author}</p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        <div className="header-right">
          <div className="date-display">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="productivity-score">
            <FiTrendingUp className="trend-icon" />
            <span>{stats.productivityIncrease}% more productive</span>
          </div>
        </div>
      </motion.header>

      {/* Navigation Cards */}
      <section className="dashboard-cards">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link to="/tasks" className="dashboard-card tasks">
            <div className="card-icon"><FiCheckCircle /></div>
            <div className="card-content">
              <h3>Tasks</h3>
              <p>Organize, prioritize, and complete your daily to-dos.</p>
              <div className="card-progress">
                <div className="progress-track">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(stats.tasksCompleted / stats.totalTasks) * 100}%` }}
                  />
                </div>
                <span>{stats.tasksCompleted}/{stats.totalTasks} completed</span>
              </div>
            </div>
            <div className="card-hover-effect"></div>
            <div className="card-corner"></div>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link to="/habits" className="dashboard-card habits">
            <div className="card-icon"><FiZap /></div>
            <div className="card-content">
              <h3>Habits</h3>
              <p>Build consistency with recurring habits.</p>
              <div className="streak-counter">
                <div className="flame-animation">
                  <div className="flame"></div>
                  <div className="flame"></div>
                  <div className="flame"></div>
                </div>
                <span>{stats.streak}-day streak!</span>
              </div>
            </div>
            <div className="card-hover-effect"></div>
            <div className="card-corner"></div>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link to="/progress" className="dashboard-card progress">
            <div className="card-icon"><FiTrendingUp /></div>
            <div className="card-content">
              <h3>Progress</h3>
              <p>See how far you've come and stay motivated.</p>
              <div className="stats-preview">
                <span>↑ {stats.productivityIncrease}% productivity</span>
              </div>
            </div>
            <div className="card-hover-effect"></div>
            <div className="card-corner"></div>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link to="/ai-assistant" className="dashboard-card ai">
            <div className="card-icon"><RiRobot2Line /></div>
            <div className="card-content">
              <h3>AI Assistant</h3>
              <p>Get smart suggestions, tips, and insights powered by AI.</p>
              <div className="ai-tip">
                <span>Try "Help me prioritize"</span>
              </div>
            </div>
            <div className="card-hover-effect"></div>
            <div className="card-corner"></div>
          </Link>
        </motion.div>
      </section>

      {/* Quick Actions */}
      <motion.div 
        className="quick-actions"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        {quickActions.map((action, index) => (
          <motion.button
            key={action.label}
            className={`quick-action-btn ${activeQuickAction === index ? 'active' : ''}`}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setActiveQuickAction(index);
              action.action();
            }}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-label">{action.label}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Floating notification (example) */}
      <motion.div 
        className="floating-notification"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="notification-badge">🔥</div>
        <p>You're on a {stats.streak}-day streak! Keep it up!</p>
      </motion.div>
    </div>
  );
}