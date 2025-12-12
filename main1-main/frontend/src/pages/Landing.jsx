import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';

import './Landing.css';
import botImage from '../assets/bot.png';

// ------------------------------------------------------------------
// ⭐️ NEW HOOK: useSectionReveal
// ------------------------------------------------------------------
const useSectionReveal = (options = { threshold: 0.5 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible];
};


// ------------------------------------------------------------------
// ⭐️ PARTICLE SYSTEM
// ------------------------------------------------------------------
const initParticles = () => {
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '0';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 60;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(59, 130, 246, ${Math.random() * 0.4 + 0.1})`;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.05 + 0.02;
      }

      update() {
        this.wobble += this.wobbleSpeed;
        this.x += this.speedX + Math.sin(this.wobble) * 0.3;
        this.y += this.speedY + Math.cos(this.wobble) * 0.3;

        if (this.x > canvas.width) this.x = 0;
        else if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        else if (this.y < 0) this.y = canvas.height;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Add glow effect
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function init() {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    }

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }
};

// ------------------------------------------------------------------
// ANIMATED TITLE COMPONENT
// ------------------------------------------------------------------
const AnimatedTitle = ({ text }) => {
  const words = text.split(' ').map((word, wordIndex) => (
    <span key={wordIndex} className="word">
      {word.split('').map((char, charIndex) => (
        <span key={charIndex} className="char">{char === ' ' ? '\u00A0' : char}</span>
      ))}
      {wordIndex < text.split(' ').length - 1 && <span className="char">&nbsp;</span>}
    </span>
  ));
  return <>{words}</>;
};

const Landing = () => {
  const navigate = useNavigate();
  const [typingFinished, setTypingFinished] = useState(false);

  // ⭐️ Initialize the reveal hooks for each section
  const [featuresRef, featuresVisible] = useSectionReveal({ threshold: 0.4 });
  const [techStackRef, techStackVisible] = useSectionReveal({ threshold: 0.4 });
  const [guestRef, guestVisible] = useSectionReveal({ threshold: 0.4 });

  const heroContentRef = useRef(null);
  const botRef = useRef(null);

  // --- 1. PARTICLE SYSTEM INITIALIZATION ---
  useEffect(() => {
    const cleanup = initParticles();
    return cleanup;
  }, []);

  // --- 2. HERO SECTION ANIMATIONS ---
  useEffect(() => {
    const targetChars = '.hero-title .char';
    let typingTimeline;

    typingTimeline = anime.timeline({
      loop: false,
    })
      .add({
        targets: targetChars,
        opacity: [0, 1],
        duration: 50,
        delay: anime.stagger(60),
        easing: 'linear',
      })
      .add({
        targets: '.hero-subtitle',
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        easing: 'easeOutQuad',
      }, '-=500')
      .add({
        targets: '.hero-floating-graphic',
        opacity: [0, 0.95],
        scale: [0.8, 1],
        rotate: [-5, 0],
        duration: 1500,
        easing: 'easeOutElastic(1, .5)',
      }, '-=1000')
      .add({
        targets: '.hero-cta-btn',
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.9, 1],
        duration: 800,
        easing: 'easeOutBack',
      }, '-=300')
      .finished.then(() => {
        setTypingFinished(true);
      });

    // Add continuous floating animation for bot
    if (botRef.current) {
      anime({
        targets: botRef.current,
        translateY: [0, -15],
        rotate: [0, 1],
        duration: 3000,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true,
      });
    }

    return () => {
      if (typingTimeline && typeof typingTimeline.pause === 'function') {
        typingTimeline.pause();
      }
    };
  }, []);

  // --- 3. SCROLL REVEAL ANIMATIONS ---
  useEffect(() => {
    // Stop all previous animations
    anime.remove([
      '.features-section .feature-card',
      '.tech-stack-section .marquee-wrapper',
      '.guest-content',
      '.section-title',
      '.tech-stack-title'
    ]);

    // ⭐️ FEATURES SECTION (Enhanced 3D Effects)
    if (featuresVisible && featuresRef.current) {
      anime.timeline({ loop: false })
        .add({
          targets: featuresRef.current.querySelector('.section-title'),
          opacity: [0, 1],
          translateY: [30, 0],
          scale: [0.9, 1],
          duration: 800,
          easing: 'easeOutBack'
        }, 0)
        .add({
          targets: featuresRef.current.querySelectorAll('.feature-card'),
          opacity: [0, 1],
          scale: [0.8, 1],
          translateY: [40, 0],
          rotateX: [15, 0],
          rotateY: [10, 0],
          duration: 1000,
          delay: anime.stagger(150, { start: 200 }),
          easing: 'easeOutCubic',
        }, 200);
    }

    // ⭐️ TECH STACK SECTION (Enhanced Marquee)
    if (techStackVisible && techStackRef.current) {
      anime.timeline({ loop: false })
        .add({
          targets: techStackRef.current.querySelector('.tech-stack-title'),
          opacity: [0, 1],
          translateY: [30, 0],
          duration: 800,
          easing: 'easeOutQuad'
        }, 0)
        .add({
          targets: techStackRef.current.querySelector('.marquee-wrapper'),
          opacity: [0, 1],
          scale: [0.85, 1],
          rotate: [3, 0],
          duration: 1200,
          easing: 'easeOutElastic(.8, .5)',
        }, 200);
    }

    // ⭐️ GUEST SECTION (Glass Morphism Effect)
    if (guestVisible && guestRef.current) {
      anime.timeline({ loop: false })
        .add({
          targets: guestRef.current.querySelector('.guest-content'),
          opacity: [0, 1],
          scale: [0.85, 1],
          translateY: [30, 0],
          duration: 1200,
          easing: 'easeOutElastic(.8, .5)',
        }, 0)
        .add({
          targets: guestRef.current.querySelectorAll('.guest-btn-primary, .guest-btn-secondary'),
          opacity: [0, 1],
          translateY: [20, 0],
          delay: anime.stagger(150),
          duration: 800,
          easing: 'easeOutBack',
        }, 200);
    }

  }, [featuresVisible, techStackVisible, guestVisible]);

  // --- 4. BOT INTERACTION EFFECTS ---
  useEffect(() => {
    const botImage = document.getElementById('bot-image');
    if (!botImage) return;

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const x = (clientX / innerWidth - 0.5) * 20;
      const y = (clientY / innerHeight - 0.5) * 20;

      anime({
        targets: botImage,
        translateX: x,
        translateY: y,
        rotateZ: x * 0.2,
        duration: 800,
        easing: 'easeOutQuad'
      });
    };

    const handleMouseLeave = () => {
      anime({
        targets: botImage,
        translateX: 0,
        translateY: 0,
        rotateZ: 0,
        duration: 1200,
        easing: 'easeOutElastic'
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    botImage.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      botImage.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // --- 5. PARALLAX SCROLL EFFECT ---
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;

      const bot = document.getElementById('bot-container');
      if (bot) {
        bot.style.transform = `translateY(${rate * 0.3}px)`;
      }

      const features = document.querySelector('.features-section');
      if (features) {
        const featuresRect = features.getBoundingClientRect();
        if (featuresRect.top < window.innerHeight && featuresRect.bottom > 0) {
          const rate = (window.innerHeight - featuresRect.top) * 0.1;
          features.style.backgroundPosition = `center ${rate}px`;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* SCROLL SNAP CONTAINER - FIXED STRUCTURE */}
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
        <section className="hero-section container scroll-snap-item" ref={heroContentRef}>
          <div className="hero-gradient"></div>

          <div className="hero-floating-graphic" id="bot-container" ref={botRef}>
            <img
              src={botImage}
              alt="ShikshaPlus AI Assistant Bot"
              className="bot-image bot-tilt"
              id="bot-image"
            />
          </div>

          <div className="hero-content">
            <h2 className="hero-title">
              <AnimatedTitle text="Welcome to " />
              <span className="hero-title-span">
                <AnimatedTitle text="ShikshaPlus" />
              </span>
              <span className={`typing-cursor ${typingFinished ? 'is-blinking' : ''}`}></span>
            </h2>

            <p className="hero-subtitle" style={{ opacity: 0 }}>
              Your ultimate productivity and learning platform, designed to help you succeed.
            </p>

            <button
              onClick={() => navigate('/auth')}
              className="hero-cta-btn"
              style={{ opacity: 0 }}
            >
              Get Started
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

        {/* 3. Features Section */}
        <section
          className="features-section scroll-snap-item"
          ref={featuresRef}
        >
          <div className="container">
            <h3 className="section-title" style={{ opacity: 0 }}>
              Everything You Need to Succeed
            </h3>
            <div className="features-grid">
              {[
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>,
                  title: "Dashboard",
                  desc: "Track your progress, manage your tasks, and stay on top of your goals."
                },
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>,
                  title: "Courses",
                  desc: "Learn new skills with our comprehensive and expert-led courses."
                },
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>,
                  title: "Focus",
                  desc: "Stay focused and productive with our built-in tools and techniques."
                },
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>,
                  title: "Advanced AI Chatbot",
                  desc: "Get instant help and personalized assistance with our intelligent AI chatbot."
                },
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
                  title: "Mentorship",
                  desc: "Connect with experienced mentors to guide your learning journey."
                },
                {
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="12" y1="6" x2="16" y2="6"></line><line x1="12" y1="10" x2="16" y2="10"></line><line x1="12" y1="14" x2="16" y2="14"></line></svg>,
                  title: "Digital Literacy",
                  desc: "Build essential digital skills for the modern world."
                }
              ].map((feature, index) => (
                <div key={index} className="feature-card" style={{ opacity: 0 }}>
                  <div className="feature-icon-wrapper">
                    {feature.icon}
                  </div>
                  <h4 className="feature-title">{feature.title}</h4>
                  <p className="feature-description">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Tech Stack Section */}
        <section
          className="tech-stack-section scroll-snap-item"
          ref={techStackRef}
        >
          <div className="container">
            <h3 className="tech-stack-title" style={{ opacity: 0 }}>
              Built With a Modern Stack
            </h3>
            <div className="marquee-wrapper" style={{ opacity: 0 }}>
              <div className="marquee-content">
                {['Vite + React', 'Python', 'OpenCV', 'SQL Database', 'TensorFlow', 'FastAPI'].map((tech, idx) => (
                  <React.Fragment key={idx}>
                    <span className={`tech-item ${tech.toLowerCase().includes('react') ? 'vite' :
                      tech.toLowerCase().includes('python') ? 'python' :
                        tech.toLowerCase().includes('opencv') ? 'opencv' :
                          tech.toLowerCase().includes('sql') ? 'sql' :
                            tech.toLowerCase().includes('tensor') ? 'tensor' : 'fastapi'}`}>
                      {tech}
                    </span>
                    <span className="tech-separator">•</span>
                  </React.Fragment>
                ))}
                {['Vite + React', 'Python', 'OpenCV', 'SQL Database', 'TensorFlow', 'FastAPI'].map((tech, idx) => (
                  <React.Fragment key={`dup-${idx}`}>
                    <span className={`tech-item ${tech.toLowerCase().includes('react') ? 'vite' :
                      tech.toLowerCase().includes('python') ? 'python' :
                        tech.toLowerCase().includes('opencv') ? 'opencv' :
                          tech.toLowerCase().includes('sql') ? 'sql' :
                            tech.toLowerCase().includes('tensor') ? 'tensor' : 'fastapi'}`}>
                      {tech}
                    </span>
                    <span className="tech-separator">•</span>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Guest View Section */}
        <section
          className="guest-section scroll-snap-item"
          ref={guestRef}
        >
          <div className="container guest-content" style={{ opacity: 0 }}>
            <h3 className="section-title-light">Take a Look Inside</h3>
            <p className="guest-subtitle">
              No account? No problem. View our platform as a guest and see what we offer.
            </p>

            <div className="guest-buttons-container">
              <button
                onClick={() => navigate('/dashboard')}
                className="guest-btn-primary"
              >
                Student Dashboard
              </button>
              <button
                onClick={() => navigate('/mentor-dashboard')}
                className="guest-btn-secondary"
              >
                Mentor Dashboard
              </button>
              <button
                onClick={() => navigate('/auth')}
                className="guest-btn-cta"
              >
                Create Free Account
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '8px' }}>
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Landing;