import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  // -------------------------------------------
  // COURSE DATA
  // -------------------------------------------
  const allCourses = [
    { id: 1, title: 'Data Structures & Algorithms', category: 'cs', difficulty: 'Intermediate', duration: '8 weeks', icon: 'layers' },
    { id: 2, title: 'Web Development Fundamentals', category: 'cs', difficulty: 'Beginner', duration: '6 weeks', icon: 'globe' },
    { id: 3, title: 'Java Programming', category: 'cs', difficulty: 'Intermediate', duration: '8 weeks', icon: 'code' },
    { id: 5, title: 'Python Programming', category: 'cs', difficulty: 'Beginner', duration: '6 weeks', icon: 'code' },

    { id: 16, title: 'Introduction to Artificial Intelligence', category: 'ai', difficulty: 'Beginner', duration: '8 weeks', icon: 'cpu' },
    { id: 17, title: 'Machine Learning Fundamentals', category: 'ai', difficulty: 'Intermediate', duration: '10 weeks', icon: 'brain' },
    { id: 18, title: 'Deep Learning & Neural Networks', category: 'ai', difficulty: 'Advanced', duration: '12 weeks', icon: 'activity' },

    { id: 21, title: 'Digital Communication Skills', category: 'digital', difficulty: 'Beginner', duration: '4 weeks', icon: 'mail' },
    { id: 22, title: 'Online Safety & Privacy', category: 'digital', difficulty: 'Beginner', duration: '3 weeks', icon: 'shield' },
    { id: 23, title: 'Digital Citizenship', category: 'digital', difficulty: 'Beginner', duration: '4 weeks', icon: 'users' },
  ];

  // -------------------------------------------
  // FILTER
  // -------------------------------------------
  const filteredCourses = allCourses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // -------------------------------------------
  // ICON RENDER (Minimal Set)
  // -------------------------------------------
  const renderIcon = (name) => ({
    layers: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>,
    globe: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
    code: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    cpu: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/></svg>,
    brain: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08..."></path></svg>,
    activity: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    users: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="9" cy="7" r="4"/><path d="M17 21v-2a4 4 0 0 0-4-4H5..."></path></svg>,
    mail: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><polyline points="22,6 12,13 2,6"/></svg>,
    shield: <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6..."/></svg>,
  }[name] || <span>⚡</span>);

  // -------------------------------------------
  return (
    <div style={{ minHeight: '100vh', padding: '50px 18px', background: 'var(--bg-main)' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* Title */}
        <h1 style={{
          textAlign: 'center',
          fontSize: '3rem',
          fontWeight: '800',
          marginBottom: '12px',
          background: 'linear-gradient(135deg, var(--accent), var(--accent-strong))',
          WebkitTextFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          letterSpacing: '-1px'
        }}>
          Explore Courses
        </h1>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '40px' }}>
          Learn anything, anytime, anywhere
        </p>

        {/* Search */}
        <div style={{
          background: 'var(--card-bg)',
          padding: '26px',
          borderRadius: '16px',
          marginBottom: '26px',
          boxShadow: '0 8px 25px var(--shadow-color)',
        }}>
          <input
            type="text"
            placeholder="Search for courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 18px',
              fontSize: '1rem',
              background: 'transparent',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              outline: 'none',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Category Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          {[
            { value: 'all', label: 'All' },
            { value: 'cs', label: 'Computer Science' },
            { value: 'ai', label: 'Artificial Intelligence' },
            { value: 'digital', label: 'Digital Literacy' },
          ].map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              style={{
                padding: '12px 26px',
                borderRadius: '999px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                border: selectedCategory === cat.value ? 'none' : '1px solid var(--border-color)',
                background: selectedCategory === cat.value
                  ? 'linear-gradient(135deg, var(--accent), var(--accent-strong))'
                  : 'var(--card-bg)',
                color: selectedCategory === cat.value ? '#fff' : 'var(--text-secondary)',
                boxShadow: selectedCategory === cat.value
                  ? '0 6px 18px rgba(37,99,235,0.35)'
                  : 'none',
                transition: '0.25s ease',
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Count */}
        <p style={{ textAlign: 'center', marginBottom: '12px', color: 'var(--text-secondary)' }}>
          Showing {filteredCourses.length} result{filteredCourses.length !== 1 ? 's' : ''}
        </p>

        {/* Courses Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
          paddingBottom: '50px'
        }}>
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              style={{
                background: 'var(--card-bg)',
                padding: '28px',
                borderRadius: '18px',
                boxShadow: '0 8px 25px var(--shadow-color)',
                border: '1px solid var(--border-color)',
                transition: '0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 38px rgba(37,99,235,0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px var(--shadow-color)';
              }}
            >
              <div style={{
                width: '64px',
                height: '64px',
                background: 'linear-gradient(135deg, var(--accent), var(--accent-strong))',
                color: '#fff',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '18px',
              }}>
                {renderIcon(course.icon)}
              </div>

              <h3 style={{
                fontSize: '1.35rem',
                fontWeight: '700',
                color: 'var(--text-primary)',
                marginBottom: '10px'
              }}>
                {course.title}
              </h3>

              <p style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                marginBottom: '4px'
              }}>
                🧠 {course.difficulty}
              </p>

              <p style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                fontSize: '0.92rem',
                color: 'var(--text-secondary)',
                marginBottom: '22px'
              }}>
                ⏱ {course.duration}
              </p>

              <button
                onClick={() => navigate(`/courses-continued/${course.id}`)}
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  borderRadius: '12px',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, var(--accent), var(--accent-strong))',
                  transition: '0.2s ease',
                }}
              >
                Enroll Now ↗
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Courses;
