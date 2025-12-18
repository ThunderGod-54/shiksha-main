import React, { useState, useEffect, useRef } from "react";
import './aichatbot.css';
// Typing suggestions component
const TypingSuggestions = () => {
  const suggestions = ["Ask doubts", "Explain topics", "Tech concepts", "Math solutions", "History facts", "Science labs"];
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = suggestions[index];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
      }, 40);

      if (text === '') {
        setIsDeleting(false);
        setIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
      }
    } else {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
      }, 70);

      if (text === currentWord) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, index, suggestions]);

  return (
    <p className="typing-suggestions-text">
      I can help you with: <span className="typing-word">{text}</span>
      <span className="typing-cursor">|</span>
    </p>
  );
};

// Notes Typing Suggestions Component
const NotesTypingSuggestions = () => {
  const suggestions = ["DSA", "CyberSec", "GenAI", "React.js", "ML", "Web Dev"];
  const [index, setIndex] = useState(0);
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = suggestions[index];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
      }, 40);

      if (text === '') {
        setIsDeleting(false);
        setIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
      }
    } else {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
      }, 70);

      if (text === currentWord) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 1500);
      }
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, index, suggestions]);

  return (
    <p className="typing-suggestions-text">
      Try: Generate revision notes for <span className="typing-word">{text}</span>
      <span className="typing-cursor">|</span>
    </p>
  );
};

// Tool Card Component
const ToolCard = ({ title, desc, icon, onClick }) => (
  <div className="ai-card" onClick={onClick}>
    <div className="ai-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

// Modal Component
const Modal = ({ children, onClose }) => (
  <div className="ai-modal-backdrop">
    <div className="ai-modal">
      <button className="ai-close" onClick={onClose}>✕</button>
      {children}
    </div>
  </div>
);

// Timeline Card Component for Roadmap
const TimelineCard = ({ phase, title, weeks, content, isLast }) => (
  <div className="timeline-card">
    <div className="timeline-marker">
      <div className="timeline-dot"></div>
      {!isLast && <div className="timeline-line"></div>}
    </div>
    <div className="timeline-content">
      <div className="phase-badge">{phase}</div>
      <h3>{title}</h3>
      <div className="weeks-badge">{weeks}</div>
      <div className="timeline-description">
        {content.map((item, idx) => (
          <div key={idx} className="timeline-item">
            <span className="timeline-bullet">•</span>
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Chat UI Component
const ChatUI = ({ sessions, currentSessionId, onSessionChange, onNewChat, onDeleteChat, onRenameChat, onShareChat, onFollowOnChat, onUpdateMessages }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    const currentSession = sessions.find(s => s.id === currentSessionId);
    if (currentSession) {
      setMessages(currentSession.messages || []);
    }
  }, [currentSessionId, sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeDropdown && !event.target.closest('.session-dropdown') && !event.target.closest('.session-menu-btn')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeDropdown]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSessionId) return;

    const messageToSend = inputMessage;
    setInputMessage("");

    const userMessage = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMessage];
    onUpdateMessages(currentSessionId, newMessages);

    // Mock AI Response
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: `I'm your AI assistant. You asked: "${messageToSend}". This is a demonstration response. I can help you with various topics including programming, math, science, and general knowledge questions.`,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      onUpdateMessages(currentSessionId, [...newMessages, aiMessage]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleStartRename = (id, currentTitle) => {
    setEditingId(id);
    setRenameValue(currentTitle);
    setActiveDropdown(null);
  };

  const handleRenameSubmit = (e, id) => {
    e.preventDefault();
    const currentTitle = sessions.find(s => s.id === id)?.title;
    if (renameValue.trim() && renameValue !== currentTitle) {
      onRenameChat(id, renameValue.trim());
    }
    setEditingId(null);
    setRenameValue('');
  };

  return (
    <div className="chat-layout">
      <aside className="chat-sidebar">
        <button className="new-chat" onClick={onNewChat}>＋ New Chat</button>
        <div className="chat-history">
          <h4>Chat History</h4>
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`chat-session ${currentSessionId === session.id ? "active" : ""}`}
            >
              <div className="session-header" onClick={() => editingId !== session.id && onSessionChange(session.id)}>
                {editingId === session.id ? (
                  <form onSubmit={(e) => handleRenameSubmit(e, session.id)} className="rename-form">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={(e) => handleRenameSubmit(e, session.id)}
                      autoFocus
                      className="rename-input"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </form>
                ) : (
                  <span className="session-title">{session.title}</span>
                )}
                <button
                  className="session-menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === session.id ? null : session.id);
                  }}
                >⋮</button>
              </div>
              {activeDropdown === session.id && (
                <div className="session-dropdown">
                  <button onClick={() => onShareChat(session.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg> Share
                  </button>
                  <button onClick={() => handleStartRename(session.id, session.title)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg> Rename
                  </button>
                  <button onClick={() => onFollowOnChat(session.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 1l4 4-4 4"></path>
                      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                      <path d="M7 23l-4-4 4-4"></path>
                      <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                    </svg> Follow on
                  </button>
                  <button className="delete-btn" onClick={() => onDeleteChat(session.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg> Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className="chat-main">
        <div className="chat-header">
          <h2 className="gradient-title">Ask your Study Assistant</h2>
          <TypingSuggestions />
        </div>

        <div className="messages-container" ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Start a conversation</h3>
              <p>Ask me anything about your studies!</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                msg.isFollowOnContext ? (
                  <div key={msg.id} className="context-message-wrapper">
                    <details className="follow-on-context-details">
                      <summary>Context from previous chat (click to view JSON)</summary>
                      <pre className="follow-on-context-json">{msg.content}</pre>
                    </details>
                  </div>
                ) : (
                  <div key={msg.id} className={`message ${msg.sender === "user" ? "user-message" : "ai-message"}`}>
                    <div className="message-sender">{msg.sender === "user" ? "You" : "AI Assistant"}</div>
                    <div className="message-content">{msg.content}</div>
                    <div className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                )
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <div className="input-wrapper">
            <textarea
              placeholder="Type your question here..."
              className="chat-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
            />
            <button className="send-button" onClick={sendMessage} disabled={!inputMessage.trim()}>
              <span className="send-arrow">→</span>
            </button>
          </div>
          <p className="input-hint">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </main>
    </div>
  );
};

// Notes Generator UI Component
const NotesGeneratorUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateNotes = async () => {
    if (!inputMessage.trim()) return;

    const messageToSend = inputMessage;
    setInputMessage("");

    const userMessage = {
      id: Date.now().toString(),
      content: messageToSend,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const notesResponse = {
        id: (Date.now() + 1).toString(),
        content: `# Generated Notes for: ${messageToSend}\n\n## Overview\nComprehensive study notes covering key concepts and important points.\n\n## Key Topics:\n\n**1. Fundamental Concepts**\n   - Core principles and definitions\n   - Important terminology\n   - Basic frameworks\n\n**2. Advanced Topics**\n   - Complex theories and applications\n   - Real-world examples\n   - Case studies\n\n**3. Practical Applications**\n   - How to apply concepts\n   - Problem-solving techniques\n   - Best practices\n\n## Summary\nThese notes provide a structured overview of ${messageToSend}. Review regularly for best retention.`,
        sender: "ai",
        timestamp: new Date().toISOString(),
        isNotes: true,
      };
      setMessages(prev => [...prev, notesResponse]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateNotes();
    }
  };

  return (
    <div className="notes-layout">
      <main className="notes-main">
        <div className="notes-header">
          <h2 className="blue-title">Generate Smart Notes</h2>
          <NotesTypingSuggestions />
        </div>

        <div className="messages-container" ref={messagesContainerRef}>
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Generate Study Notes</h3>
              <p>Tell me what topic you want notes for!</p>
              <div className="prompt-suggestions">
                <button onClick={() => setInputMessage("Generate revision notes for DSA")}>DSA Notes</button>
                <button onClick={() => setInputMessage("Create comprehensive notes for Cyber Security")}>CyberSec</button>
                <button onClick={() => setInputMessage("Generate notes for Generative AI")}>GenAI</button>
                <button onClick={() => setInputMessage("Create study notes for React.js")}>React.js Notes</button>
                <button onClick={() => setInputMessage("Make notes about Machine Learning")}>ML Notes</button>
                <button onClick={() => setInputMessage("Generate notes for Web Development")}>Web Dev</button>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender === "user" ? "user-message" : "ai-message notes-message"}`}>
                  <div className="message-sender">{msg.sender === "user" ? "You" : "Notes Generator"}</div>
                  <div
                    className="message-content"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\n/g, '<br>')
                        .replace(/# (.*?)<br>/g, '<h3 class="notes-heading">$1</h3>')
                        .replace(/## (.*?)<br>/g, '<h4 class="notes-subheading">$1</h4>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }}
                  />
                  <div className="message-time">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="chat-input-container">
          <div className="input-wrapper large-input">
            <textarea
              placeholder="Enter topic for notes generation..."
              className="chat-input large-input-field"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
            />
            <button className="send-button notes-button large-send-button" onClick={generateNotes} disabled={!inputMessage.trim()}>
              <span className="send-arrow">→</span>
            </button>
          </div>
          <p className="input-hint">Press Enter to generate notes</p>
        </div>
      </main>
    </div>
  );
};

// Roadmap Generator UI Component
const RoadmapGeneratorUI = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [roadmapData, setRoadmapData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const roadmapContainerRef = useRef(null);

  const generateRoadmap = async () => {
    if (!inputMessage.trim()) return;

    const messageToSend = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    // Clear existing roadmap
    setRoadmapData(null);

    setTimeout(() => {
      // Create structured roadmap data
      const roadmap = {
        title: messageToSend,
        goal: `Become proficient in ${messageToSend}`,
        duration: "12 weeks",
        phases: [
          {
            phase: "Phase 1",
            title: "Foundation",
            weeks: "Weeks 1-4",
            description: "Build core fundamentals and understanding",
            content: [
              "Learn fundamental concepts & terminology",
              "Set up development environment",
              "Complete beginner tutorials & courses",
              "Build 2-3 basic practice projects",
              "Join relevant communities & forums"
            ]
          },
          {
            phase: "Phase 2",
            title: "Intermediate Skills",
            weeks: "Weeks 5-8",
            description: "Develop practical skills and work on real projects",
            content: [
              "Master core tools & frameworks",
              "Work on real-world applications",
              "Contribute to open-source projects",
              "Build portfolio with 3-5 projects",
              "Network with professionals in field"
            ]
          },
          {
            phase: "Phase 3",
            title: "Advanced Mastery",
            weeks: "Weeks 9-12",
            description: "Specialize and prepare for professional opportunities",
            content: [
              "Specialize in niche areas",
              "Build complex, scalable projects",
              "Prepare for certifications/exams",
              "Create technical blog/portfolio",
              "Start applying for positions/opportunities"
            ]
          }
        ],
        milestones: [
          "Complete online certification",
          "Build portfolio website",
          "Contribute to open-source project",
          "Network with 10+ professionals",
          "Land first project/client position",
          "Master key frameworks/tools"
        ],
        resources: {
          courses: ["Coursera Specializations", "Udemy Master Classes", "edX Professional Certificates"],
          books: ["The Pragmatic Programmer", "Clean Code", "Design Patterns", "Refactoring"],
          platforms: ["GitHub", "LeetCode", "Stack Overflow", "Dev.to"],
          communities: ["Discord communities", "LinkedIn Groups", "Meetups", "Twitter Tech Spaces"]
        }
      };

      setRoadmapData(roadmap);
      setIsLoading(false);

      // Scroll to show generated content
      setTimeout(() => {
        if (roadmapContainerRef.current) {
          roadmapContainerRef.current.scrollTop = 0;
        }
      }, 100);
    }, 2000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateRoadmap();
    }
  };

  return (
    <div className="roadmap-layout">
      <main className="roadmap-main" ref={roadmapContainerRef}>
        <div className="roadmap-header">
          <h2 className="blue-title">Roadmap Generator</h2>
          <p className="subtitle">Visualize your learning path with clarity.</p>
        </div>

        <div className="roadmap-content">
          {!roadmapData ? (
            <div className="roadmap-input-section">
              <div className="feature-preview">
                <div className="feature-card">
                  <h3 className="blue-title">🚀 Create Your Learning Path</h3>
                  <p className="feature-description">Tell us your goal and we'll create a personalized roadmap with:</p>
                  <ul>
                    <li>📊 <strong>Structured Timeline</strong> - Weekly breakdown</li>
                    <li>🔍 <strong>Skill Development</strong> - Progressive learning</li>
                    <li>📚 <strong>Curated Resources</strong> - Best books & courses</li>
                    <li>✅ <strong>Clear Milestones</strong> - Track your progress</li>
                    <li>⏱️ <strong>Time Management</strong> - Realistic schedule</li>
                  </ul>
                  <p className="coming-soon">Type your learning goal below to get started!</p>
                </div>
              </div>

              <div className="chat-input-container roadmap-input">
                <div className="input-wrapper extra-large-input">
                  <textarea
                    placeholder="e.g., 'Generate roadmap to become a Machine Learning Engineer' or 'Create learning path for Web Development'"
                    className="chat-input extra-large-input-field"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows="2"
                  />
                  <button className="send-button extra-large-send-button" onClick={generateRoadmap} disabled={!inputMessage.trim() || isLoading}>
                    {isLoading ? (
                      <span className="loading-spinner"></span>
                    ) : (
                      <span className="send-arrow">→</span>
                    )}
                  </button>
                </div>
                <p className="input-hint">Press Enter to generate roadmap</p>
              </div>
            </div>
          ) : (
            <div className="roadmap-display">
              <div className="roadmap-summary">
                <div className="summary-card">
                  <h3 className="blue-title">🎯 Your Learning Goal</h3>
                  <p className="goal-text">{roadmapData.title}</p>
                  <div className="duration-badge">
                    <span className="duration-icon">⏱️</span>
                    <span>Duration: {roadmapData.duration}</span>
                  </div>
                </div>
              </div>

              <div className="timeline-container">
                <h3 className="blue-title timeline-main-title">📅 Your Learning Timeline</h3>
                <p className="timeline-subtitle">A structured {roadmapData.duration} journey to master {roadmapData.title}</p>

                <div className="timeline">
                  {roadmapData.phases.map((phase, index) => (
                    <TimelineCard
                      key={index}
                      phase={phase.phase}
                      title={phase.title}
                      weeks={phase.weeks}
                      content={phase.content}
                      isLast={index === roadmapData.phases.length - 1}
                    />
                  ))}
                </div>
              </div>

              <div className="milestones-section">
                <h3 className="blue-title">🎯 Key Milestones</h3>
                <p className="section-description">Track your progress with these important achievements</p>
                <div className="milestones-grid">
                  {roadmapData.milestones.map((milestone, idx) => (
                    <div key={idx} className="milestone-card">
                      <div className="milestone-icon">{idx + 1}</div>
                      <span>{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="resources-section">
                <h3 className="blue-title">📚 Recommended Resources</h3>
                <p className="section-description">Curated learning materials to accelerate your progress</p>
                <div className="resources-grid">
                  <div className="resource-card">
                    <div className="resource-icon">🎓</div>
                    <h5>Courses & Certifications</h5>
                    <ul>
                      {roadmapData.resources.courses.map((course, idx) => (
                        <li key={idx}>{course}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="resource-card">
                    <div className="resource-icon">📖</div>
                    <h5>Essential Books</h5>
                    <ul>
                      {roadmapData.resources.books.map((book, idx) => (
                        <li key={idx}>{book}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="resource-card">
                    <div className="resource-icon">🌐</div>
                    <h5>Online Platforms</h5>
                    <ul>
                      {roadmapData.resources.platforms.map((platform, idx) => (
                        <li key={idx}>{platform}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="resource-card">
                    <div className="resource-icon">👥</div>
                    <h5>Communities</h5>
                    <ul>
                      {roadmapData.resources.communities.map((community, idx) => (
                        <li key={idx}>{community}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="action-buttons">
                <button className="generate-new-btn" onClick={() => setRoadmapData(null)}>
                  🔄 Generate New Roadmap
                </button>
                <button className="download-btn">
                  ⬇️ Download as PDF
                </button>
              </div>

              <div className="chat-input-container roadmap-input">
                <div className="input-wrapper extra-large-input">
                  <textarea
                    placeholder="Generate another roadmap or modify existing..."
                    className="chat-input extra-large-input-field"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    rows="2"
                  />
                  <button className="send-button extra-large-send-button" onClick={generateRoadmap} disabled={!inputMessage.trim() || isLoading}>
                    {isLoading ? (
                      <span className="loading-spinner"></span>
                    ) : (
                      <span className="send-arrow">→</span>
                    )}
                  </button>
                </div>
                <p className="input-hint">Press Enter to generate another roadmap</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

// Main Component
export default function AIToolsPage() {
  const [activeTool, setActiveTool] = useState(null);
  const [chatSessions, setChatSessions] = useState([
    {
      id: '1',
      title: 'Chat 1',
      messages: [],
      createdAt: new Date().toISOString(),
    }
  ]);
  const [currentSessionId, setCurrentSessionId] = useState('1');

  // Add this function - it was missing
  const updateSessionMessages = (sessionId, newMessages) => {
    setChatSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId ? { ...session, messages: newMessages } : session
      )
    );
  };

  const createNewChat = () => {
    const newSession = {
      id: Date.now().toString(),
      title: `Chat ${chatSessions.length + 1}`,
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
  };

  const deleteChat = (id) => {
    setChatSessions(prevSessions => {
      const remainingSessions = prevSessions.filter(session => session.id !== id);
      if (currentSessionId === id) {
        if (remainingSessions.length > 0) {
          setCurrentSessionId(remainingSessions[0].id);
        } else {
          const newSession = {
            id: Date.now().toString(),
            title: 'Chat 1',
            messages: [],
            createdAt: new Date().toISOString(),
          };
          return [newSession];
        }
      }
      return remainingSessions;
    });
  };

  const renameChat = (id, newTitle) => {
    if (newTitle && newTitle.trim()) {
      setChatSessions(chatSessions.map(session =>
        session.id === id ? { ...session, title: newTitle.trim() } : session
      ));
    }
  };

  const shareChat = (id) => {
    const session = chatSessions.find(s => s.id === id);
    if (session) {
      const shareData = {
        title: session.title,
        messages: session.messages,
        createdAt: session.createdAt
      };
      navigator.clipboard.writeText(JSON.stringify(shareData, null, 2));
      alert("Chat data copied to clipboard!");
    }
  };

  const followOnChat = (id) => {
    const session = chatSessions.find(s => s.id === id);
    if (session) {
      const historyForContext = session.messages
        .filter(msg => !msg.isFollowOnContext)
        .map(msg => ({
          sender: msg.sender,
          content: msg.content
        }));
      const contextJson = JSON.stringify(historyForContext, null, 2);

      const contextMessage = {
        id: 'context-' + Date.now().toString(),
        content: contextJson,
        sender: "system",
        timestamp: new Date().toISOString(),
        isFollowOnContext: true
      };

      const newSession = {
        id: Date.now().toString(),
        title: `${session.title} (Follow-up)`,
        messages: [contextMessage],
        createdAt: new Date().toISOString(),
      };
      setChatSessions(prev => [newSession, ...prev]);
      setCurrentSessionId(newSession.id);
      setActiveTool('chat');
    }
  };

  return (
    <div style={{
      fontFamily: 'Inter, sans-serif',
      margin: 0,
      background: ' var(--bg-main)',
      minHeight: '100vh'
    }}>
      <style>{`
        * { box-sizing: border-box; }
       
        .ai-tools-page { padding: 40px; display: flex;align-items: center; flex-direction: column; }
        .ai-title { font-size: 28px; margin-bottom: 24px; }
        .ai-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; grid-direction: rtl; width: 100%; max-width: 1000px; }
        .ai-card { background: var(--bg-card); border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); border: 1px solid var(--border-color); }
        .ai-card:hover { transform: translateY(-6px); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1); border-color: #2563eb; }
        .ai-icon { font-size: 32px; margin-bottom: 10px; } 
        .ai-card h3 { margin: 12px 0 6px; color: var(--text-primary); }
        .ai-card p { color: #6b7280; font-size: 14px; line-height: 1.5; }
        
        .ai-modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.25); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 999; animation: fadeIn 0.3s ease; }
        .ai-modal { width: 92%; height: 88%; background: #f9fafb; border-radius: 18px; overflow: hidden; position: relative; animation: slideUp 0.4s cubic-bezier(.22, 1, .36, 1); display: flex; flex-direction: column; }
        .ai-close { position: absolute; top: 14px; right: 16px; border: none; background: #e5e7eb; padding: 8px 12px; border-radius: 50%; cursor: pointer; z-index: 10; font-size: 16px; transition: background 0.2s; }
        .ai-close:hover { background: #d1d5db; }
        
        .chat-layout { display: flex; height: 100%; min-height: 0; }
        .chat-sidebar { width: 260px; background: var(--bg-card); border-right: 1px solid var(--border-color); padding: 18px; display: flex; flex-direction: column; overflow-y: auto; border: 2px solid var(--text-secondary);border-radius: 18px;}
        .new-chat { width: 100%; padding: 12px; border: none; border-radius: 10px; background: #2563eb; color: white; cursor: pointer; font-weight: 500; margin-bottom: 20px; transition: background 0.2s; }
        .new-chat:hover { background: #1d4ed8; }
        .chat-history { flex: 1; overflow-y: auto; }
        .chat-history h4 { margin: 0 0 15px 0; color: #374151; font-size: 14px; font-weight: 600; }
        .chat-session { padding: 10px 12px; border-radius: 8px; margin-bottom: 6px; cursor: pointer; transition: background 0.2s; position: relative; }
        .chat-session:hover { background: #f3f4f6; }
        .chat-session.active { background: #eff6ff; border-left: 3px solid #2563eb; }
        .session-header { display: flex; justify-content: space-between; align-items: center; gap: 8px; }
        .session-title { flex: 1; font-size: 14px; color: #374151; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .rename-form { flex: 1; margin-right: 8px; display: flex; }
        .rename-input { width: 100%; padding: 2px 5px; border: 1px solid #2563eb; border-radius: 4px; font-size: 14px; color: var(--text-primary); background-color: #f0f4ff; outline: none; }
        .session-menu-btn { background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 4px; font-size: 18px; color: #6b7280; min-width: 24px; }
        .session-menu-btn:hover { background: #f3f4f6; }
        .session-dropdown { position: absolute; right: 0; top: 100%; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); z-index: 100; min-width: 160px; margin-top: 4px; }
        .session-dropdown button { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 14px; color: #374151; text-align: left; transition: background 0.2s; }
        .session-dropdown button:hover { background: #f3f4f6; }
        .session-dropdown .delete-btn { color: #dc2626; }
        
        .chat-main { border: 1px solid var(--text-secondary);border-radius: 18px; flex: 1; display: flex; flex-direction: column; background:var(--bg-main);padding: 20px 40px; min-height: 0; }
        .chat-header { text-align: center; margin-bottom: 20px; }
        .gradient-title { font-size: 28px; margin: 0 0 8px 0; background: linear-gradient(90deg, #1d4ed8, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .typing-suggestions-text { color: #6b7280; margin: 0 0 30px 0; font-size: 15px; font-weight: 500; min-height: 20px; }
        .typing-word { font-weight: 600; color: #3b82f6; }
        .typing-cursor { display: inline-block; animation: blink-cursor 0.75s step-end infinite; font-weight: 600; color: #3b82f6; } 
        @keyframes blink-cursor { from, to { opacity: 1; } 50% { opacity: 0; } }
        .subtitle { color: #6b7280; margin: 0 0 30px 0; font-size: 15px; }
        
        .blue-title {
          color: #2563eb;
          font-size: 28px;
          margin: 0 0 8px 0;
          font-weight: 700;
        }
        
        .messages-container { 
          flex: 1; 
          overflow-y: auto; 
          margin-bottom: 20px; 
          padding: 20px; 
          background: var(--bg-muted); 
          border-radius: 12px; 
          border: 1px solid #e5e7eb;
          /* Custom scrollbar styling */
          scrollbar-width: none; /* Firefox */
        }
        
        .messages-container::-webkit-scrollbar {
          width: 8px;
        }
        
        .messages-container::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        
        .messages-container::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        
        .messages-container::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        .empty-state { text-align: center; padding: 60px 20px; color: #6b7280; }
        .empty-icon { font-size: 48px; margin-bottom: 20px; }
        .empty-state h3 { color: #374151; margin-bottom: 8px; }
        .messages-list { display: flex; flex-direction: column; gap: 20px; }
        .message { padding: 16px; border-radius: 12px; max-width: 80%; animation: messageSlide 0.3s ease; }
        .user-message { align-self: flex-end; background: var(--bg-main); border: 1px solid #bfdbfe; }
        .ai-message { align-self: flex-start; background: var(--bg-main); border: 1px solid #e5e7eb; }
        .notes-message { background: #fef3c7; border: 1px solid #fde68a; }
        .message-sender { font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #4b5563; }
        .user-message .message-sender { color: #1e40af; }
        .message-content { font-size: 14px; line-height: 1.6; color: var(--text-color); white-space: pre-wrap; word-break: break-word; }
        .message-time { font-size: 11px; color: #9ca3af; margin-top: 6px; text-align: right; }
        
        .notes-heading {
          color: #2563eb;
          margin: 10px 0 5px 0;
          font-size: 18px;
          font-weight: 700;
        }
        
        .notes-subheading {
          color: #3b82f6;
          margin: 8px 0 4px 0;
          font-size: 16px;
          font-weight: 600;
        }
        
        .context-message-wrapper { align-self: flex-start; width: 100%; max-width: 90%; }
        .follow-on-context-details { background: #f0fdf4; border: 1px dashed #4ade80; padding: 10px; border-radius: 8px; color: #166534; margin-top: 10px; text-align: left; }
        .follow-on-context-details summary { font-weight: 600; cursor: pointer; user-select: none; list-style: none; }
        .follow-on-context-json { background: #e0f2f1; color: #064e3b; padding: 10px; border-radius: 6px; margin-top: 8px; font-size: 0.8em; white-space: pre-wrap; word-break: break-all; max-height: 200px; overflow-y: auto; }
        
        .chat-input-container { padding: 20px 0; bground: var(--bg-main); }
        .input-wrapper { position: relative; max-width: 600px; margin: 0 auto; }
        .large-input { max-width: 700px; }
        .extra-large-input { max-width: 800px; }
        
        .chat-input { 
          width: 100%; 
          bgcolor: var(--input-bg);
          padding: 16px 60px 16px 20px; 
          border-radius: 14px; 
          border: 2px solid #d1d5db; 
          font-size: 16px; 
          resize: none; 
          min-height: 56px; 
          max-height: 150px; 
          font-family: inherit; 
          transition: all 0.3s ease;
          
        }
        
        .large-input-field {
          padding: 18px 70px 18px 24px;
          min-height: 60px;
          font-size: 17px;
        }
        
        .extra-large-input-field {
          padding: 20px 80px 20px 28px;
          min-height: 70px;
          font-size: 18px;
          border-radius: 16px;
        }
        
        .chat-input:focus { 
          outline: none; 
          border-color: #2563eb; 
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15); 
        }
        
        .send-button { 
          position: absolute; 
          right: 12px; 
          top: 50%; 
          transform: translateY(-50%); 
          background: #2563eb; 
          border: none; 
          border-radius: 10px; 
          width: 44px; 
          height: 44px; 
          cursor: pointer; 
          color: white; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
        }
        
        .large-send-button {
          width: 48px;
          height: 48px;
          right: 14px;
        }
        
        .extra-large-send-button {
          width: 52px;
          height: 52px;
          right: 16px;
        }
        
        .send-button:hover { 
          background: #1d4ed8; 
          transform: translateY(-50%) scale(1.05);
          box-shadow: 0 6px 16px rgba(37, 99, 235, 0.4);
        }
        
        .send-button:disabled { 
          background: #9ca3af; 
          cursor: not-allowed; 
          box-shadow: none;
        }
        
        .notes-button { background: #f59e0b; }
        .notes-button:hover { background: #d97706; }
        
        .send-arrow {
          font-size: 22px;
          font-weight: bold;
        }
        
        .input-hint { 
          text-align: center; 
          font-size: 13px; 
          color: #6b7280; 
          margin-top: 10px;
        }
        
        .notes-layout, .roadmap-layout { height: 100%; }
        .notes-main, .roadmap-main { 
          height: 100%; 
          display: flex; 
          flex-direction: column; 
          padding: 20px 40px; 
          overflow-y: auto;
          scrollbar-width: none; /* Firefox */
          background: var(--bg-main);
        }
        
        .notes-main::-webkit-scrollbar,
        .roadmap-main::-webkit-scrollbar {
          width: 8px;
        }
        
        .notes-main::-webkit-scrollbar-track,
        .roadmap-main::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .notes-main::-webkit-scrollbar-thumb,
        .roadmap-main::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
          opacity: 0.5;
        }
        
        .notes-main::-webkit-scrollbar-thumb:hover,
        .roadmap-main::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
           align-items: stretch !important;
        }
        
        .notes-header{ text-align: center; margin-bottom: 20px; }
        .prompt-suggestions { display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap; }
        .prompt-suggestions button { padding: 10px 20px; background: #f3f4f6; border: 2px solid #e5e7eb; border-radius: 10px; cursor: pointer; font-size: 14px; transition: all 0.2s; color: #374151; font-weight: 500; }
        .prompt-suggestions button:hover { background: #e5e7eb; border-color: #d1d5db; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); }
        
        /* Roadmap Full Modal Styles */
        .roadmap-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 40px;
          padding-bottom: 40px;
        }
          .roadmap-header {
        position: relative;
        top: 0;
         z-index: 5;
          background: var(--bg-main);
         padding-top: 10px;
         padding-bottom: 10px;
           margin-bottom: 20px;
        .roadmap-input-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 50px;
          padding: 20px 0;
        }
        
        .roadmap-display {
          display: flex;
          flex-direction: column;
          gap: 50px;
          padding-bottom: 40px;
        }
        
        .roadmap-summary {
          display: flex;
          justify-content: center;
        }
        
        .summary-card {
          background: white;
          border-radius: 20px;
          padding: 35px;
          text-align: center;
          border: 1px solid #e5e7eb;
          box-shadow: 0 8px 30px rgba(37, 99, 235, 0.1);
          max-width: 700px;
          width: 100%;
        }
        
        .goal-text {
          font-size: 24px;
          color: #1e40af;
          font-weight: 700;
          margin: 20px 0;
          padding: 20px;
          background: linear-gradient(135deg, #f0f4ff, #dbeafe);
          border-radius: 12px;
          border: 2px dashed #3b82f6;
          line-height: 1.4;
        }
        
        .duration-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #92400e;
          padding: 12px 24px;
          border-radius: 25px;
          font-size: 16px;
          font-weight: 700;
          margin-top: 15px;
          box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
        }
        
        .duration-icon {
          font-size: 18px;
        }
        
        /* Timeline Styles */
        .timeline-container {
          background: white;
          border-radius: 20px;
          padding: 40px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }
        
        .timeline-main-title {
          text-align: center;
          margin-bottom: 10px;
          font-size: 32px;
        }
        
        .timeline-subtitle {
          color: #6b7280;
          font-size: 18px;
          text-align: center;
          margin-bottom: 40px;
          line-height: 1.5;
        }
        
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 50px;
          margin: 40px 0;
        }
        
        .timeline-card {
          display: flex;
          gap: 40px;
        }
        
        .timeline-marker {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 50px;
          flex-shrink: 0;
        }
        
        .timeline-dot {
          width: 30px;
          height: 30px;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          border-radius: 50%;
          border: 5px solid white;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.3);
          z-index: 1;
        }
        
        .timeline-line {
          flex: 1;
          width: 4px;
          background: linear-gradient(to bottom, #2563eb, #93c5fd);
          margin-top: 15px;
        }
        
        .timeline-content {
          flex: 1;
          background: linear-gradient(135deg, #f8fafc, #f1f5f9);
          border-radius: 20px;
          padding: 30px;
          border: 2px solid #e2e8f0;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        
        .timeline-content:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 35px rgba(37, 99, 235, 0.2);
          border-color: #3b82f6;
        }
        
        .phase-badge {
          display: inline-block;
          background: linear-gradient(135deg, #2563eb, #3b82f6);
          color: white;
          padding: 8px 20px;
          border-radius: 25px;
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 20px;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        
        .timeline-content h3 {
          color: #1e40af;
          margin: 0 0 15px 0;
          font-size: 24px;
          font-weight: 800;
        }
        
        .weeks-badge {
          display: inline-block;
          background: linear-gradient(135deg, #fef3c7, #fde68a);
          color: #92400e;
          padding: 8px 18px;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 800;
          margin-bottom: 25px;
        }
        
        .timeline-description {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .timeline-item {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          color: #4b5563;
          font-size: 16px;
          line-height: 1.6;
        }
        
        .timeline-bullet {
          color: #2563eb;
          font-weight: bold;
          flex-shrink: 0;
          font-size: 20px;
        }
        
        .milestones-section, .resources-section {
          background: white;
          border-radius: 20px;
          padding: 40px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
        }
        
        .section-description {
          color: #6b7280;
          text-align: center;
          margin-bottom: 30px;
          font-size: 16px;
          line-height: 1.5;
        }
        
        .milestones-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 25px;
          margin-top: 30px;
        }
        
        .milestone-card {
          background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
          border: 3px solid #bae6fd;
          border-radius: 15px;
          padding: 25px;
          display: flex;
          align-items: center;
          gap: 20px;
          transition: all 0.3s ease;
        }
        
        .milestone-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(37, 99, 235, 0.25);
          border-color: #38bdf8;
        }
        
        .milestone-icon {
          background: linear-gradient(135deg, #38bdf8, #0ea5e9);
          color: white;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
          flex-shrink: 0;
          box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);
        }
        
        .milestone-card span {
          color: #0369a1;
          font-size: 16px;
          font-weight: 700;
          flex: 1;
          line-height: 1.5;
        }
        
        .resources-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 30px;
          margin-top: 30px;
        }
        
        .resource-card {
          background: white;
          border: 2px solid #e5e7eb;
          border-radius: 18px;
          padding: 30px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .resource-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
          border-color: #3b82f6;
        }
        
        .resource-icon {
          font-size: 40px;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #f0f4ff, #dbeafe);
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 20px rgba(37, 99, 235, 0.15);
        }
        
        .resource-card h5 {
          color: #1e40af;
          margin: 0 0 20px 0;
          font-size: 20px;
          font-weight: 800;
        }
        
        .resource-card ul {
          list-style: none;
          padding: 0;
          margin: 0;
          flex: 1;
          width: 100%;
        }
        
        .resource-card li {
          color: #4b5563;
          font-size: 15px;
          padding: 12px 0;
          border-bottom: 1px solid #f3f4f6;
          text-align: left;
          padding-left: 25px;
          position: relative;
        }
        
        .resource-card li:before {
          content: "→";
          color: #2563eb;
          font-weight: bold;
          font-size: 16px;
          position: absolute;
          left: 0;
          top: 12px;
        }
        
        .resource-card li:last-child {
          border-bottom: none;
        }
        
        .action-buttons {
          display: flex;
          gap: 25px;
          justify-content: center;
          margin: 40px 0 20px 0;
        }
        
        .generate-new-btn, .download-btn {
          padding: 18px 35px;
          border: none;
          border-radius: 15px;
          font-size: 17px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 12px;
          justify-content: center;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        
        .generate-new-btn {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          color: white;
        }
        
        .generate-new-btn:hover {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 30px rgba(37, 99, 235, 0.4);
        }
        
        .download-btn {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }
        
        .download-btn:hover {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
        }
        
        .roadmap-input {
          margin-top: 30px;
        }
        
        .loading-spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .roadmap-main { 
          align-items: center; 
          justify-content: flex-start; 
          text-align: center; 
        }
        
        .feature-preview { 
          max-width: 650px; 
          margin-top: 30px; 
        }
        
        .feature-card { 
          background: white; 
          padding: 40px; 
          border-radius: 20px; 
          border: 1px solid #e5e7eb; 
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08); 
        }
        
        .feature-card h3 { 
          margin-top: 0; 
          color: #2563eb; 
          font-size: 28px;
          margin-bottom: 20px;
        }
        
        .feature-description {
          color: #6b7280;
          font-size: 16px;
          margin-bottom: 25px;
          line-height: 1.6;
        }
        
        .feature-card p { color: #6b7280; line-height: 1.6; }
        .feature-card ul { list-style-type: none; padding: 0; margin: 15px 0 0; text-align: left; }
        .feature-card ul li { 
          background: linear-gradient(135deg, #f0f4ff, #e0f2fe);
          padding: 15px 20px; 
          margin-bottom: 12px; 
          border-radius: 12px; 
          color: #1d4ed8; 
          font-weight: 600; 
          display: flex; 
          align-items: center; 
          gap: 15px; 
          font-size: 16px;
          border-left: 4px solid #2563eb;
        }
        
        .coming-soon { 
          color: #2563eb; 
          font-weight: 700; 
          margin-top: 30px; 
          font-size: 18px; 
          padding: 15px;
          background: #f0f4ff;
          border-radius: 12px;
          border: 2px dashed #3b82f6;
        }
        
        @keyframes slideUp { from { transform: translateY(60px) scale(0.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes messageSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        @media (max-width: 768px) {
          .chat-layout { flex-direction: column; }
          .chat-sidebar { width: 100%; height: 200px; border-right: none; border-bottom: 1px solid #e5e7eb; }
          .ai-modal { width: 95%; height: 95%; }
          .message { max-width: 90%; }
          .timeline-card { flex-direction: column; }
          .timeline-marker { flex-direction: row; width: 100%; height: 40px; }
          .timeline-dot { margin-right: 10px; }
          .timeline-line { width: 100%; height: 2px; margin-top: 0; }
          .prompt-suggestions { flex-direction: column; align-items: center; }
          .prompt-suggestions button { width: 250px; }
          .milestones-grid, .resources-grid { grid-template-columns: 1fr; }
          .action-buttons { flex-direction: column; }
          .generate-new-btn, .download-btn { width: 100%; }
          .roadmap-main { padding: 15px; }
          .input-wrapper { max-width: 90%; }
          .extra-large-input { max-width: 95%; }
          .timeline-container, .milestones-section, .resources-section { padding: 20px; }
          .feature-card { padding: 25px; }
        }
      `}</style>

      {!activeTool && (
        <div className="ai-tools-page">
          <h1 className="aichart-header">AI Tools</h1>
          <div className="ai-grid">
            <ToolCard
              title="AI Chatbot"
              desc="Ask doubts, generate explanations"
              icon="💬"
              onClick={() => setActiveTool("chat")}
            />
            <ToolCard
              title="AI Notes Generator"
              desc="Generate revision-ready notes"
              icon="📝"
              onClick={() => setActiveTool("notes")}
            />
            <ToolCard
              title="Roadmap Generator"
              desc="Personalized learning paths"
              icon="🛣️"
              onClick={() => setActiveTool("roadmap")}
            />
          </div>
        </div>
      )}

      {activeTool && (
        <Modal onClose={() => setActiveTool(null)}>
          {activeTool === "chat" && (
            <ChatUI
              sessions={chatSessions}
              currentSessionId={currentSessionId}
              onSessionChange={setCurrentSessionId}
              onNewChat={createNewChat}
              onDeleteChat={deleteChat}
              onRenameChat={renameChat}
              onShareChat={shareChat}
              onFollowOnChat={followOnChat}
              onUpdateMessages={updateSessionMessages}
            />
          )}
          {activeTool === "notes" && <NotesGeneratorUI />}
          {activeTool === "roadmap" && <RoadmapGeneratorUI />}
        </Modal>
      )}
    </div>
  );
}