import React from "react";

const notesPageStyles = `
.notes-page {
  min-height: 100vh;
  padding: 2rem;
  background: var(--dash-bg);
  color: var(--text-primary);
  font-family: "Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto;
}

.notes-header {
  margin-bottom: 2rem;
}

.notes-header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.notes-card {
  background: var(--card-bg);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: .8rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.notes-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.notes-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.notes-link {
  display: inline-block;
  margin-top: 0.5rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  background: rgba(59, 130, 246, 0.1);
  border-radius: 0.5rem;
  transition: background 0.2s ease;
  text-align: center;
}

.notes-link:hover {
  background: rgba(59, 130, 246, 0.2);
  text-decoration: underline;
}

/* Updated notes image container */
.notes-image-container {
  height: 160px;
  border-radius: .6rem;
  border: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: .9rem;
  background: rgba(59, 130, 246, 0.05);
  overflow: hidden;
  position: relative;
}

.notes-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.notes-image-container:hover .notes-image {
  transform: scale(1.05);
}

.notes-placeholder {
  position: absolute;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
}

/* Web Dev Specific Styles */
.webdev-buttons {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.webdev-btn {
  flex: 1;
  min-width: 70px;
  padding: 0.6rem 0.8rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: center;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.webdev-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.html-btn {
  background: #e34c26;
  color: white;
}

.html-btn:hover {
  background: #c03a1e;
}

.css-btn {
  background: #264de4;
  color: white;
}

.css-btn:hover {
  background: #1b3cb0;
}

.js-btn {
  background: #f0db4f;
  color: black;
}

.js-btn:hover {
  background: #e2c63c;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .notes-page {
    padding: 1rem;
  }
  
  .notes-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .notes-header h1 {
    font-size: 1.5rem;
  }
  
  .webdev-buttons {
    gap: 0.6rem;
  }
  
  .webdev-btn {
    min-width: 60px;
    padding: 0.5rem 0.6rem;
    font-size: 0.85rem;
  }
  
  .notes-image-container {
    height: 140px;
  }
}
`;

const courses = [
  {
    name: "Data Structures & Algorithms (DSA)",
    href: "https://drive.google.com/file/d/10Jd35LacFQppldSnF_362ZiBRd8XJ6BW/view?usp=sharing",
    isWebDev: false,
    imageUrl: "https://i.pinimg.com/736x/8d/0f/73/8d0f73d7c8b03ae5a2841eaecd2a3d31.jpg" // Replace with your image URL
  },
  {
    name: "Web Development Fundamentals",
    href: "#",
    isWebDev: true,
    imageUrl: "https://i.pinimg.com/736x/53/19/88/5319885958f89815e5431363f39ff937.jpg", // Replace with your image URL
    webDevLinks: {
      html: "https://drive.google.com/file/d/1tQXAis5JC1JCvk-DACv4M8VhSiF3cf1Q/view?usp=sharing", // lol
      css: "https://drive.google.com/file/d/1dbDJAa6Z5P4gbHhW_VJLUDjd8DbOVhPF/view?usp=sharing",  // lol
      js: "https://drive.google.com/file/d/1mfnMZFlQTV-GnVkLFs0LJPSZCMBaRb4H/view?usp=sharing"    // lol
    }
  },
  {
    name: "Fundamentals of Java Programming",
    href: "https://drive.google.com/file/d/1Tk4C5BC2fdyHrAWOZ1YONzrvMJq3VSiI/view?usp=sharing",
    isWebDev: false,
    imageUrl: "https://i.pinimg.com/736x/8d/0c/72/8d0c72f49aaa0a6a35d34c7b98035baa.jpg" // Replace with your image URL
  },
  {
    name: "Fundamentals of Python Programming",
    href: "https://drive.google.com/file/d/1NU0Z4U7y6H9ifVFWOAXGBNU2g6WEmAY3/view?usp=sharing",
    isWebDev: false,
    imageUrl: "https://i.pinimg.com/736x/6c/df/12/6cdf1232b1f705573716e1c3733a7bbc.jpg" // Replace with your image URL
  }
];

const Notes = () => {
  return (
    <>
      <style>{notesPageStyles}</style>

      <div className="notes-page">
        <div className="notes-header">
          <h1>Course Notes</h1>
          <p>Dive into well-structured notes, code snippets, and practical resources designed to make learning effortless.</p>
        </div>

        <div className="notes-grid">
          {courses.map((course, index) => (
            <div key={index} className="notes-card">
              <h3>{course.name}</h3>

              {/* IMAGE CONTAINER - Replace imageUrl with your actual image links */}
              <div className="notes-image-container">
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={`${course.name} Notes`}
                    className="notes-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div class="notes-placeholder">Add image URL in code</div>';
                    }}
                  />
                ) : (
                  <div className="notes-placeholder">
                    Add image URL in code
                  </div>
                )}
              </div>

              {/* For Web Dev - Show three buttons */}
              {course.isWebDev ? (
                <div className="webdev-buttons">
                  <a
                    href={course.webDevLinks.html}
                    className="webdev-btn html-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    HTML
                  </a>
                  <a
                    href={course.webDevLinks.css}
                    className="webdev-btn css-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    CSS
                  </a>
                  <a
                    href={course.webDevLinks.js}
                    className="webdev-btn js-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    JavaScript
                  </a>
                </div>
              ) : (
                /* For other courses - Show single link */
                <a
                  href={course.href}
                  className="notes-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Access Notes →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Notes;