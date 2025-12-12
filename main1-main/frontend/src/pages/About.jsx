import React from "react";
import "./about.css"; 

const teamMembers = [
  {
    name: "Rishabh",
    role: "Team Lead & Full-Stack Developer",
    description:
      "Leads development, integrates features, and ensures smooth end-to-end delivery.",
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Rishabh",
  },
  {
    name: "Sammed P",
    role: "Frontend & OpenCV Integration",
    description:
      "Crafts the UI and handles real-time face tracking with OpenCV and MediaPipe.",
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Sammed",
  },
  {
    name: "Pruthviraj",
    role: "Business Model & Data Research",
    description:
      "Designs the business strategy and curates data for impactful learning modules.",
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Pruthviraj",
  },
  {
    name: "Rahul",
    role: "API Integration & UI/UX",
    description:
      "Connects backend APIs and refines the user experience for seamless interaction.",
    avatar: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Rahul",
  },
];

const About = () => {
  return (
    <div className="about-page">

      {/* Title */}
      <section className="hero">
        <h1>About ShikshaPlus</h1>
        <p className="subtitle">
          ShikshaPlus is an AI-powered microlearning platform designed to help
          students stay focused, learn smarter, and connect with mentors. Built
          for digital equity, it works even in low-resource settings.
        </p>
      </section>

      {/* Info Cards */}
      <section className="info-cards">
        <div className="info-card">
          <h2>🌟 Vision</h2>
          <p>
            To bridge the digital education gap by offering personalized,
            mentor-assisted learning for every student — anytime, anywhere.
          </p>
        </div>
        <div className="info-card">
          <h2>⚙️ How It Works</h2>
          <ul>
            <li>🧠 AI Tutor with memory helps explain concepts and answer doubts</li>
            <li>👀 Webcam-based focus tracking monitors attention in real time</li>
            <li>📚 Microcourses with quizzes and certificates</li>
            <li>🧑‍🏫 Mentor dashboard shows real learning behavior</li>
          </ul>
        </div>
      </section>

      {/* Team */}
      <section>
        <h2 className="team-title">Meet the Team</h2>
        <div className="team-grid">
          {teamMembers.map((m, i) => (
            <div className="member-card" key={i}>
              <img className="avatar" src={m.avatar} alt={m.name} />
              <h3>{m.name}</h3>
              <p className="role">{m.role}</p>
              <div className="overlay">
                <p>{m.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
