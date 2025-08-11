# Productivity App with AI Assistant, Habits, Tasks, and Progress Tracking

A full-stack productivity tracker built with **React** (frontend) and **Flask** (backend).  
Features include task management, habit tracking, progress visualization, AI suggestions, Pomodoro timer, and dark/light mode.

---

## 🚀 Features

- **User Authentication** – Sign up & log in with JWT-based authentication.
- **Task Management** – Create, update, and delete tasks.
- **Habit Tracking** – Maintain daily/weekly habits with check-ins.
- **Progress Dashboard** – View progress over time with charts.
- **AI Assistant** – Get motivational tips and goal suggestions (mocked or connected to AI API).
- **Pomodoro Timer** – Stay focused using built-in work/break cycles.
- **Dark/Light Mode** – Easily switch themes.
- **Responsive UI** – Works on desktop & mobile.

---

## 🛠 Tech Stack

**Frontend:**
- React
- React Router
- Axios / Fetch API
- CSS Modules or custom styles

**Backend:**
- Flask
- Flask-RESTful
- Flask-JWT-Extended
- Flask-CORS
- SQLAlchemy (SQLite or PostgreSQL)
- Flask-Mail (for email reminders)

---

## 📂 Project Structure

project/
│
├── backend/
│ ├── app.py # Main Flask application
│ ├── config.py # Configurations (JWT secret, DB URL, API keys)
│ ├── models.py # Database models
│ ├── resources/ # API routes
│ │ ├── user.py
│ │ ├── task.py
│ │ ├── habit.py
│ │ ├── progress.py
│ │ ├── ai.py
│ └── requirements.txt
│
├── frontend/
│ ├── src/
│ │ ├── App.js # Main React Router setup
│ │ ├── components/ # Navbar, PomodoroTimer, ThemeToggle, AISidebar, etc.
│ │ ├── pages/ # Home, Login, Signup, Dashboard, Tasks, Habits, ProgressDashboard
│ │ ├── services/ # API helper functions
│ │ ├── styles/ # CSS files (pomodoro.css, toggle.css, etc.)
│ │ └── index.js
│ ├── package.json
│
└── README.md


---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/productivity-app.git
cd productivity-app

### 2️⃣ Backend Setup (Flask)

cd backend
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
pip install -r requirements.txt


3️⃣ Frontend Setup (React)
cd frontend
npm install

🎨 Bonus Features
Pomodoro Timer
Work/Break cycles with adjustable durations.

Styled with pomodoro.css.

Integrated into Dashboard.

Dark/Light Mode
ThemeToggle component.




