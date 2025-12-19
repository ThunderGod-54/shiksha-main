import React, { useEffect, useState } from "react";

/* -----------------------------
   Helpers
------------------------------ */
const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

/* -----------------------------
   MiniQuiz Component
------------------------------ */
const MiniQuiz = ({ courseId, quizData, onComplete }) => {
    // ✅ FIX: ensure numeric courseId
    const numericCourseId = Number(courseId);

    const [questions, setQuestions] = useState([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState(null);
    const [score, setScore] = useState(0);

    /* -----------------------------
       Load course-specific quiz
    ------------------------------ */
    useEffect(() => {
        const courseQuestions = quizData[numericCourseId];

        if (!courseQuestions || courseQuestions.length === 0) {
            setQuestions([]);
            return;
        }

        const randomized = shuffle(courseQuestions)
            .slice(0, 5) // questions per attempt
            .map((q) => {
                const shuffledOptions = shuffle(q.options);
                return {
                    question: q.question,
                    options: shuffledOptions,
                    correct: shuffledOptions.indexOf(q.options[q.correct])
                };
            });

        setQuestions(randomized);
    }, [numericCourseId, quizData]);

    if (!questions.length) {
        return <p>No quiz available for this course.</p>;
    }

    const nextQuestion = () => {
        if (selected === questions[current].correct) {
            setScore((s) => s + 1);
        }

        setSelected(null);

        if (current + 1 < questions.length) {
            setCurrent((c) => c + 1);
        } else {
            const finalScore = Math.round(
                ((selected === questions[current].correct ? score + 1 : score) /
                    questions.length) *
                100
            );
            onComplete(finalScore);
        }
    };

    return (
        <div style={{ marginTop: "30px", padding: "25px", borderRadius: "14px", background: "var(--bg-main)" }}>
            <h2>Course Quiz</h2>
            <p>
                Question {current + 1} of {questions.length}
            </p>

            <h3 style={{ marginTop: "15px" }}>
                {questions[current].question}
            </h3>

            {questions[current].options.map((opt, i) => (
                <button
                    key={i}
                    onClick={() => setSelected(i)}
                    style={{
                        display: "block",
                        width: "100%",
                        padding: "12px",
                        margin: "10px 0",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                        background: selected === i ? "#4facfe" : "#e5e7eb",
                        color: selected === i ? "white" : "black",
                        textAlign: "left"
                    }}
                >
                    {opt}
                </button>
            ))}

            <button
                onClick={nextQuestion}
                disabled={selected === null}
                style={{
                    marginTop: "15px",
                    padding: "12px 24px",
                    background: "#10b981",
                    color: "white",
                    borderRadius: "8px",
                    border: "none",
                    cursor: selected === null ? "not-allowed" : "pointer"
                }}
            >
                {current + 1 === questions.length ? "Finish Quiz" : "Next"}
            </button>
        </div>
    );
};

export default MiniQuiz;