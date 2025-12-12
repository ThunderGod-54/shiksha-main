import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ApiService from '../services/api';

const CourseContinued2 = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState(0);
  const [output, setOutput] = useState('');

  // GLOBAL THEME SUPPORT (reads from Navbar toggle)
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

 useEffect(() => {
  const updateTheme = () => {
    setIsDark(localStorage.getItem("theme") === "dark");
  };

  // detect global theme event
  window.addEventListener("theme-changed", updateTheme);

  // sync on first load
  updateTheme();

  return () => window.removeEventListener("theme-changed", updateTheme);
}, []);


  // -------------------------------------------------------------
  // COURSE DATA (unchanged)
  // -------------------------------------------------------------
  const courseData = {
    1: {
      title: 'Data Structures & Algorithms',
      lessons: [
        {
          title: 'Introduction to DSA',
          videoUrl: 'https://youtu.be/J0OvDNmAWNw',
          description: 'Understanding the importance of data structures and algorithms in programming.',
          code: `#include <stdio.h>
int main() {
    printf("Hello, DSA!");
    return 0;
}`,
          expectedOutput: 'Hello, DSA!'
        },
        {
          title: 'Arrays and Strings',
          videoUrl: 'https://youtu.be/J0OvDNmAWNw',
          description: 'Learn about arrays, strings, and basic operations.',
          code: `#include <stdio.h>
int main() {
    int arr[] = {1, 2, 3, 4, 5};
    printf("Array element: %d", arr[0]);
    return 0;
}`,
          expectedOutput: 'Array element: 1'
        },
        {
          title: 'Linked Lists',
          videoUrl: 'https://youtu.be/J0OvDNmAWNw',
          description: 'Understanding linked lists and their operations.',
          code: `#include <stdio.h>
#include <stdlib.h>

struct Node {
    int data;
    struct Node* next;
};

int main() {
    struct Node* head = NULL;
    printf("Linked List Basics");
    return 0;
}`,
          expectedOutput: 'Linked List Basics'
        }
      ]
    },

    2: {
      title: 'Web Development Fundamentals',
      lessons: [
        {
          title: 'HTML Basics',
          videoUrl: 'https://youtu.be/zysUIv0-xak',
          description: 'Learn the fundamentals of HTML structure and elements.',
          code: `<!DOCTYPE html>
<html>
<head>
    <title>My Web Page</title>
</head>
<body>
    <h1>Hello, Web Development!</h1>
    <p>This is a paragraph.</p>
</body>
</html>`,
          expectedOutput: 'HTML rendered in browser'
        },
        {
          title: 'CSS Styling',
          videoUrl: 'https://youtu.be/zysUIv0-xak',
          description: 'Introduction to CSS for styling web pages.',
          code: `body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
}

h1 {
    color: #333;
    text-align: center;
}`,
          expectedOutput: 'CSS applied to page'
        },
        {
          title: 'JavaScript Fundamentals',
          videoUrl: 'https://youtu.be/zysUIv0-xak',
          description: 'Basic JavaScript concepts and syntax.',
          code: `function greet(name) {
    console.log('Hello, ' + name + '!');
}

greet('World');`,
          expectedOutput: 'Hello, World!'
        }
      ]
    },

    3: {
      title: 'Java Programming',
      lessons: [
        {
          title: 'Java Basics',
          videoUrl: 'https://youtu.be/eIrMbAQSU34',
          description: 'Introduction to Java programming language.',
          code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}`,
          expectedOutput: 'Hello, Java!'
        },
        {
          title: 'Object-Oriented Programming',
          videoUrl: 'https://youtu.be/eIrMbAQSU34',
          description: 'Understanding classes, objects, and OOP concepts.',
          code: `public class Person {
    private String name;
    private int age;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    public void display() {
        System.out.println("Name: " + name + ", Age: " + age);
    }
}`,
          expectedOutput: 'Person class defined'
        },
        {
          title: 'Exception Handling',
          videoUrl: 'https://youtu.be/eIrMbAQSU34',
          description: 'Learn how to handle exceptions in Java.',
          code: `public class ExceptionExample {
    public static void main(String[] args) {
        try {
            int result = 10 / 0;
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero!");
        }
    }
}`,
          expectedOutput: 'Cannot divide by zero!'
        }
      ]
    },

    5: {
      title: 'Python Programming',
      lessons: [
        {
          title: 'Python Basics',
          videoUrl: 'https://youtu.be/K5KVEU3aaeQ',
          description: 'Introduction to Python programming.',
          code: `print("Hello, Python!")

name = "Python"
version = 3.9
print(f"Welcome to {name} {version}")`,
          expectedOutput: `Hello, Python!
Welcome to Python 3.9`
        },
        {
          title: 'Control Structures',
          videoUrl: 'https://youtu.be/K5KVEU3aaeQ',
          description: 'Learn about loops and conditional statements.',
          code: `age = 18
if age >= 18:
    print("You are an adult")
else:
    print("You are a minor")

for i in range(5):
    print(f"Count: {i}")`,
          expectedOutput: `You are an adult
Count: 0
Count: 1
Count: 2
Count: 3
Count: 4`
        },
        {
          title: 'Functions and Modules',
          videoUrl: 'https://youtu.be/K5KVEU3aaeQ',
          description: 'Understanding functions and module imports.',
          code: `def greet(name):
    return f"Hello, {name}!"

def add_numbers(a, b):
    return a + b

result = add_numbers(5, 3)
print(greet("Python"))
print(f"5 + 3 = {result}")`,
          expectedOutput: `Hello, Python!
5 + 3 = 8`
        }
      ]
    }
  };

  const course = courseData[courseId];

  if (!course) return <h1>Course Not Found</h1>;

  const currentLesson = course.lessons[selectedLesson];

  const runCode = () => setOutput(currentLesson.expectedOutput);

  const getYouTubeEmbedUrl = (url) => {
    const match = url?.match(/(?:v=|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const generateCertificate = async () => {
    try {
      const res = await ApiService.generateCertificate(course.title);
      if (res.download_url) {
        const a = document.createElement("a");
        a.href = "http://localhost:5000" + res.download_url;
        a.download = `${course.title}_Certificate.pdf`;
        a.click();
        alert("Certificate Generated!");
      }
    } catch {
      alert("Failed to generate certificate");
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        fontFamily: 'Arial',
        background: isDark ? '#0f172a' : '#F0EDEE',
        color: isDark ? 'white' : 'black',
        minHeight: '100vh',
        transition: '0.3s'
      }}
    >

      <button
        onClick={() => navigate('/Courses')}
        style={{
          padding: '10px 20px',
          borderRadius: '5px',
          border: 'none',
          background: '#4facfe',
          color: 'white',
          marginBottom: '20px'
        }}
      >
        Back to Courses
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px' }}>

        {/* SIDEBAR */}
        <div
          style={{
            background: isDark ? '#1e293b' : 'white',
            padding: '20px',
            borderRadius: '16px',
            color: isDark ? 'white' : 'black'
          }}
        >
          <h2>{course.title}</h2>
          {course.lessons.map((lesson, index) => (
            <button
              key={index}
              onClick={() => setSelectedLesson(index)}
              style={{
                display: 'block',
                width: '100%',
                padding: '12px',
                margin: '5px 0',
                background: selectedLesson === index ? (isDark ? '#334155' : '#e0f2fe') : (isDark ? '#1e293b' : 'white'),
                border: selectedLesson === index ? '2px solid #4facfe' : '1px solid #ccc',
                borderRadius: '6px',
                color: isDark ? 'white' : 'black',
                textAlign: 'left'
              }}
            >
              {lesson.title}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div
          style={{
            background: isDark ? '#1e293b' : 'white',
            padding: '30px',
            borderRadius: '16px',
            color: isDark ? 'white' : 'black'
          }}
        >
          <h1>{currentLesson.title}</h1>

          {currentLesson.videoUrl ? (
            <iframe
              width="100%"
              height="350"
              src={getYouTubeEmbedUrl(currentLesson.videoUrl)}
              allowFullScreen
              style={{ borderRadius: '12px' }}
            ></iframe>
          ) : (
            <div style={{ height: '350px', background: '#eee', borderRadius: '12px' }}></div>
          )}

          <h3>Description</h3>
          <p>{currentLesson.description}</p>

          {(courseId === '1' || courseId === '3' || courseId === '5') && (
            <>
              <h3>Code Example</h3>
              <pre
                style={{
                  background: isDark ? '#0f172a' : '#1f2937',
                  color: 'white',
                  padding: '15px',
                  borderRadius: '8px'
                }}
              >
                {currentLesson.code}
              </pre>

              <button
                onClick={runCode}
                style={{
                  padding: '10px 20px',
                  background: '#10b981',
                  color: 'white',
                  borderRadius: '6px'
                }}
              >
                Run Code
              </button>

              {output && (
                <div style={{ marginTop: '10px' }}>
                  <h4>Output:</h4>
                  <pre
                    style={{
                      background: '#fafafa',
                      padding: '10px',
                      borderRadius: '6px',
                      color: 'black'
                    }}
                  >
                    {output}
                  </pre>
                </div>
              )}
            </>
          )}

          {/* NAVIGATION BUTTONS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>

            <button
              onClick={() => setSelectedLesson(Math.max(0, selectedLesson - 1))}
              style={{ padding: '10px 20px', background: '#4facfe', color: 'white', borderRadius: '6px' }}
            >
              Previous
            </button>

            {selectedLesson === course.lessons.length - 1 && (
              <button
                onClick={generateCertificate}
                style={{
                  padding: '12px 24px',
                  background: '#10b981',
                  color: 'white',
                  borderRadius: '8px'
                }}
              >
                Generate Certificate
              </button>
            )}

            {/* NEXT BUTTON REMOVED ON LAST LESSON */}
            {selectedLesson < course.lessons.length - 1 && (
              <button
                onClick={() => setSelectedLesson(selectedLesson + 1)}
                style={{
                  padding: '10px 20px',
                  background: '#4facfe',
                  color: 'white',
                  borderRadius: '6px'
                }}
              >
                Next
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseContinued2;