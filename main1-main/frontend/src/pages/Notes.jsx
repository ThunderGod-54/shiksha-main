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
}

.notes-card h3 {
  font-size: 1.2rem;
  font-weight: 600;
}

.notes-placeholder {
  height: 120px;
  border-radius: .6rem;
  border: 1px dashed var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: .9rem;
}
`;

const courses = [
    "Data Structures & Algorithms",
    "Object Oriented Programming",
    "Database Management Systems",
    "Operating Systems",
    "Computer Networks",
    "Web Development",
    "Machine Learning",
    "Artificial Intelligence",
    "Software Engineering",
    "Engineering Mathematics",
    "Compiler Design",
    "Cloud Computing"
];

const Notes = () => {
    return (
        <>
            <style>{notesPageStyles}</style>

            <div className="notes-page">
                <div className="notes-header">
                    <h1>Notes</h1>
                    <p>Course-wise notes will be added here.</p>
                </div>

                <div className="notes-grid">
                    {courses.map(course => (
                        <div key={course} className="notes-card">
                            <h3>{course}</h3>

                            {/* BLANK NOTES LOCATION */}
                            <div className="notes-placeholder">
                                Notes will be added here
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Notes;