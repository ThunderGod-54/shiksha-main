import React, { useState, useEffect, useRef } from "react";
import "./aichatbot.css";

// ---- API CONFIG ----
const GEMINI_API_KEY = "lol paste ur api here"; // 👈 put your real key here
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// -------------------- LOADER --------------------
const Loader = () => (
  <div className="aichat-loader-wrapper">
    <div className="aichat-loader">
      {["L", "o", "a", "d", "i", "n", "g"].map((ch, i) => (
        <span key={i} className="loader-letter" style={{ animationDelay: `${i * 0.1}s` }}>
          {ch}
        </span>
      ))}
      <div className="loader-ring" />
    </div>
  </div>
);

// -------------------- WATERMARK --------------------
const Watermark = () => (
  <div className="aichat-watermark">
    <p className="watermark-pill">
      <span className="watermark-dot" />
      Your AI study companion with Follow-on context ✨
    </p>
  </div>
);

// -------------------- PROMPT SUGGESTIONS --------------------
const PromptSuggestions = () => {
  const suggestions = [
    "Study tips for exams",
    "Explain a tough concept",
    "Generate revision notes",
    "Create a study schedule",
    "Step-by-step homework help",
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setIndex((prev) => (prev + 1) % suggestions.length),
      2000
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="prompt-root">
      <h2 className="prompt-title">
        Ask your{" "}
        <span className="prompt-highlight">
          Study Assistant
        </span>
      </h2>
      <p className="prompt-sub">Try something like:</p>
      <p className="prompt-example">“{suggestions[index]}”</p>
    </div>
  );
};

// -------------------- BUBBLE ACTIONS --------------------
const BubbleActions = ({ messageText, showNotification }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    showNotification("Copied to clipboard ✔️");
  };

  const handleShare = async () => {
    if (!navigator.share) {
      showNotification("Share feature not available.");
      return;
    }
    try {
      await navigator.share({ title: "Chat Message", text: messageText });
    } catch {
      showNotification("Could not share content.");
    }
  };

  return (
    <div className="bubble-actions">
      <button
        onClick={handleCopy}
        title="Copy"
        className="bubble-icon-btn"
      >
        📋
      </button>
      <button
        onClick={() => showNotification("Feedback noted. Thank you!")}
        title="Feedback"
        className="bubble-icon-btn"
      >
        👍
      </button>
      <button
        onClick={handleShare}
        title="Share"
        className="bubble-icon-btn"
      >
        📤
      </button>
    </div>
  );
};

// -------------------- MAIN COMPONENT --------------------
function Aichatbot() {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [menuId, setMenuId] = useState(null);

  const menuRef = useRef(null);

  const SYSTEM_INSTRUCTION = `You are a helpful AI study assistant focused on helping students learn. Your expertise includes: homework help, study techniques, exam preparation, concept explanations, and academic guidance.
- Always be encouraging and patient with students
- Break down complex topics into simple explanations
- Provide examples when explaining concepts
- If asked about non-academic topics, politely redirect to study-related questions
- You can respond to simple greetings like "hello", "hi", or "how are you?"`;

  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const isChatEmpty = !activeChat || activeChat.history.length === 0;

  // Close sidebar menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showNotification = (msg) => {
    setNotification({ show: true, message: msg });
    setTimeout(() => setNotification({ show: false, message: "" }), 2200);
  };

  const createNewChat = () => {
    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: `Chat ${chats.length + 1}`,
      history: [],
    };
    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChatId);
  };

  const updateActiveChatHistory = (newHistory) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === activeChatId ? { ...chat, history: newHistory } : chat
      )
    );
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading || !activeChat) return;

    if (GEMINI_API_KEY === "YOUR_NEW_GOOGLE_AI_STUDIO_API_KEY") {
      const errorHistory = [
        ...activeChat.history,
        {
          type: "bot",
          text: "Error: API key not set. Please add your API key at the top of the Aichatbot.js file.",
        },
      ];
      updateActiveChatHistory(errorHistory);
      return;
    }

    const newMessage = { type: "user", text: message };
    const newHistoryForUI = [...activeChat.history, newMessage];
    updateActiveChatHistory(newHistoryForUI);

    const historyForAPI = newHistoryForUI
      .map((msg) => {
        if (msg.isFollowOn) {
          return {
            role: "user",
            parts: [
              {
                text: `Please use the following JSON data as the context for our entire conversation. This is the history from a previous chat. Context: ${msg.text}`,
              },
            ],
          };
        }
        return {
          role: msg.type === "user" ? "user" : "model",
          parts: [{ text: msg.text }],
        };
      })
      .filter((msg) => msg.parts[0].text);

    setMessage("");
    setIsLoading(true);
    const timer = new Promise((resolve) => setTimeout(resolve, 700));

    const systemPrompt = {
      role: "user",
      parts: [{ text: `System Instruction: ${SYSTEM_INSTRUCTION}` }],
    };

    const modelPrimer = {
      role: "model",
      parts: [{ text: "Understood. I am ready to help." }],
    };

    const contentsForAPI = [systemPrompt, modelPrimer, ...historyForAPI];

    try {
      const requestBody = { contents: contentsForAPI };

      const fetchRequest = fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const [res] = await Promise.all([fetchRequest, timer]);

      if (!res.ok) {
        const errorBody = await res.json();
        console.error("API Error:", errorBody);

        const msg = errorBody?.error?.message || "Unknown error";
        if (msg.includes("API key not valid")) {
          throw new Error("API key not valid. Please pass a valid API key.");
        }
        if (msg.includes("is not found for API version")) {
          throw new Error(
            `Model/API version mismatch. Check your GEMINI_API_URL. (Details: ${msg})`
          );
        }
        if (msg.includes("Invalid JSON payload")) {
          throw new Error(
            `Invalid JSON payload. Check the request body structure. (Details: ${msg})`
          );
        }
        throw new Error(`API request failed: ${msg}`);
      }

      const data = await res.json();
      const botReply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I'm sorry, I couldn't generate a response.";

      const updatedHistoryWithBot = [
        ...newHistoryForUI,
        { type: "bot", text: botReply },
      ];
      updateActiveChatHistory(updatedHistoryWithBot);
    } catch (error) {
      console.error(error);
      const updatedHistoryWithError = [
        ...newHistoryForUI,
        {
          type: "bot",
          text: `Error: Could not process request. ${error.message}`,
        },
      ];
      updateActiveChatHistory(updatedHistoryWithError);
    } finally {
      setIsLoading(false);
    }
  };

  const renameChat = (id, newTitle) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === id ? { ...chat, title: newTitle || chat.title } : chat
      )
    );
  };

  const deleteChat = (idToDelete) => {
    const remainingChats = chats.filter((chat) => chat.id !== idToDelete);
    setChats(remainingChats);
    if (activeChatId === idToDelete) {
      setActiveChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
    }
  };

  const createFollowOnChat = (sourceChatId) => {
    const sourceChat = chats.find((chat) => chat.id === sourceChatId);
    if (!sourceChat) return;

    const historyJson = JSON.stringify(sourceChat.history, null, 2);
    const contextMessage = {
      type: "bot",
      text: historyJson,
      isFollowOn: true,
    };

    const newChatId = Date.now();
    const newChat = {
      id: newChatId,
      title: `Follow-on: ${sourceChat.title}`,
      history: [contextMessage],
    };

    setChats((prev) => [...prev, newChat]);
    setActiveChatId(newChatId);
  };

  const handleRename = (id, currentTitle) => {
    setEditingId(id);
    setRenameValue(currentTitle);
    setMenuId(null);
  };

  const onRenameSubmit = (e, id) => {
    if (e) e.preventDefault();
    renameChat(id, renameValue.trim() || undefined);
    setEditingId(null);
  };

  return (
    <div className="aichat-root">
      {/* Notification Toast */}
      {notification.show && (
        <div className="aichat-notification">
          {notification.message}
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={
          isSidebarCollapsed
            ? "aichat-sidebar collapsed"
            : "aichat-sidebar"
        }
      >
        <div className="sidebar-header">
          <button
            className="newchat-btn"
            onClick={createNewChat}
          >
            <span className="newchat-icon">+</span>
            {!isSidebarCollapsed && <span>New Chat</span>}
          </button>

          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          >
            ☰
          </button>
        </div>

        <div className="sidebar-body">
          {!isSidebarCollapsed && (
            <p className="sidebar-title">Chat history</p>
          )}
          <ul className="chat-list">
            {chats.map((chat) => (
              <li
                key={chat.id}
                className={
                  "sidebar-chat-item" +
                  (chat.id === activeChatId ? " active" : "")
                }
              >
                {editingId === chat.id ? (
                  <div className="rename-wrapper">
                    <input
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={(e) => onRenameSubmit(e, chat.id)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && onRenameSubmit(e, chat.id)
                      }
                      autoFocus
                      className="rename-input"
                    />
                  </div>
                ) : (
                  <>
                    <button
                      className="chat-select-btn"
                      onClick={() => setActiveChatId(chat.id)}
                    >
                      {!isSidebarCollapsed ? chat.title : "•"}
                    </button>

                    {!isSidebarCollapsed && (
                      <div className="chat-menu-wrapper">
                        <button
                          className="chat-menu-btn"
                          onClick={() =>
                            setMenuId(menuId === chat.id ? null : chat.id)
                          }
                        >
                          ⋮
                        </button>

                        {menuId === chat.id && (
                          <div className="chat-menu" ref={menuRef}>
                            <button
                              className="chat-menu-item"
                              onClick={() => createFollowOnChat(chat.id)}
                            >
                              🔗 Follow-on
                            </button>
                            <button
                              className="chat-menu-item"
                              onClick={() => handleRename(chat.id, chat.title)}
                            >
                              ✏️ Rename
                            </button>
                            <div className="chat-menu-divider" />
                            <button
                              className="chat-menu-item danger"
                              onClick={() => {
                                deleteChat(chat.id);
                                setMenuId(null);
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="aichat-main">
        <div className="aichat-chat-window">
          {isChatEmpty ? (
            <div className="chat-empty">
              <Watermark />
              <PromptSuggestions />
            </div>
          ) : (
            activeChat &&
            activeChat.history.map((chat, idx) => (
              <div
                key={idx}
                className={
                  "chat-bubble-wrapper " +
                  (chat.type === "user" ? "align-right" : "align-left")
                }
              >
                <div
                  className={
                    "chat-bubble " +
                    (chat.type === "user" ? "user" : "bot")
                  }
                >
                  {chat.isFollowOn ? (
                    <details className="context-details">
                      <summary className="context-summary">
                        📚 Context from previous chat (click to view)
                      </summary>
                      <pre className="context-body">
                        {chat.text}
                      </pre>
                    </details>
                  ) : (
                    chat.text
                  )}
                </div>
                {chat.text && !chat.isFollowOn && (
                  <BubbleActions
                    messageText={chat.text}
                    showNotification={showNotification}
                  />
                )}
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        {activeChat && (
          <div className="aichat-input-bar">
            {isLoading && <Loader />}
            <div className="aichat-input-inner">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask anything about your studies..."
                disabled={isLoading}
                className="aichat-input"
              />
              <button
                className={
                  "aichat-send-btn" +
                  (isLoading || !message.trim() ? " disabled" : "")
                }
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
              >
                <span>Send</span>
                <span>↗</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Aichatbot;
