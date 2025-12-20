import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import anime from 'animejs';

import './Landing.css';
import botImage from '../assets/bot.png';

// ------------------------------------------------------------------
// ⭐️ HOOK: useSectionReveal
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

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
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
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    function init() {
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }

    init();
    animate();
    const handleResize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; init(); };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }
};

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
  const [featuresRef, featuresVisible] = useSectionReveal({ threshold: 0.4 });
  const [techStackRef, techStackVisible] = useSectionReveal({ threshold: 0.4 });
  const [guestRef, guestVisible] = useSectionReveal({ threshold: 0.4 });

  const heroContentRef = useRef(null);
  const botRef = useRef(null);

  const techList = ['Vite + React', 'Flask', 'OpenCV + MediaPipe', 'Firebase', 'Gemini', 'Google Drive'];

  useEffect(() => {
    const cleanup = initParticles();
    return cleanup;
  }, []);

  useEffect(() => {
    const targetChars = '.hero-title .char';
    let typingTimeline = anime.timeline({ loop: false })
      .add({ targets: targetChars, opacity: [0, 1], duration: 50, delay: anime.stagger(60), easing: 'linear' })
      .add({ targets: '.hero-subtitle', opacity: [0, 1], translateY: [20, 0], duration: 800, easing: 'easeOutQuad' }, '-=500')
      .add({ targets: '.hero-floating-graphic', opacity: [0, 0.95], scale: [0.8, 1], rotate: [-5, 0], duration: 1500, easing: 'easeOutElastic(1, .5)' }, '-=1000')
      .add({ targets: '.hero-cta-btn', opacity: [0, 1], translateY: [30, 0], scale: [0.9, 1], duration: 800, easing: 'easeOutBack' }, '-=300');

    typingTimeline.finished.then(() => setTypingFinished(true));

    if (botRef.current) {
      anime({ targets: botRef.current, translateY: [0, -15], rotate: [0, 1], duration: 3000, easing: 'easeInOutSine', direction: 'alternate', loop: true });
    }
  }, []);

  useEffect(() => {
    if (featuresVisible && featuresRef.current) {
      anime.timeline({ loop: false })
        .add({ targets: featuresRef.current.querySelector('.section-title'), opacity: [0, 1], translateY: [30, 0], duration: 800, easing: 'easeOutBack' })
        .add({ targets: featuresRef.current.querySelectorAll('.feature-card'), opacity: [0, 1], scale: [0.8, 1], translateY: [40, 0], rotateX: [15, 0], duration: 1000, delay: anime.stagger(150), easing: 'easeOutCubic' }, 200);
    }
    if (techStackVisible && techStackRef.current) {
      anime.timeline({ loop: false })
        .add({ targets: techStackRef.current.querySelector('.tech-stack-title'), opacity: [0, 1], translateY: [30, 0], duration: 800, easing: 'easeOutQuad' })
        .add({ targets: techStackRef.current.querySelector('.marquee-wrapper'), opacity: [0, 1], scale: [0.85, 1], duration: 1200, easing: 'easeOutElastic(.8, .5)' }, 200);
    }
    if (guestVisible && guestRef.current) {
      anime.timeline({ loop: false })
        .add({ targets: guestRef.current.querySelector('.guest-content'), opacity: [0, 1], scale: [0.85, 1], translateY: [30, 0], duration: 1200, easing: 'easeOutElastic(.8, .5)' })
        .add({ targets: guestRef.current.querySelectorAll('.guest-btn-primary, .guest-btn-secondary'), opacity: [0, 1], translateY: [20, 0], delay: anime.stagger(150), duration: 800, easing: 'easeOutBack' }, 200);
    }
  }, [featuresVisible, techStackVisible, guestVisible]);

  return (
    <div className="landing-page">
      <header className="landing-header">
        <nav className="landing-nav container">
          <h1 className="logo">Shiksha<span className="logo-span">Plus</span></h1>
        </nav>
      </header>

      {/* 1. Hero Section */}
      <section className="hero-section container scroll-snap-item" ref={heroContentRef}>
        <div className="hero-gradient"></div>
        <div className="hero-floating-graphic" id="bot-container" ref={botRef}>
          <img src={botImage} alt="Bot" className="bot-image bot-tilt" id="bot-image" />
        </div>
        <div className="hero-content">
          <h2 className="hero-title">
            <AnimatedTitle text="Welcome to " />
            <span className="hero-title-span"><AnimatedTitle text="ShikshaPlus" /></span>
            <span className={`typing-cursor ${typingFinished ? 'is-blinking' : ''}`}></span>
          </h2>
          <p className="hero-subtitle" style={{ opacity: 0 }}>
            Your ultimate productivity and learning platform, designed to help you succeed.
          </p>
          <button onClick={() => navigate('/auth')} className="hero-cta-btn" style={{ opacity: 0 }}>
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '8px' }}>
              <line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>
      </section>

      {/* 2. Features Section - 3D CARDS FIXED */}
      <section className="features-section scroll-snap-item" ref={featuresRef}>
        <div className="container">
          <h3 className="section-title" style={{ opacity: 0 }}>Everything You Need to Succeed</h3>
          <div className="features-grid">
            {[
              {
                title: "Dashboard",
                desc: "Track your progress and tasks.",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>
              },
              {
                title: "Courses",
                desc: "Expert-led learning with quizes and course completion certificates verfied by a QR-code.",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>
              },
              {
                title: "Focus",
                desc: "Stay focused while learning and exploring.",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>
              },
              {
                title: "Personalized AI Tools",
                desc: "Personalized help with GenAI features.",
                icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
              },
              {
                title: "Productivity Tools",
                desc: "Organize your tasks and make yourself productive.",
                icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                  <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
              },
              {
                title: "Digital Literacy",
                desc: "Modern skills.",
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path><line x1="12" y1="6" x2="16" y2="6"></line><line x1="12" y1="10" x2="16" y2="10"></line><line x1="12" y1="14" x2="16" y2="14"></line></svg>
              }
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{ opacity: 0 }}>
                <div className="feature-icon-wrapper">
                  {f.icon}
                </div>
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-description">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Tech Stack Section */}
      <section className="tech-stack-section scroll-snap-item" ref={techStackRef}>
        <div className="container">
          <h3 className="tech-stack-title" style={{ opacity: 0 }}>Built With a Modern Stack</h3>
          <p fontsize="60">Crafted with Modern technologies which power todays latest apps and websites.</p>
          <br></br>
          <div className="marquee-wrapper" style={{ opacity: 0 }}>
            <div className="marquee-content">
              {[...techList, ...techList].map((tech, idx) => (
                <React.Fragment key={idx}>
                  <span className={`tech-item ${tech.toLowerCase().includes('react') ? 'react' :
                      tech.toLowerCase().includes('flask') ? 'flask' :
                        tech.toLowerCase().includes('opencv') ? 'opencv' :
                          tech.toLowerCase().includes('firebase') ? 'firebase' :
                            tech.toLowerCase().includes('gemini') ? 'gemini' :
                              tech.toLowerCase().includes('drive') ? 'drive' : 'default-tech'
                    }`}>
                    {tech}
                  </span>
                  <span className="tech-separator">•</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Guest View Section */}
      <section className="guest-section scroll-snap-item" ref={guestRef}>
        <div className="container guest-content" style={{ opacity: 0 }}>
          <h3 className="section-title-light">Take a Look Inside</h3>
          <p className="guest-subtitle">Zero friction. Pure exploration. Experience ShikshaPlus as our guest.</p>
          <div className="guest-buttons-container">
            <button onClick={() => navigate('/dashboard')} className="guest-btn-primary">Student Dashboard</button>
            <button onClick={() => navigate('/mentor-dashboard')} className="guest-btn-secondary">Mentor Dashboard</button>
            <button onClick={() => navigate('/auth')} className="guest-btn-cta">Create Free Account</button>
          </div>
          <br></br>
          <div className="guest-note-banner">
            <span className="note-dot"></span>
            <p>
              <strong>Imp Note:</strong> You can't generate your course certificate if you log in as guest.
            </p>
          </div>
        </div>
      </section>
    </div>
  );

};

export default Landing;