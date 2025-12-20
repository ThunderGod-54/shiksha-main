import React from "react";
import "./about.css"; 

const teamMembers = [
  {
    name: "Rishabh K",
    role: "Team Lead & Full-Stack Developer",
    description:
      "Leads development, integrates features, and ensures smooth end-to-end delivery.",
    avatar: "https://i.pinimg.com/736x/9e/c0/f8/9ec0f877571edc437f89c15c08081533.jpg",
  },
  {
    name: "Sammed P",
    role: "Frontend & OpenCV Integration",
    description:
      "Crafts the UI and handles real-time face tracking with OpenCV and MediaPipe.",
    avatar: "https://i.pinimg.com/736x/4a/a5/05/4aa5058055bb5592cd3d756b00766915.jpg",
  },
  {
    name: "Pruthviraj K",
    role: "Business Model & Data Research",
    description:
      "Designs the business strategy and curates data for impactful learning modules.",
    avatar: "https://i.pinimg.com/736x/82/42/ef/8242ef800f969ab9e2aac7a90716e56e.jpg",
  },
  {
    name: "Rahul K",
    role: "API Integration & UI/UX",
    description:
      "Connects backend APIs and refines the user experience for seamless interaction.",
    avatar: "https://i.pinimg.com/736x/f4/07/5d/f4075d3fdfdf01e3162a845403fdce5f.jpg",
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
