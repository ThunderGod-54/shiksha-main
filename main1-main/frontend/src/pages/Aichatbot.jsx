import React, { useState, useEffect, useRef } from "react";
import "./aichatbot.css";

export default function Aichatbot() {
  const [activeTool, setActiveTool] = useState(null);
  const [chatSessions, setChatSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");

  // Load chat sessions from localStorage on component mount
  useEffect(() => {
    const savedSessions = localStorage.getItem("ai-chat-sessions");
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      setChatSessions(parsedSessions);
      if (parsedSessions.length > 0) {
        setCurrentSessionId(parsedSessions[0].id);
        setMessages(parsedSessions[0].messages || []);
      }
    }
  }, []);

  // Save chat sessions to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("ai-chat-sessions", JSON.stringify(chatSessions));
  }, [chatSessions]);

  const createNewChat = () => {
    const newSession = {
      id: Date.now().toString(),
      title: `Chat ${chatSessions.length + 1}`,
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChatSessions([newSession, ...chatSessions]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
  };

  const deleteChat = (id) => {
    setChatSessions(chatSessions.filter(session => session.id !== id));
    if (currentSessionId === id) {
      if (chatSessions.length > 1) {
        const remainingSessions = chatSessions.filter(session => session.id !== id);
        setCurrentSessionId(remainingSessions[0].id);
        setMessages(remainingSessions[0].messages || []);
      } else {
        setCurrentSessionId(null);
        setMessages([]);
      }
    }
  };

  const renameChat = (id) => {
    const userInput = prompt("Enter new chat name:");
    if (userInput && userInput.trim()) {
      setChatSessions(chatSessions.map(session =>
        session.id === id ? { ...session, title: userInput.trim() } : session
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
      const newSession = {
        id: Date.now().toString(),
        title: `${session.title} (Follow-up)`,
        messages: [...session.messages],
        createdAt: new Date().toISOString(),
      };
      setChatSessions([newSession, ...chatSessions]);
      setCurrentSessionId(newSession.id);
      setMessages([...session.messages]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || !currentSessionId) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    // Update current session messages
    const updatedSessions = chatSessions.map(session => {
      if (session.id === currentSessionId) {
        return {
          ...session,
          messages: [...(session.messages || []), userMessage]
        };
      }
      return session;
    });

    setChatSessions(updatedSessions);
    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate AI response (replace with actual Gemini API call later)
    setTimeout(() => {
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        content: `I'm your AI assistant. You said: "${inputMessage}". This is a mock response. Connect me to Gemini API for real answers!`,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };

      const finalSessions = updatedSessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: [...(session.messages || []), aiMessage]
          };
        }
        return session;
      });

      setChatSessions(finalSessions);
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const generateNotes = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");

    // Simulate notes generation
    setTimeout(() => {
      const notesResponse = {
        id: (Date.now() + 1).toString(),
        content: `# Generated Notes\n\n**Topic:** ${inputMessage}\n\n## Key Points:\n1. First important concept\n2. Second key insight\n3. Practical application\n\n## Summary:\nThis is a mock notes generation. Connect to an API for actual content generation.`,
        sender: "ai",
        timestamp: new Date().toISOString(),
        isNotes: true,
      };
      setMessages(prev => [...prev, notesResponse]);
    }, 1500);
  };

  const switchSession = (id) => {
    const session = chatSessions.find(s => s.id === id);
    if (session) {
      setCurrentSessionId(id);
      setMessages(session.messages || []);
    }
  };

  return (
    <>
      {/* GRID PAGE */}
      {!activeTool && (
        <div className="ai-tools-page">
          <h1 className="ai-title">AI Tools</h1>

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
              onClick={() => {
                alert("Roadmap Generator - Coming Soon with Full Implementation!");
                setActiveTool("roadmap");
              }}
            />
            <ToolCard
              title="Course Generator"
              desc="Auto-generate full courses"
              icon="🎓"
              onClick={() => {
                alert("Course Generator - Coming Soon with Full Implementation!");
                setActiveTool("course");
              }}
            />
          </div>
        </div>
      )}

      {/* MODAL */}
      {activeTool && (
        <Modal onClose={() => setActiveTool(null)}>
          {activeTool === "notes" ? (
            <NotesGeneratorUI
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              generateNotes={generateNotes}
            />
          ) : activeTool === "roadmap" ? (
            <RoadmapGeneratorUI />
          ) : activeTool === "course" ? (
            <CourseGeneratorUI />
          ) : (
            <ChatUI
              chatSessions={chatSessions}
              currentSessionId={currentSessionId}
              messages={messages}
              inputMessage={inputMessage}
              setInputMessage={setInputMessage}
              sendMessage={sendMessage}
              createNewChat={createNewChat}
              switchSession={switchSession}
              deleteChat={deleteChat}
              renameChat={renameChat}
              shareChat={shareChat}
              followOnChat={followOnChat}
            />
          )}
        </Modal>
      )}
    </>
  );
}

/* ---------- COMPONENTS ---------- */

const ToolCard = ({ title, desc, icon, onClick }) => (
  <div className="ai-card" onClick={onClick}>
    <div className="ai-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);

const Modal = ({ children, onClose }) => (
  <div className="ai-modal-backdrop">
    <div className="ai-modal">
      <button className="ai-close" onClick={onClose}>
        ✕
      </button>
      {children}
    </div>
  </div>
);

const ChatUI = ({
  chatSessions,
  currentSessionId,
  messages,
  inputMessage,
  setInputMessage,
  sendMessage,
  createNewChat,
  switchSession,
  deleteChat,
  renameChat,
  shareChat,
  followOnChat,
}) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-layout">
      <aside className="chat-sidebar">
        <button className="new-chat" onClick={createNewChat}>
          ＋ New Chat
        </button>
        <div className="chat-history">
          <h4>Chat History</h4>
          {chatSessions.map((session) => (
            <div
              key={session.id}
              className={`chat-session ${currentSessionId === session.id ? "active" : ""}`}
            >
              <div
                className="session-header"
                onClick={() => switchSession(session.id)}
              >
                <span className="session-title">{session.title}</span>
                <button
                  className="session-menu-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDropdown(activeDropdown === session.id ? null : session.id);
                  }}
                >
                  ⋮
                </button>
              </div>
              {activeDropdown === session.id && (
                <div className="session-dropdown">
                  <button onClick={() => shareChat(session.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                      <polyline points="16 6 12 2 8 6"></polyline>
                      <line x1="12" y1="2" x2="12" y2="15"></line>
                    </svg>
                    Share
                  </button>
                  <button onClick={() => renameChat(session.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                    </svg>
                    Rename
                  </button>
                  <button onClick={() => followOnChat(session.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M17 1l4 4-4 4"></path>
                      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                      <path d="M7 23l-4-4 4-4"></path>
                      <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                    </svg>
                    Follow on
                  </button>
                  <button className="delete-btn" onClick={() => deleteChat(session.id)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      <line x1="10" y1="11" x2="10" y2="17"></line>
                      <line x1="14" y1="11" x2="14" y2="17"></line>
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      <main className="chat-main">
        <div className="chat-header">
          <h2>Ask your Study Assistant</h2>
          <p className="subtitle">Try: Explain Operating Systems</p>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <h3>Start a conversation</h3>
              <p>Ask me anything about your studies!</p>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.sender === "user" ? "user-message" : "ai-message"}`}
                >
                  <div className="message-sender">
                    {msg.sender === "user" ? "You" : "AI Assistant"}
                  </div>
                  <div className="message-content">
                    {msg.content}
                  </div>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
          <p className="input-hint">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </main>
    </div>
  );
};

const NotesGeneratorUI = ({ messages, inputMessage, setInputMessage, generateNotes }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          <h2>Generate Smart Notes</h2>
          <p className="subtitle">Try: Generate revision notes for DBMS</p>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Generate Study Notes</h3>
              <p>Tell me what topic you want notes for!</p>
              <div className="prompt-suggestions">
                <button onClick={() => setInputMessage("Generate revision notes for DBMS")}>
                  DBMS Notes
                </button>
                <button onClick={() => setInputMessage("Create study notes for React.js")}>
                  React.js Notes
                </button>
                <button onClick={() => setInputMessage("Make notes about Machine Learning")}>
                  ML Notes
                </button>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${msg.sender === "user" ? "user-message" : "ai-message notes-message"}`}
                >
                  <div className="message-sender">
                    {msg.sender === "user" ? "You" : "Notes Generator"}
                  </div>
                  <div
                    className="message-content"
                    dangerouslySetInnerHTML={{
                      __html: msg.content.replace(/\n/g, '<br>').replace(/# (.*?)\n/g, '<h3>$1</h3>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
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
          <div className="input-wrapper">
            <textarea
              placeholder="Enter topic for notes generation..."
              className="chat-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
            />
            <button className="send-button notes-button" onClick={generateNotes} disabled={!inputMessage.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-2 16H8v-2h4v2zm3-5H8v-2h7v2zm0-4H8V7h7v2z"></path>
              </svg>
            </button>
          </div>
          <p className="input-hint">Press Enter to generate notes</p>
        </div>
      </main>
    </div>
  );
};

const RoadmapGeneratorUI = () => (
  <div className="roadmap-layout">
    <main className="roadmap-main">
      <h2>Roadmap Generator</h2>
      <p className="subtitle">Personalized Learning Paths - Coming Soon!</p>
      <div className="feature-preview">
        <div className="feature-card">
          <h3>🏗️ Under Development</h3>
          <p>This feature is being developed and will be available soon.</p>
          <p>It will generate step-by-step learning roadmaps for any subject.</p>
        </div>
      </div>
    </main>
  </div>
);

const CourseGeneratorUI = () => (
  <div className="course-layout">
    <main className="course-main">
      <h2>Course Generator</h2>
      <p className="subtitle">Auto-generate Full Courses - Coming Soon!</p>
      <div className="feature-preview">
        <div className="feature-card">
          <h3>🎓 Course Builder</h3>
          <p>This feature is being developed and will be available soon.</p>
          <p>It will create complete courses with modules, lessons, and quizzes.</p>
        </div>
      </div>
    </main>
  </div>
);