import { useState, useEffect } from "react";
import "../styles/PomodoroTimer.css";

export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsBreak(!isBreak);
          setMinutes(isBreak ? 25 : 5);
          setSeconds(0);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, minutes, seconds, isBreak]);

  return (
    <div className="pomodoro-container">
      <h2 className="pomodoro-title">{isBreak ? "Break Time" : "Focus Time"}</h2>
      <h1 className="pomodoro-time">
        {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
      </h1>
      <div className="pomodoro-buttons">
        <button onClick={() => setIsRunning(!isRunning)}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={() => { setIsRunning(false); setMinutes(25); setSeconds(0); }}>
          Reset
        </button>
      </div>
    </div>
  );
}
