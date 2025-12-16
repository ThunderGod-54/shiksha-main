import React, { useState, useEffect, useRef } from "react";

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

// Chat UI Component
const ChatUI = ({ sessions, currentSessionId, onSessionChange, onNewChat, onDeleteChat, onRenameChat, onShareChat, onFollowOnChat, onUpdateMessages }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [renameValue, setRenameValue] = useState('');
  const messagesEndRef = useRef(null);

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

// Notes Generator UI Component
const NotesGeneratorUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

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
          <h2>Generate Smart Notes</h2>
          <p className="subtitle">Try: Generate revision notes for Web Developement</p>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Generate Study Notes</h3>
              <p>Tell me what topic you want notes for!</p>
              <div className="prompt-suggestions">
                <button onClick={() => setInputMessage("Generate revision notes for DSA")}>DSA Notes</button>
                <button onClick={() => setInputMessage("Create study notes for React.js")}>React.js Notes</button>
                <button onClick={() => setInputMessage("Make notes about Machine Learning")}>ML Notes</button>
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
                        .replace(/# (.*?)<br>/g, '<h3>$1</h3>')
                        .replace(/## (.*?)<br>/g, '<h4>$1</h4>')
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

// Roadmap Generator UI Component
const RoadmapGeneratorUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateRoadmap = async () => {
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
      const roadmapResponse = {
        id: (Date.now() + 1).toString(),
        content: `🛣️ **Personalized Learning Roadmap: ${messageToSend}**\n\n**Phase 1: Foundation (Weeks 1-4)**\n- Learn fundamental concepts\n- Build basic projects\n- Resources: Online tutorials, documentation\n\n**Phase 2: Intermediate (Weeks 5-8)**\n- Advanced topics and techniques\n- Real-world applications\n- Resources: Courses, books, practice problems\n\n**Phase 3: Advanced (Weeks 9-12)**\n- Expert-level concepts\n- Portfolio projects\n- Resources: Research papers, open-source contribution\n\n**Milestones:**\n✓ Complete 3 small projects\n✓ Contribute to open-source\n✓ Build a portfolio website\n\nThis roadmap is customized based on current trends and industry requirements.`,
        sender: "ai",
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, roadmapResponse]);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      generateRoadmap();
    }
  };

  return (
    <div className="roadmap-layout">
      <main className="roadmap-main full-height">
        <h2>Roadmap Generator</h2>
        <p className="subtitle">Visualize your learning path with clarity.</p>

        <div className="messages-container tool-messages-container">
          {messages.length === 0 ? (
            <div className="feature-preview">
              <div className="feature-card">
                <h3>Features Include:</h3>
                <ul>
                  <li>Goal-Oriented Path Creation</li>
                  <li>Skill Gap Analysis</li>
                  <li>Resource Recommendations (Books, Videos, Courses)</li>
                  <li>Progress Tracking and Milestones</li>
                </ul>
                <p className="coming-soon">Type a goal below to generate your roadmap!</p>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {messages.map((msg) => (
                <div key={msg.id} className={`message ${msg.sender === "user" ? "user-message" : "ai-message"}`}>
                  <div className="message-sender">{msg.sender === "user" ? "You" : "Roadmap Generator"}</div>
                  <div
                    className="message-content"
                    dangerouslySetInnerHTML={{
                      __html: msg.content
                        .replace(/\n/g, '<br>')
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
          <div className="input-wrapper">
            <textarea
              placeholder="e.g., 'Generate roadmap to become a Machine Learning Engineer'"
              className="chat-input"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              rows="1"
            />
            <button className="send-button" onClick={generateRoadmap} disabled={!inputMessage.trim()}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </div>
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
      background: '#f9fafb',
      minHeight: '100vh'
    }}>
      <style>{`
        * { box-sizing: border-box; }
        
        .ai-tools-page { padding: 40px; }
        .ai-title { font-size: 28px; margin-bottom: 24px; }
        .ai-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
        .ai-card { background: #ffffff; border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.25s ease; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; }
        .ai-card:hover { transform: translateY(-6px); box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1); border-color: #2563eb; }
        .ai-icon { font-size: 32px; margin-bottom: 10px; }
        .ai-card h3 { margin: 12px 0 6px; color: #111827; }
        .ai-card p { color: #6b7280; font-size: 14px; line-height: 1.5; }
        
        .ai-modal-backdrop { position: fixed; inset: 0; background: rgba(0, 0, 0, 0.25); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 999; animation: fadeIn 0.3s ease; }
        .ai-modal { width: 92%; height: 88%; background: #f9fafb; border-radius: 18px; overflow: hidden; position: relative; animation: slideUp 0.4s cubic-bezier(.22, 1, .36, 1); display: flex; flex-direction: column; }
        .ai-close { position: absolute; top: 14px; right: 16px; border: none; background: #e5e7eb; padding: 8px 12px; border-radius: 50%; cursor: pointer; z-index: 10; font-size: 16px; transition: background 0.2s; }
        .ai-close:hover { background: #d1d5db; }
        
        .chat-layout { display: flex; height: 100%; min-height: 0; }
        .chat-sidebar { width: 260px; background: #ffffff; border-right: 1px solid #e5e7eb; padding: 20px; display: flex; flex-direction: column; overflow-y: auto; scrollbar-width: none; }
        .chat-sidebar::-webkit-scrollbar { width: 0px; }
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
        .rename-input { width: 100%; padding: 2px 5px; border: 1px solid #2563eb; border-radius: 4px; font-size: 14px; color: #111827; background-color: #f0f4ff; outline: none; }
        .session-menu-btn { background: none; border: none; cursor: pointer; padding: 4px 8px; border-radius: 4px; font-size: 18px; color: #6b7280; min-width: 24px; }
        .session-menu-btn:hover { background: #f3f4f6; }
        .session-dropdown { position: absolute; right: 0; top: 100%; background: white; border: 1px solid #e5e7eb; border-radius: 8px; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1); z-index: 100; min-width: 160px; margin-top: 4px; }
        .session-dropdown button { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px 14px; border: none; background: none; cursor: pointer; font-size: 14px; color: #374151; text-align: left; transition: background 0.2s; }
        .session-dropdown button:hover { background: #f3f4f6; }
        .session-dropdown .delete-btn { color: #dc2626; }
        
        .chat-main { flex: 1; display: flex; flex-direction: column; padding: 20px 40px; min-height: 0; }
        .chat-header { text-align: center; margin-bottom: 20px; }
        .gradient-title { font-size: 28px; margin: 0 0 8px 0; background: linear-gradient(90deg, #1d4ed8, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .typing-suggestions-text { color: #6b7280; margin: 0 0 30px 0; font-size: 15px; font-weight: 500; min-height: 20px; }
        .typing-word { font-weight: 600; color: #3b82f6; }
        .typing-cursor { display: inline-block; animation: blink-cursor 0.75s step-end infinite; font-weight: 600; color: #3b82f6; }
        @keyframes blink-cursor { from, to { opacity: 1; } 50% { opacity: 0; } }
        .subtitle { color: #6b7280; margin: 0 0 30px 0; font-size: 15px; }
        
        .messages-container { flex: 1; overflow-y: auto; margin-bottom: 20px; padding: 20px; background: white; border-radius: 12px; border: 1px solid #e5e7eb; scrollbar-width: none; }
        .messages-container::-webkit-scrollbar { width: 0px; }
        .empty-state { text-align: center; padding: 60px 20px; color: #6b7280; }
        .empty-icon { font-size: 48px; margin-bottom: 20px; }
        .empty-state h3 { color: #374151; margin-bottom: 8px; }
        .messages-list { display: flex; flex-direction: column; gap: 20px; }
        .message { padding: 16px; border-radius: 12px; max-width: 80%; animation: messageSlide 0.3s ease; }
        .user-message { align-self: flex-end; background: #eff6ff; border: 1px solid #bfdbfe; }
        .ai-message { align-self: flex-start; background: #f9fafb; border: 1px solid #e5e7eb; }
        .notes-message { background: #fef3c7; border: 1px solid #fde68a; }
        .message-sender { font-size: 12px; font-weight: 600; margin-bottom: 6px; color: #4b5563; }
        .user-message .message-sender { color: #1e40af; }
        .message-content { font-size: 14px; line-height: 1.6; color: #111827; white-space: pre-wrap; word-break: break-word; }
        .message-time { font-size: 11px; color: #9ca3af; margin-top: 6px; text-align: right; }
        
        .context-message-wrapper { align-self: flex-start; width: 100%; max-width: 90%; }
        .follow-on-context-details { background: #f0fdf4; border: 1px dashed #4ade80; padding: 10px; border-radius: 8px; color: #166534; margin-top: 10px; text-align: left; }
        .follow-on-context-details summary { font-weight: 600; cursor: pointer; user-select: none; list-style: none; }
        .follow-on-context-json { background: #e0f2f1; color: #064e3b; padding: 10px; border-radius: 6px; margin-top: 8px; font-size: 0.8em; white-space: pre-wrap; word-break: break-all; max-height: 200px; overflow-y: auto; }
        
        .chat-input-container { padding: 20px 0; }
        .input-wrapper { position: relative; max-width: 520px; margin: 0 auto; }
        .chat-input { width: 100%; padding: 14px 50px 14px 16px; border-radius: 12px; border: 1px solid #d1d5db; font-size: 15px; resize: none; min-height: 48px; max-height: 120px; font-family: inherit; transition: border-color 0.2s; }
        .chat-input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .send-button { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); background: #2563eb; border: none; border-radius: 8px; width: 36px; height: 36px; cursor: pointer; color: white; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
        .send-button:hover { background: #1d4ed8; }
        .send-button:disabled { background: #9ca3af; cursor: not-allowed; }
        .notes-button { background: #f59e0b; }
        .notes-button:hover { background: #d97706; }
        .input-hint { text-align: center; font-size: 12px; color: #6b7280; margin-top: 8px; }
        
        .notes-layout, .roadmap-layout { height: 100%; }
        .notes-main, .roadmap-main { height: 100%; display: flex; flex-direction: column; padding: 20px 40px; }
        .notes-header { text-align: center; margin-bottom: 20px; }
        .notes-header h2 { font-size: 28px; margin: 0 0 8px 0; color: #111827; }
        .prompt-suggestions { display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap; }
        .prompt-suggestions button { padding: 8px 16px; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; cursor: pointer; font-size: 13px; transition: all 0.2s; }
        .prompt-suggestions button:hover { background: #e5e7eb; border-color: #d1d5db; }
        
        .roadmap-main { align-items: center; justify-content: flex-start; text-align: center; }
        .roadmap-main h2 { font-size: 28px; margin: 0 0 8px 0; color: #111827; }
        .feature-preview { max-width: 400px; margin-top: 30px; }
        .feature-card { background: white; padding: 30px; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05); }
        .feature-card h3 { margin-top: 0; color: #111827; }
        .feature-card p { color: #6b7280; line-height: 1.6; }
        .feature-card ul { list-style-type: none; padding: 0; margin: 15px 0 0; text-align: left; }
        .feature-card ul li { background: #f0f4ff; padding: 8px 12px; margin-bottom: 5px; border-radius: 6px; color: #1d4ed8; font-weight: 500; }
        .coming-soon { color: #dc2626; font-weight: 600; margin-top: 20px; }
        
        @keyframes slideUp { from { transform: translateY(60px) scale(0.96); opacity: 0; } to { transform: translateY(0) scale(1); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes messageSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        @media (max-width: 768px) {
          .chat-layout { flex-direction: column; }
          .chat-sidebar { width: 100%; height: 200px; border-right: none; border-bottom: 1px solid #e5e7eb; }
          .ai-modal { width: 95%; height: 95%; }
          .message { max-width: 90%; }
        }
      `}</style>

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