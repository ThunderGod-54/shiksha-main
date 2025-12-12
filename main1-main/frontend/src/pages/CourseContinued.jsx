import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const CourseContinued = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  // Course data
  const allCourses = [
    {
      id: 1,
      title: 'Data Structures & Algorithms',
      category: 'cs',
      difficulty: 'Intermediate',
      duration: '8 weeks',
      icon: 'link',
      description:
        'Learn fundamental data structures and algorithms essential for coding interviews and efficient programming.',
      concepts: [
        'Arrays',
        'Linked Lists',
        'Stacks',
        'Queues',
        'Trees',
        'Graphs',
        'Sorting Algorithms',
        'Searching Algorithms',
      ],
    },
    {
      id: 2,
      title: 'Web Development Fundamentals',
      category: 'cs',
      difficulty: 'Beginner',
      duration: '6 weeks',
      icon: 'globe',
      description:
        'Build a strong foundation in HTML, CSS, and JavaScript to create modern web applications.',
      concepts: [
        'HTML5',
        'CSS3',
        'JavaScript',
        'Responsive Design',
        'DOM Manipulation',
        'Event Handling',
      ],
    },
    {
      id: 3,
      title: 'Java Programming',
      category: 'cs',
      difficulty: 'Intermediate',
      duration: '8 weeks',
      icon: 'code',
      description:
        'Master object-oriented programming with Java, from basics to advanced concepts.',
      concepts: [
        'Object-Oriented Programming',
        'Classes & Objects',
        'Inheritance',
        'Polymorphism',
        'Exception Handling',
        'Collections',
      ],
    },
    {
      id: 5,
      title: 'Python Programming',
      category: 'cs',
      difficulty: 'Beginner',
      duration: '6 weeks',
      icon: 'code',
      description:
        'Learn Python programming fundamentals and build practical applications.',
      concepts: [
        'Variables & Data Types',
        'Control Structures',
        'Functions',
        'Lists & Dictionaries',
        'File Handling',
        'Modules',
      ],
    },
    {
      id: 16,
      title: 'Introduction to Artificial Intelligence',
      category: 'ai',
      difficulty: 'Beginner',
      duration: '8 weeks',
      icon: 'cpu',
      description:
        'Explore the basics of AI, machine learning, and neural networks.',
      concepts: [
        'AI Fundamentals',
        'Machine Learning',
        'Neural Networks',
        'Supervised Learning',
        'Unsupervised Learning',
      ],
    },
    {
      id: 17,
      title: 'Machine Learning Fundamentals',
      category: 'ai',
      difficulty: 'Intermediate',
      duration: '10 weeks',
      icon: 'brain',
      description:
        'Dive deep into machine learning algorithms and their applications.',
      concepts: [
        'Regression',
        'Classification',
        'Clustering',
        'Decision Trees',
        'Neural Networks',
        'Deep Learning',
      ],
    },
    {
      id: 18,
      title: 'Deep Learning & Neural Networks',
      category: 'ai',
      difficulty: 'Advanced',
      duration: '12 weeks',
      icon: 'activity',
      description:
        'Advanced concepts in deep learning, CNNs, RNNs, and their implementations.',
      concepts: [
        'Convolutional Neural Networks',
        'Recurrent Neural Networks',
        'Transformers',
        'GANs',
        'Reinforcement Learning',
      ],
    },
    {
      id: 21,
      title: 'Digital Communication Skills',
      category: 'digital',
      difficulty: 'Beginner',
      duration: '4 weeks',
      icon: 'mail',
      description:
        'Improve your digital communication and online collaboration skills.',
      concepts: [
        'Email Etiquette',
        'Video Conferencing',
        'Online Collaboration Tools',
        'Digital Writing',
      ],
    },
    {
      id: 22,
      title: 'Online Safety & Privacy',
      category: 'digital',
      difficulty: 'Beginner',
      duration: '3 weeks',
      icon: 'shield',
      description:
        'Learn to protect yourself online and maintain digital privacy.',
      concepts: [
        'Password Security',
        'Data Privacy',
        'Cybersecurity Basics',
        'Safe Browsing',
      ],
    },
    {
      id: 23,
      title: 'Digital Citizenship',
      category: 'digital',
      difficulty: 'Beginner',
      duration: '4 weeks',
      icon: 'users',
      description:
        'Understand your rights and responsibilities in the digital world.',
      concepts: [
        'Digital Ethics',
        'Online Behavior',
        'Information Literacy',
        'Digital Rights',
      ],
    },
  ];

  const course = allCourses.find((c) => c.id === parseInt(courseId, 10));

  // ---------- NOT FOUND STATE ----------
  if (!course) {
    return (
      <main
        style={{
          padding: '96px 20px 32px',
          minHeight: '100vh',
          background:
            'radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 55%), var(--bg-main)',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, "Segoe UI", Roboto, sans-serif',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 640,
            background: 'var(--card-bg)',
            borderRadius: 20,
            padding: '28px 24px',
            boxShadow: '0 18px 40px var(--shadow-color)',
            border: '1px solid var(--border-color)',
          }}
        >
          <button
            onClick={() => navigate('/courses')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid var(--border-color)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              cursor: 'pointer',
              marginBottom: 20,
            }}
          >
            ← Back to Courses
          </button>

          <h1
            style={{
              fontSize: '1.7rem',
              marginBottom: 8,
              color: 'var(--text-primary)',
            }}
          >
            Course not found
          </h1>
          <p
            style={{
              fontSize: '0.98rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.6,
            }}
          >
            The requested course could not be located. It may have been removed
            or the link is invalid.
          </p>
        </div>
      </main>
    );
  }

  // ---------- MAIN COURSE PAGE ----------
  return (
    <main
      style={{
        padding: '96px 20px 32px',
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(37,99,235,0.06), transparent 55%), var(--bg-main)',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 900,
        }}
      >
        {/* Back Button */}
        <button
          onClick={() => navigate('/courses')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 999,
            border: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(12px)',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            cursor: 'pointer',
            marginBottom: 20,
            boxShadow: '0 10px 24px var(--shadow-color)',
          }}
        >
          <span style={{ fontSize: '1rem' }}>←</span>
          <span>Back to Courses</span>
        </button>

        {/* Main Card */}
        <section
          style={{
            background: 'var(--card-bg)',
            borderRadius: 24,
            padding: '28px 26px 26px',
            boxShadow: '0 22px 60px var(--shadow-color)',
            border: '1px solid var(--border-color)',
          }}
        >
          {/* Title + Meta */}
          <header
            style={{
              marginBottom: 24,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <h1
              style={{
                fontSize: '2.2rem',
                lineHeight: 1.2,
                margin: 0,
                background:
                  'linear-gradient(135deg, var(--accent), var(--accent-strong))',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {course.title}
            </h1>

            <p
              style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                maxWidth: 640,
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {course.description}
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                marginTop: 6,
              }}
            >
              {/* Difficulty pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: 'var(--accent-soft)',
                  color: 'var(--accent-strong)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '999px',
                    background: 'var(--accent-strong)',
                  }}
                />
                <span>{course.difficulty}</span>
              </div>

              {/* Duration pill */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 12px',
                  borderRadius: 999,
                  background: 'rgba(148,163,184,0.08)',
                  color: 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span>{course.duration}</span>
              </div>
            </div>
          </header>

          {/* Concepts */}
          <section style={{ marginBottom: 28 }}>
            <h2
              style={{
                fontSize: '1.3rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 14,
              }}
            >
              Key concepts you’ll master
            </h2>

            <p
              style={{
                fontSize: '0.95rem',
                color: 'var(--text-secondary)',
                marginBottom: 14,
              }}
            >
              These are the core ideas we’ll focus on throughout the course.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 12,
              }}
            >
              {course.concepts.map((concept, index) => (
                <div
                  key={index}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 14,
                    background:
                      'radial-gradient(circle at top left, rgba(148,163,184,0.15), transparent 65%)',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    boxShadow: '0 8px 22px var(--shadow-color)',
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '999px',
                      background: 'var(--accent)',
                    }}
                  />
                  <span>{concept}</span>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <footer style={{ textAlign: 'center', marginTop: 10 }}>
            <button
              onClick={() => navigate(`/courses-continued2/${course.id}`)}
              style={{
                padding: '14px 32px',
                borderRadius: 999,
                border: 'none',
                background:
                  'linear-gradient(135deg, var(--accent), var(--accent-strong))',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 16px 40px rgba(37,99,235,0.55)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                transition: 'transform 0.16s ease, box-shadow 0.16s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow =
                  '0 20px 50px rgba(37,99,235,0.65)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 16px 40px rgba(37,99,235,0.55)';
              }}
            >
              <span>Start learning now</span>
              <span>↗</span>
            </button>
          </footer>
        </section>
      </div>
    </main>
  );
};

export default CourseContinued;
