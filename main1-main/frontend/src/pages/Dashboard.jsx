import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const dashboardPageStyles = `
.dashboard-page {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: var(--dash-bg);
  color: var(--text-primary);
  min-height: 100vh;
  padding-top: 20px;
  overflow-x: hidden;
  position: relative;
}

.dashboard-page::before,
.dashboard-page::after {
  content: "";
  position: fixed;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  filter: blur(180px);
  opacity: 0.28;
  pointer-events: none;
  z-index: 0;
}

.dashboard-page::before {
  top: -150px;
  left: -150px;
  background: var(--blue-secondary);
}

.dashboard-page::after {
  bottom: -180px;
  right: -130px;
  background: var(--violet-primary);
}

.dashboard-main {
  max-width: 1350px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  z-index: 2;
}

.dashboard-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(4, 1fr);
}

.dash-card {
  background: var(--card-bg);
  border-radius: 1rem;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.04), 0 8px 30px var(--shadow-color);
  border: 1px solid var(--border-color);
  padding: 1.7rem;
  transition: all .35s ease;
  display: flex;
  flex-direction: column;
}

.dash-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.05), 0 12px 42px var(--shadow-color);
  border-color: var(--blue-primary);
}

.card-title {
  font-size: 1.45rem;
  font-weight: 700;
  margin-bottom: .4rem;
  background: linear-gradient(135deg, var(--blue-primary), var(--violet-primary));
  -webkit-background-clip: text;
  color: transparent;
}

.card-subtitle {
  font-size: 1.9rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  align-self: center;
}

.dash-welcome { grid-column: span 2; }
.dash-calendar { grid-column: span 2 / 5; grid-row: span 2; }
.dash-performance { grid-row: span 1; }
.dash-my-visit { grid-row: span 1; }

.bar-chart-container {
  display: flex;
  gap: .7rem;
  align-items: flex-end;
  height: 100%;
  padding-bottom: .8rem;
}

.bar-chart-bar {
  flex: 1;
  background: var(--blue-primary);
  border-radius: .4rem .4rem 0 0;
  animation: growBar 1.2s ease-out;
}

.doughnut-charts-container {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.doughnut-chart-wrapper { text-align: center; }

.doughnut-chart {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(var(--blue-primary) 0 var(--percent), rgba(255,255,255,.2) var(--percent) 100%);
  animation: spinIn .9s ease;
}

.doughnut-chart::before {
  content: "";
  width: 60%;
  height: 60%;
  background: var(--card-bg);
  border-radius: 50%;
  position: absolute;
  top: 20%;
  left: 20%;
}

.doughnut-chart span {
  position: absolute;
  font-size: 1.2rem;
  top: 38%;
  left: 38%;
  font-weight: 600;
  color: var(--blue-primary);
}

.doughnut-label {
  font-size: .85rem;
  margin-top: .4rem;
  color: var(--text-secondary);
}

.quiz-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
}

.quiz-option-btn {
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  padding: .8rem;
  border-radius: .6rem;
  color: var(--text-primary);
  cursor: pointer;
  text-align: left;
  transition: 0.2s;
}

.quiz-option-btn:hover {
  border-color: var(--blue-primary);
  background: rgba(59, 130, 246, 0.05);
}

@keyframes growBar { from { height: 0; } }
@keyframes spinIn {
  from { transform: rotate(180deg); opacity: 0; }
  to { transform: rotate(0); opacity: 1; }
}

.react-calendar { width: 100%; background: transparent; border: none; }
.react-calendar__tile { color: var(--text-primary); }
.react-calendar__tile--active { background: var(--violet-primary) !important; color: white; }
.react-calendar__navigation button { color: var(--text-primary); }
`;

const Dashboard = () => {
  const inspirationalQuotes = [
    "The only way to do great work is to love what you do. – Steve Jobs",
    "Believe you can and you're halfway there. – Theodore Roosevelt",
    "The future belongs to those who believe in the beauty of their dreams. – Eleanor Roosevelt",
    "You miss 100% of the shots you don't take. – Wayne Gretzky",
    "The best way to predict the future is to create it. – Peter Drucker"
  ];

  const [currentQuote, setCurrentQuote] = useState(inspirationalQuotes[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote(inspirationalQuotes[Math.floor(Math.random() * inspirationalQuotes.length)]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const todayStr = () => new Date().toISOString().split("T")[0];

  const markTodayActive = () => {
    const history = JSON.parse(localStorage.getItem("studyHistory") || "[]");
    const today = todayStr();
    if (!history.includes(today)) {
      history.push(today);
      localStorage.setItem("studyHistory", JSON.stringify(history));
    }
  };

  const getStudyStreak = () => {
    const history = JSON.parse(localStorage.getItem("studyHistory") || "[]");
    if (history.length === 0) return 0;
    let streak = 0;
    let current = new Date();
    while (true) {
      const dateStr = current.toISOString().split("T")[0];
      if (history.includes(dateStr)) {
        streak++;
        current.setDate(current.getDate() - 1);
      } else break;
    }
    return streak;
  };

  const markHourlyActivity = () => {
    const hours = JSON.parse(localStorage.getItem("studyHours") || "[]");
    const now = new Date();
    hours.push(now.getHours());
    localStorage.setItem("studyHours", JSON.stringify(hours.slice(-200)));
  };

  const getLearningMomentum = () => {
    const history = JSON.parse(localStorage.getItem("studyHistory") || "[]");
    const today = new Date();
    const last7 = history.filter(d => {
      const diff = (today - new Date(d)) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    }).length;
    const prev7 = history.filter(d => {
      const diff = (today - new Date(d)) / (1000 * 60 * 60 * 24);
      return diff > 7 && diff <= 14;
    }).length;

    if (prev7 === 0) return { trend: "Improving", percent: 100 };
    const change = Math.round(((last7 - prev7) / prev7) * 100);
    if (change > 5) return { trend: "Improving", percent: change };
    if (change < -5) return { trend: "Declining", percent: change };
    return { trend: "Stable", percent: change };
  };

  const getProductiveTime = () => {
    const hours = JSON.parse(localStorage.getItem("studyHours") || "[]");
    if (hours.length === 0) return "Not enough data";
    const freq = {};
    hours.forEach(h => freq[h] = (freq[h] || 0) + 1);
    const bestHour = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
    const start = `${bestHour}:00`;
    const end = `${(Number(bestHour) + 2) % 24}:00`;
    return `${start} - ${end}`;
  };

  const getLastActiveText = () => {
    const history = JSON.parse(localStorage.getItem("studyHistory") || "[]");
    if (history.length === 0) return "Never";
    const last = new Date(history[history.length - 1]);
    const diff = Math.floor((new Date() - last) / (1000 * 60 * 60 * 24));
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    return `${diff} days ago`;
  };

  const getWeeklyConsistency = () => {
    const history = JSON.parse(localStorage.getItem("studyHistory") || "[]");
    const last7 = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      last7.push(d.toISOString().split("T")[0]);
    }
    const activeDays = last7.filter(d => history.includes(d)).length;
    return Math.round((activeDays / 7) * 100);
  };

  useEffect(() => {
    markTodayActive();
    markHourlyActivity();
  }, []);

  const performanceData = [
    { label: "Algo", value: 85 },
    { label: "OOP", value: 64 },
    { label: "DB", value: 82 },
    { label: "Web", value: 40 },
    { label: "ML", value: 75 },
  ];

  const visitData = [
    { label: "Algo", value: 92 },
    { label: "OOP", value: 83 },
    { label: "DB", value: 78 },
  ];

  return (
    <>
      <style>{dashboardPageStyles}</style>
      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="dashboard-grid">
            <div className="dash-card dash-welcome">
              <h2 className="card-title">Welcome Back!</h2>
              <p className="card-subtitle" style={{ fontSize: "1.1rem" }}>{currentQuote}</p>
            </div>

            <div className="dash-card dash-calendar">
              <h2 className="card-title">Calendar</h2>
              <Calendar />
            </div>

            <div className="dash-card dash-performance">
              <h2 className="card-title">Performance</h2>
              <div className="bar-chart-container">
                {performanceData.map((item) => (
                  <div key={item.label} className="bar-chart-bar" style={{ height: `${item.value}%` }} title={`${item.label}: ${item.value}%`}></div>
                ))}
              </div>
            </div>

            <div className="dash-card dash-my-visit">
              <h2 className="card-title">My Visit</h2>
              <div className="doughnut-charts-container">
                {visitData.map((item) => (
                  <div className="doughnut-chart-wrapper" key={item.label}>
                    <div className="doughnut-chart" style={{ "--percent": `${item.value}%` }}>
                      <span>{item.value}%</span>
                    </div>
                    <span className="doughnut-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="dash-card">
              <h2 className="card-title">Streak & Consistency</h2>
              <p style={{ fontSize: "1.1rem", marginTop: "10px" }}>🔥 <b>{getStudyStreak()}</b> Day Streak</p>
              <p style={{ marginTop: "6px", color: "gray" }}>📅 Last Active: <b>{getLastActiveText()}</b></p>
              <p style={{ marginTop: "6px" }}>🎯 Weekly Consistency: <b>{getWeeklyConsistency()}%</b></p>
            </div>

            <div className="dash-card">
              <h2 className="card-title">Learning Momentum</h2>
              {(() => {
                const m = getLearningMomentum();
                return (
                  <>
                    <p style={{ fontSize: "1.1rem", marginTop: "10px" }}>📊 <b>{m.trend}</b> ({m.percent > 0 ? "+" : ""}{m.percent}% this week)</p>
                    <p style={{ marginTop: "8px", color: "gray" }}>⏰ Most productive time:</p>
                    <p style={{ fontWeight: "600", marginTop: "4px" }}>{getProductiveTime()}</p>
                  </>
                );
              })()}
            </div>

            <div className="dash-card dash-quiz">
              <h2 className="card-title">Quick Quiz</h2>
              <p>Which is the capital of Japan?</p>
              <div className="quiz-options">
                <button className="quiz-option-btn">A) Beijing</button>
                <button className="quiz-option-btn">B) Seoul</button>
                <button className="quiz-option-btn">C) Tokyo</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;