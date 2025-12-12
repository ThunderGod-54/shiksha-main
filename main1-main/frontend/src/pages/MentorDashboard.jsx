import React, { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Clock,
  BarChart3,
  GraduationCap,
  Zap,
} from "lucide-react";

const dashboardStyles = `
.mentor-dashboard {
  min-height: 100vh;
  background: var(--dash-bg);
  padding: 2rem 0;
  font-family: var(--font-primary);
}

/* Header */
.mentor-header {
  max-width: 1250px;
  margin: 0 auto 2rem;
  padding: 0 1.5rem;
  color: var(--text-primary);
}

.mentor-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

/* GRID */
.mentor-grid {
  display: grid;
  max-width: 1250px;
  margin: 0 auto;
  padding: 0 1.5rem;
  gap: 2rem;
  grid-template-columns: repeat(4, 1fr);
}

/* BENTO PLACEMENTS */
.m-welcome {
  grid-column: 1 / 5;
  background: linear-gradient(
    135deg,
    var(--card-bg),
    var(--sidebar-bg-start)
  );
}

.m-stats {
  grid-column: 1 / 5;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.m-calendar {
  grid-column: 1 / 3;
}

.m-performance {
  grid-column: 3 / 5;
}

.m-events {
  grid-column: 1 / 5;
}

.m-links {
  grid-column: 1 / 2;
}

/* CARDS */
.m-card {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-lg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: 0.25s ease;
}

.m-card:hover {
  transform: translateY(-4px);
}

/* CARD TITLES */
.m-card-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.m-card-title svg {
  color: var(--blue-primary);
}

/* STATS */
.m-stat {
  background: var(--sidebar-bg-end);
  padding: 1rem;
  border-radius: 0.75rem;
  text-align: center;
  border: 1px solid var(--border-light);
}

.m-stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--blue-primary);
}

.m-stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* LISTS */
.m-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.m-list li {
  padding: 0.55rem 0;
  display: flex;
  justify-content: space-between;
  color: var(--text-primary);
  border-bottom: 1px dashed var(--border-light);
  font-size: 0.95rem;
}

/* RESPONSIVE */
@media (max-width: 1100px) {
  .mentor-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .m-welcome,
  .m-events,
  .m-calendar,
  .m-performance {
    grid-column: 1 / 3;
  }
}

@media (max-width: 700px) {
  .mentor-grid {
    grid-template-columns: 1fr;
  }
  .m-welcome,
  .m-events,
  .m-calendar,
  .m-performance,
  .m-links {
    grid-column: 1 / 2;
  }
  .m-stats {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 460px) {
  .m-stats {
    grid-template-columns: 1fr;
  }
}
`;

export default function MentorDashboard() {
  const [mentorData] = useState({
    name: "Rajashekhar",
    totalStudents: 45,
    coursesMentored: 5,
    activeSessions: 3,
    performanceScore: 8.7,
    upcomingEvents: [
      { id: 1, title: "Code Review Session", time: "Mon, 3 PM" },
      { id: 2, title: "Progress Meeting", time: "Tue, 11 AM" },
    ],
  });

  const Stat = ({ Icon, value, label }) => (
    <div className="m-stat">
      <Icon size={28} />
      <div className="m-stat-value">{value}</div>
      <div className="m-stat-label">{label}</div>
    </div>
  );

  return (
    <>
      <style>{dashboardStyles}</style>

      <div className="mentor-dashboard">
        {/* HEADER */}
        <header className="mentor-header">
          <h1>Mentor Dashboard</h1>
        </header>

        <div className="mentor-grid">
          {/* WELCOME */}
          <div className="m-card m-welcome">
            <div className="m-card-title">
              <GraduationCap size={22} />
              Welcome Back, {mentorData.name}!
            </div>
            <p style={{ color: "var(--text-secondary)" }}>
              You're doing great work guiding your learners.
              Here’s your snapshot.
            </p>
          </div>

          {/* STATS */}
          <div className="m-stats">
            <Stat
              Icon={Users}
              value={mentorData.totalStudents}
              label="Students"
            />
            <Stat
              Icon={BookOpen}
              value={mentorData.coursesMentored}
              label="Courses"
            />
            <Stat
              Icon={Clock}
              value={mentorData.activeSessions}
              label="Sessions"
            />
            <Stat
              Icon={TrendingUp}
              value={`${mentorData.performanceScore}/10`}
              label="Performance"
            />
          </div>

          {/* EVENTS */}
          <div className="m-card m-events">
            <div className="m-card-title">
              <Calendar size={22} />
              Upcoming Events
            </div>

            <ul className="m-list">
              {mentorData.upcomingEvents.map((e) => (
                <li key={e.id}>
                  {e.title}
                  <span style={{ color: "var(--blue-primary)" }}>
                    {e.time}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* PERFORMANCE SNAPSHOT */}
          <div className="m-card m-performance">
            <div className="m-card-title">
              <BarChart3 size={22} />
              Student Performance Snapshot
            </div>
            <p style={{ color: "var(--text-secondary)" }}>
              A skill graph of student averages will appear here.
            </p>
          </div>

          {/* QUICK LINKS */}
          <div className="m-card m-links">
            <div className="m-card-title">
              <Zap size={22} />
              Quick Links
            </div>

            <ul className="m-list">
              <li>View Student List</li>
              <li>Create New Course</li>
              <li>Open AI Chatbot</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
