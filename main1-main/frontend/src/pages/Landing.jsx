import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';
import './Landing.css'; // ⭐️ Ensure your CSS is in this file!
// ⭐️ 1. IMPORT YOUR BOT IMAGE HERE
import botImage from '../assets/bot.png';

// ------------------------------------------------------------------
// HELPER COMPONENT: Splits text into span.word > span.char elements
// This structure is required for anime.js to animate character by character.
// ------------------------------------------------------------------
const AnimatedTitle = ({ text }) => {
  // Split the text by word to wrap each for animation
  const words = text.split(' ').map((word, wordIndex) => (
    <span key={wordIndex} className="word">
      {word.split('').map((char, charIndex) => (
        // Use a non-breaking space for actual spaces
        <span key={charIndex} className="char">{char === ' ' ? '\u00A0' : char}</span>
      ))}
      {/* Add a regular space after each word span (except the last one) */}
      {wordIndex < text.split(' ').length - 1 && <span className="char">&nbsp;</span>}
    </span>
  ));

  return <>{words}</>;
};

const Landing = () => {
  const navigate = useNavigate();
  // State to toggle the permanent blinking cursor effect after typing finishes
  const [typingFinished, setTypingFinished] = useState(false);

  // --- ANIME.JS EFFECT ---
  useEffect(() => {
    const targetChars = '.hero-title .char';
    let typingTimeline;

    // 1. Typing Animation Timeline setup
    typingTimeline = anime.timeline({
      loop: false,
    }).add({
      targets: targetChars,
      opacity: [0, 1],
      // ⭐️ ANIMATION SPEED SETTINGS (Slower for better visibility)
      duration: 50,
      delay: anime.stagger(60),
      easing: 'linear',
    }).add({
      // Subtitle fade-in
      targets: '.hero-subtitle',
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 800,
      easing: 'easeOutQuad',
    }, '-=500') // Starts 0.5s before the typing finishes (for smooth overlap)
      .finished.then(() => {
        // Once typing is complete, set state to enable the CSS blinking cursor
        setTypingFinished(true);
      });

    // Cleanup: Ensures animation stops if component unmounts
    return () => {
      if (typingTimeline && typeof typingTimeline.pause === 'function') {
        typingTimeline.pause();
      }
    };

  }, []);


  return (
    <>
      <div className="landing-page">

        {/* 1. Header/Navbar */}
        <header className="landing-header">
          <nav className="landing-nav container">
            <h1 className="logo">
              Shiksha<span className="logo-span">Plus</span>
            </h1>
          </nav>
        </header>

        {/* 2. Hero Section */}
        <section className="hero-section container">
          <div className="hero-gradient"></div>

          {/* ⭐️ REPLACED: Floating Image Graphic (using bot.png) */}
          <div className="hero-floating-graphic">
            <img src={botImage} alt="ShikshaPlus AI Assistant Bot" className="bot-image" />
          </div>

          <div className="hero-content">
            <h2 className="hero-title">
              <AnimatedTitle text="Welcome to " />
              <span className="hero-title-span">
                <AnimatedTitle text="ShikshaPlus" />
              </span>
              {/* Cursor: Class toggles the infinite CSS blink */}
              <span className={`typing-cursor ${typingFinished ? 'is-blinking' : ''}`}></span>
            </h2>

            <p className="hero-subtitle" style={{ opacity: 0 }}>
              Your ultimate productivity and learning platform, designed to help you succeed.
            </p>

            <button
              onClick={() => navigate('/auth')}
              className="hero-cta-btn"
            >
              Get Started
              {/* Embedded SVG Arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ marginLeft: '8px' }}
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </button>
          </div>
        </section>

        {/* The rest of the component remains the same */}
        {/* 3. Features Section */}
        <section className="features-section">
          <div className="container">
            <h3 className="section-title">
              Everything You Need to Succeed
            </h3>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
                </div>
                <h4 className="feature-title">Dashboard</h4>
                <p className="feature-description">
                  Track your progress, manage your tasks, and stay on top of your goals.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
                </div>
                <h4 className="feature-title">Courses</h4>
                <p className="feature-description">
                  Learn new skills with our comprehensive and expert-led courses.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
                </div>
                <h4 className="feature-title">Focus</h4>
                <p className="feature-description">
                  Stay focused and productive with our built-in tools and techniques.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <h4 className="feature-title">Advanced AI Chatbot and Assistant</h4>
                <p className="feature-description">
                  Get instant help and personalized assistance with our intelligent AI chatbot.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                </div>
                <h4 className="feature-title">Mentorship</h4>
                <p className="feature-description">
                  Connect with experienced mentors to guide your learning journey.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon-wrapper">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="12" y1="6" x2="16" y2="6"></line><line x1="12" y1="10" x2="16" y2="10"></line><line x1="12" y1="14" x2="16" y2="14"></line></svg>
                </div>
                <h4 className="feature-title">Digital Literacy</h4>
                <p className="feature-description">
                  Build essential digital skills for the modern world.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 3.5. Tech Stack Section */}
        <section className="tech-stack-section">
          <div className="container">
            <h3 className="tech-stack-title">
              Built With a Modern Stack
            </h3>
            <div className="marquee-wrapper">
              <div className="marquee-content">
                <span className="tech-item vite">Vite + React</span>
                <span className="tech-item python">Python</span>
                <span className="tech-item opencv">OpenCV</span>
                <span className="tech-item sql">SQL Database</span>

                <span className="tech-item vite">Vite + React</span>
                <span className="tech-item python">Python</span>
                <span className="tech-item opencv">OpenCV</span>
                <span className="tech-item sql">SQL Database</span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Guest View Section */}
        <section className="guest-section">
          <div className="container guest-content">
            <h3 className="section-title-light">Take a Look Inside</h3>
            <p className="guest-subtitle">
              No account? No problem. View our platform as a guest and see what we offer.
            </p>

            <div className="guest-buttons-container">
              <button
                // ⭐️ GUEST LOGIN RESTORED
                onClick={() => navigate('/dashboard')}
                className="guest-btn-primary"
              >
                Student Dashboard
              </button>
              <button
                // ⭐️ GUEST LOGIN RESTORED
                onClick={() => navigate('/mentor-dashboard')}
                className="guest-btn-secondary"
              >
                Mentor Dashboard
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Landing;