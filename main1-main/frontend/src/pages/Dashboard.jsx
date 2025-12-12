import React from "react";

const dashboardPageStyles = `
.dashboard-page {
  font-family: "Inter", 
    -apple-system, 
    BlinkMacSystemFont, 
    "Segoe UI", 
    Roboto, Helvetica, Arial, sans-serif;
  background: var(--dash-bg);
  color: var(--text-primary);
  min-height: 100vh;
  padding-top: 20px;
  overflow-x: hidden;
  position: relative;
}

/* Ambient Blur Lights */
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

/* Bento Grid */
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
  box-shadow: 
    0 4px 12px rgba(0,0,0,0.04),
    0 8px 30px var(--shadow-color);
  border: 1px solid var(--border-color);
  padding: 1.7rem;
  transition: all .35s ease;
  display: flex;
  flex-direction: column;
}

.dash-card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 6px 16px rgba(0,0,0,0.05),
    0 12px 42px var(--shadow-color);
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
  font-size: .9rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* Bento Placement */
.dash-welcome { grid-column: span 2; }
.dash-calendar { grid-column: span 2 / 5; grid-row: span 2; }
.dash-upcoming { grid-row: span 1; }
.dash-new-graph { grid-column: span 2; }
.dash-mentor { grid-column: span 2; }

/* Performance Chart */
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

/* My Visit Doughnuts */
.doughnut-charts-container {
  display: flex;
  justify-content: space-around;
  margin-top: 1rem;
}

.doughnut-chart-wrapper {
  text-align: center;
}

.doughnut-chart {
  width: 95px;
  height: 95px;
  border-radius: 50%;
  position: relative;
  background: conic-gradient(
    var(--blue-primary) 0 var(--percent), 
    rgba(255,255,255,.2) var(--percent) 100%);
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

/* Subject Progress Bars */
.progress-list {
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
}

.progress-label {
  display: flex;
  justify-content: space-between;
  margin-bottom: .4rem;
  font-size: .9rem;
}

.progress-bar-bg {
  height: 7px;
  background: var(--border-color);
  border-radius: 10px;
}

.progress-bar-fill {
  height: 100%;
  background: var(--violet-primary);
  border-radius: 10px;
  animation: fillBar 1.3s ease-out;
}

/* Mentor */
.mentor-card-content {
  display: flex;
  gap: 1.3rem;
  align-items: center;
  margin-top: 1rem;
}
.mentor-avatar {
  width: 85px;
  height: 85px;
  border-radius: 50%;
  border: 2px solid var(--violet-primary);
  object-fit: cover;
}
.mentor-connect-btn {
  background: var(--violet-primary);
  border: none;
  padding: .65rem 1.3rem;
  border-radius: .65rem;
  color: #fff;
  cursor: pointer;
  font-weight: 500;
}

.mentor-connect-btn:hover {
  opacity: .85;
}

/* Quiz */
.quiz-option-btn {
  background: var(--card-bg);
  border: 1px solid var(--border-light);
  padding: .8rem;
  border-radius: .6rem;
  color: var(--text-primary);
}

/* Animations */
@keyframes growBar { from { height: 0; } }
@keyframes fillBar { from { width: 0; } }
@keyframes spinIn {
  from { transform: rotate(180deg); opacity: 0; }
  to { transform: rotate(0); opacity: 1; }
}

/* Responsive */
@media(max-width:1150px) { .dashboard-grid { grid-template-columns: repeat(2,1fr); } }
@media(max-width:700px) { .dashboard-grid { grid-template-columns:1fr; } }
`;

const Dashboard = () => {
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

  const subjectProgressData = [
    { subject: "Data Structures", value: 75 },
    { subject: "Web Development", value: 40 },
    { subject: "Machine Learning", value: 60 },
  ];

  return (
    <>
      <style>{dashboardPageStyles}</style>

      <div className="dashboard-page">
        <main className="dashboard-main">
          <div className="dashboard-grid">

            {/* Welcome */}
            <div className="dash-card dash-welcome">
              <h2 className="card-title">Welcome Back!</h2>
              <p className="card-subtitle">Here’s your learning snapshot for today 📊</p>
            </div>

            {/* Calendar */}
            <div className="dash-card dash-calendar">
              <h2 className="card-title">Calendar</h2>
              <p className="card-subtitle">Upcoming Classes & Schedule</p>
            </div>

            {/* Performance */}
            <div className="dash-card dash-performance">
              <h2 className="card-title">Performance</h2>
              <div className="bar-chart-container">
                {performanceData.map((item) => (
                  <div
                    key={item.label}
                    className="bar-chart-bar"
                    style={{ height: `${item.value}%` }}
                    title={`${item.label}: ${item.value}%`}
                  ></div>
                ))}
              </div>
            </div>

            {/* My Visit */}
            <div className="dash-card dash-my-visit">
              <h2 className="card-title">My Visit</h2>
              <div className="doughnut-charts-container">
                {visitData.map((item) => (
                  <div className="doughnut-chart-wrapper" key={item.label}>
                    <div
                      className="doughnut-chart"
                      style={{ "--percent": `${item.value}%` }}
                    >
                      <span>{item.value}%</span>
                    </div>
                    <span className="doughnut-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subject Progress */}
            <div className="dash-card dash-new-graph">
              <h2 className="card-title">Subject Progress</h2>
              <div className="progress-list">
                {subjectProgressData.map((item) => (
                  <div key={item.subject}>
                    <div className="progress-label">
                      <span>{item.subject}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor */}
            <div className="dash-card dash-mentor">
              <h2 className="card-title">Featured Mentor</h2>
              <div className="mentor-card-content">
                <img
                  src="https://placehold.co/100x100/a5b4fc/0D1127?text=Mentor"
                  alt="Mentor Avatar"
                  className="mentor-avatar"
                />
                <div>
                  <h4 style={{ margin: "0 0 .35rem" }}>Dr. Evelyn Reed</h4>
                  <p style={{ marginBottom: ".9rem", color: "var(--text-secondary)" }}>
                    Lead Data Scientist @ TechCorp
                  </p>
                  <button className="mentor-connect-btn">View Profile</button>
                </div>
              </div>
            </div>

            {/* Quiz */}
            <div className="dash-card dash-quiz">
              <h2 className="card-title">Quick Quiz</h2>
              <p className="quiz-question">Which is the capital of Japan?</p>
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
