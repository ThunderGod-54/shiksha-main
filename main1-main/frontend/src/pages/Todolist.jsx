import { useState, useEffect, useRef } from "react";

// Updated styles with proper layout and music player fixes
const productivityStyles = `
/* Reusing todo list styles and adding new ones */
:root {
  /* Define some default variables if not provided externally */
  --dash-bg: #f4f7f9;
  --card-bg: #ffffff;
  --blue-primary: #4f72ff; 
  --green-primary: #1dcc70;
  --red-primary: #ef4444;
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --input-border: #e5e7eb;
  --border-color: #e5e7eb;
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 1, 0, 0.06);
  --todo-bg: #f9fafb;
  --todo-border: #f3f4f6;
  --font-primary: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  --timer-bg: #e5e7eb;
  --purple-primary: #8b5cf6;
  --yellow-primary: #f59e0b;
}
/* ---------- DARK THEME ---------- */
[data-theme="dark"] {
  --dash-bg: #0d1117;
  --card-bg: #161b22;

  --text-primary: #e6edf3;
  --text-secondary: #9ba3af;

  --input-border: #30363d;
  --border-color: #30363d;

  --todo-bg: #0f172a;
  --todo-border: #30363d;

  --timer-bg: #1f2937;

  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.6);
  --shadow-md: 0 6px 15px rgba(0, 0, 0, 0.5);
  --shadow-sm: 0 3px 8px rgba(0, 0, 0, 0.4);
}

.todo-page {
  min-height: 100vh;
  background: var(--dash-bg);
  padding: 6rem 1.25rem 3rem;
  font-family: var(--font-primary);
  display: flex;
  flex-direction: column; 
  align-items: center; 
}

.todo-header {
  background: linear-gradient(135deg, var(--blue-primary) 0%, #00f2fe 100%);
  padding: 2.75rem;
  border-radius: 1rem; 
  margin-bottom: 1.8rem;
  color: white;
  box-shadow: 0 12px 30px rgba(79, 172, 254, 0.25);
  width: 100%; 
  max-width: 1200px; 
  align-self: center; 
}

.todo-header h1 {
  font-size: 2rem;
  margin-bottom: 4px;
  font-weight: 700;
}

.todo-header p {
  opacity: 0.9;
  font-size: 0.95rem;
  color:white;
}

/* --- RESTRUCTURED GRID LAYOUT --- */
.productivity-wrapper {
  width: 100%;
  max-width: 1200px;
  display: grid;
  grid-template-columns: minmax(300px, 1fr) minmax(300px, 1fr);
  grid-template-rows: auto auto auto;
  gap: 20px;
}

.todo-wrapper {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
}

.notes-wrapper {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
}

.timer-wrapper {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
}

.drawing-wrapper {
    grid-column: 2 / 3;
    grid-row: 2 / 3;
}

.music-wrapper {
    grid-column: 1 / 3;
    grid-row: 3 / 4;
    max-width: 100%;
    margin: 10px auto 0;
}

/* --- Media Query for Stacking on Small Screens --- */
@media(max-width: 768px) {
  .productivity-wrapper {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
  .todo-wrapper, .notes-wrapper, .timer-wrapper, .drawing-wrapper, .music-wrapper {
    grid-column: 1 / 2;
    grid-row: auto;
    max-width: 100%;
    margin: 0 auto;
  }
  
  .music-wrapper {
    margin-top: 10px;
  }
}

/* --- General Card & Input Styles --- */
.todo-card, .notes-card, .timer-card, .drawing-card, .music-card {
  background: var(--card-bg);
  padding: 1.9rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  width: 100%; 
  box-sizing: border-box;
}

.music-card {
  margin-top: 10px;
}

.todo-input, .notes-textarea {
  flex: 1;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  border: 2px solid var(--input-border);
  background: var(--card-bg);
  outline: none;
  font-size: 0.95rem;
  color: var(--text-primary);
  transition: 0.2s;
  width: 100%;
  box-sizing: border-box; 
}
.todo-input:focus, .notes-textarea:focus {
  border-color: var(--blue-primary);
}
.todo-add-btn {
  padding: 0.85rem 1.4rem;
  border-radius: 10px;
  border: none;
  font-weight: 600;
  font-size: 0.95rem;
  background: linear-gradient(135deg, var(--blue-primary) 0%, #00f2fe 100%);
  color: white;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(79,172,254,0.35);
  transition: 0.25s;
}

/* --- IMPROVED TODO ITEM STYLES --- */
.todo-item {
  background: var(--todo-bg);
  border: 1px solid var(--todo-border);
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-sm);
}

.todo-item:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-1px);
}

.todo-item.editing {
  border-color: var(--blue-primary);
  background: rgba(79, 114, 255, 0.05);
}

.todo-text {
  flex: 1;
  color: var(--text-primary);
  font-size: 0.95rem;
  line-height: 1.4;
  word-break: break-word;
  padding-right: 1rem;
}

.todo-completed {
  text-decoration: line-through;
  color: var(--text-secondary);
  opacity: 0.7;
}

/* Todo Item Buttons Container */
.todo-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

/* Action Buttons */
.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
}

.btn-icon:hover {
  transform: scale(1.1);
}

.btn-edit {
  color: #000000;
  background: rgba(79, 114, 255, 0.1);
}

.btn-edit:hover {
  background: rgba(79, 114, 255, 0.2);
}

.btn-finish {
  color: #000000;
  background: rgba(29, 204, 112, 0.1);
}

.btn-finish:hover {
  background: rgba(29, 204, 112, 0.2);
}

.btn-delete {
  color: #000000;
  background: rgba(239, 68, 68, 0.1);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.btn-save {
  color: white;
  background: linear-gradient(135deg, var(--blue-primary) 0%, #00f2fe 100%);
}

.btn-cancel {
  color: var(--text-secondary);
  background: var(--todo-border);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  font-style: italic;
  background: var(--todo-bg);
  border-radius: 12px;
  border: 1px dashed var(--border-color);
}

/* --- Timer Visual Styles --- */
.timer-visual-container {
    position: relative;
    width: 200px;
    height: 200px;
    margin: 0 auto 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: var(--timer-bg);
}
.timer-progress-circle {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    transform: rotate(-90deg);
}
.timer-display-inner {
    z-index: 10;
    background: var(--card-bg); 
    width: calc(100% - 20px); 
    height: calc(100% - 20px);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
.timer-display {
  font-size: 2.2rem; 
  font-weight: 700;
  color: var(--text-primary);
}

/* Timer Recommendations */
.timer-recommendations {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 15px;
}

.recommendation-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
}

.time-preset-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--todo-bg);
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.85rem;
}

.time-preset-btn:hover {
  background: var(--blue-primary);
  color: white;
  border-color: var(--blue-primary);
}

.time-preset-btn.active {
  background: var(--blue-primary);
  color: white;
  border-color: var(--blue-primary);
}

/* Custom Time Input */
.custom-time-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: center;
  margin-top: 15px;
  flex-wrap: wrap;
}

.time-input-group {
  display: flex;
  align-items: center;
  gap: 5px;
}

.time-input-group input {
  width: 60px;
  text-align: center;
  padding: 0.5rem;
}

/* --- Music Player Styles --- */
.music-player {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.music-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.music-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin: 15px 0;
}

.music-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  background: var(--blue-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(79, 114, 255, 0.3);
}

.music-btn:hover {
  transform: scale(1.1);
  background: #3a5fef;
  box-shadow: 0 6px 20px rgba(79, 114, 255, 0.4);
}

.music-btn-large {
  width: 70px;
  height: 70px;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  max-width: 200px;
  margin: 0 auto;
}

.volume-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: var(--border-color);
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--blue-primary);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.music-info {
  text-align: center;
  margin: 10px 0 20px;
}

.music-title {
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 5px;
  font-size: 1.2rem;
}

.music-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* --- Drawing Pad Specific Styles --- */
.drawing-card {
    padding: 1.2rem;
    position: relative;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.canvas-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    flex-wrap: wrap;
    gap: 10px;
}
.canvas-text-input {
    position: absolute;
    padding: 8px 12px;
    background: white;
    border: 2px solid var(--blue-primary);
    border-radius: 6px;
    z-index: 20;
    outline: none;
    font-size: 14px;
    line-height: 1.2;
    min-width: 180px;
    box-shadow: var(--shadow-md);
}
.color-controls {
    display: flex;
    gap: 8px;
    align-items: center;
}
.color-picker {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    cursor: pointer;
    border: 3px solid #ccc;
    transition: transform 0.2s;
}

.color-picker.active {
    border-color: var(--text-primary);
    transform: scale(1.1);
}

.color-picker:hover {
    transform: scale(1.15);
}

/* Canvas Container */
.canvas-container {
    position: relative;
    width: 100%;
    flex: 1;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    background: white;
  min-height: 300px;
}

/* --- Utility/Reused Styles --- */
.header-icon {
    margin-right: 8px;
    height: 1.25em; 
    width: 1.25em;
    vertical-align: middle;
}
.btn {
  padding: 0.45rem 0.9rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.8rem;
  cursor: pointer;
  transition: 0.25s;
}
.btn-blue {
  background: linear-gradient(135deg, var(--blue-primary) 0%, #00f2fe 100%);
  color: white;
}
.btn-gray {
  background: var(--todo-border);
  color: var(--text-primary);
}
.btn-green {
  background: var(--green-primary);
  color: white;
}
.clear-btn {
    padding: 0.5rem 1rem;
    background-color: var(--red-primary);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    transition: opacity 0.2s;
}

.clear-btn:hover {
    opacity: 0.9;
}

.timer-controls {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    flex-wrap: wrap;
}

.timer-input {
    width: 60px;
    text-align: center;
    margin: 0 5px;
}

/* Drawing Tools */
.tool-selector {
    display: flex;
    gap: 5px;
    align-items: center;
}

/* Thin Line Indicator */
.line-thickness-indicator {
    height: 2px;
    width: 20px;
    background: currentColor;
    margin-left: 5px;
}

/* Music Icon */
.music-icon {
    color: var(--purple-primary);
}

/* Track Selector */
.track-selector {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.track-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 20px;
  background: var(--todo-border);
  color: var(--text-primary);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.track-btn.active {
  background: var(--blue-primary);
  color: white;
}

.track-btn:hover {
  transform: translateY(-2px);
}

/* YouTube Embed Container */
.youtube-embed {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
  height: 0;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid var(--border-color);
}

.youtube-embed iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
}
`;

// --- SVG Icons (Added new ones) ---
const IconTaskBoard = ({ color = "currentColor", size = "20" }) => (
  <svg className="header-icon" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="8" y1="7" x2="16" y2="7"></line>
    <line x1="8" y1="11" x2="16" y2="11"></line>
    <line x1="8" y1="15" x2="12" y2="15"></line>
    <polyline points="15 14 17 16 21 12" stroke={color} fill="none" strokeWidth="2.5"></polyline>
  </svg>
);

const IconNotes = ({ color = "currentColor", size = "20" }) => (
  <svg className="header-icon" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
);

const IconClock = ({ color = "currentColor", size = "20" }) => (
  <svg className="header-icon" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const IconDrawing = ({ color = "currentColor", size = "20" }) => (
  <svg className="header-icon" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 19V6L5 2l2 4 10 10 3-3-5-5-2-2z"></path>
  </svg>
);

const IconMusic = ({ color = "currentColor", size = "20" }) => (
  <svg className="header-icon music-icon" xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13"></path>
    <circle cx="6" cy="18" r="3"></circle>
    <circle cx="18" cy="16" r="3"></circle>
  </svg>
);

// LARGER BLUE ICONS for Music Player
const IconPlay = ({ color = "white", size = "28" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

const IconPause = ({ color = "white", size = "28" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="6" y="4" width="4" height="16"></rect>
    <rect x="14" y="4" width="4" height="16"></rect>
  </svg>
);

const IconPrev = ({ color = "white", size = "24" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="19 20 9 12 19 4 19 20"></polygon>
    <line x1="5" y1="19" x2="5" y2="5"></line>
  </svg>
);

const IconNext = ({ color = "white", size = "24" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 4 15 12 5 20 5 4"></polygon>
    <line x1="19" y1="5" x2="19" y2="19"></line>
  </svg>
);

const IconVolume = ({ color = "currentColor", size = "20" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

// New Icons for Todo Actions (BLACK)
const IconEdit = ({ color = "#000000", size = "16" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

const IconCheck = ({ color = "#000000", size = "16" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const IconTrash = ({ color = "#000000", size = "16" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const IconSave = ({ color = "white", size = "16" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const IconX = ({ color = "#000000", size = "16" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// Component 1: Todo List (With BLACK SVG icons)
const TodoList = ({ todos, setTodos }) => {
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, completed: false }]);
      setInput("");
    }
  };

  const startEdit = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = (id) => {
    if (editText.trim()) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, text: editText } : todo
        )
      );
      setEditingId(null);
      setEditText("");
    }
  };

  const finishTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: true } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-wrapper">
      <h2 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
        <IconTaskBoard color="var(--blue-primary)" size="24" />
        Todo List
      </h2>
      <div className="todo-card">
        <div style={{ display: "flex", gap: "10px", marginBottom: "1.5rem" }}>
          <input
            type="text"
            className="todo-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Add a new task..."
          />
          <button className="todo-add-btn" onClick={addTodo}>
            + Add
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {todos.length === 0 && (
            <div className="empty-state">
              No tasks yet. Add one to get started!
            </div>
          )}
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`todo-item ${editingId === todo.id ? 'editing' : ''}`}
            >
              {editingId === todo.id ? (
                <>
                  <input
                    type="text"
                    className="todo-input"
                    style={{ flex: 1, marginRight: '10px' }}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                    autoFocus
                  />
                  <button
                    className="btn-icon btn-save"
                    onClick={() => saveEdit(todo.id)}
                    title="Save"
                  >
                    <IconSave color="white" size="16" />
                  </button>
                  <button
                    className="btn-icon btn-cancel"
                    onClick={() => setEditingId(null)}
                    title="Cancel"
                  >
                    <IconX color="#000000" size="16" />
                  </button>
                </>
              ) : (
                <>
                  <span
                    className={`todo-text ${todo.completed ? "todo-completed" : ""}`}
                  >
                    {todo.text}
                  </span>
                  <div className="todo-actions">
                    {!todo.completed ? (
                      <>
                        <button
                          className="btn-icon btn-edit"
                          onClick={() => startEdit(todo)}
                          title="Edit"
                        >
                          <IconEdit color="#000000" size="16" />
                        </button>
                        <button
                          className="btn-icon btn-finish"
                          onClick={() => finishTodo(todo.id)}
                          title="Mark as Complete"
                        >
                          <IconCheck color="#000000" size="16" />
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn-icon btn-delete"
                        onClick={() => deleteTodo(todo.id)}
                        title="Delete"
                      >
                        <IconTrash color="#000000" size="16" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Component 2: Simple Notes/Memo Pad
const MemoPad = ({ notes, setNotes }) => {
  return (
    <div className="notes-wrapper">
      <h2 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
        <IconNotes color="var(--blue-primary)" size="24" />
        Quick Notes
      </h2>
      <div className="notes-card">
        <textarea
          className="notes-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Jot down quick thoughts, ideas, or temporary memos here..."
          style={{ height: '200px', resize: 'vertical' }}
        />
      </div>
    </div>
  );
};

// Component 3: Countdown Timer with Recommendations
const CountdownTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [initialTotalSeconds, setInitialTotalSeconds] = useState(25 * 60);
  const [customMinutes, setCustomMinutes] = useState(25);
  const [customSeconds, setCustomSeconds] = useState(0);
  const [activePreset, setActivePreset] = useState('pomodoro');

  const timePresets = [
    { name: 'Pomodoro', minutes: 25, seconds: 0, key: 'pomodoro' },
    { name: 'Short Break', minutes: 5, seconds: 0, key: 'short' },
    { name: 'Long Break', minutes: 15, seconds: 0, key: 'long' },
    { name: 'Quick Focus', minutes: 10, seconds: 0, key: 'quick' },
    { name: 'Deep Work', minutes: 50, seconds: 0, key: 'deep' },
    { name: 'Ultra Sprint', minutes: 1, seconds: 0, key: 'sprint' },
  ];

  const currentTotalSeconds = minutes * 60 + seconds;
  const displayTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const percentage =
    initialTotalSeconds > 0
      ? (currentTotalSeconds / initialTotalSeconds) * 100
      : 100;

  const angle = percentage * 3.6;

  const progressStyle = {
    background: `conic-gradient(
      var(--blue-primary) ${angle}deg, 
      var(--timer-bg) ${angle}deg
    )`,
    transition: isRunning ? 'none' : 'background 0.3s ease-in-out',
  };

  useEffect(() => {
    let interval = null;

    if (isRunning && currentTotalSeconds > 0) {
      interval = setInterval(() => {
        const newTotalSeconds = currentTotalSeconds - 1;
        setMinutes(Math.floor(newTotalSeconds / 60));
        setSeconds(newTotalSeconds % 60);
      }, 1000);
    } else if (currentTotalSeconds === 0) {
      setIsRunning(false);
      if (window.Notification && Notification.permission === 'granted') {
        new Notification('Time is up! ⏰', {
          body: 'Your timer has finished.',
        });
      }
      setMinutes(Math.floor(initialTotalSeconds / 60));
      setSeconds(initialTotalSeconds % 60);
    } else if (!isRunning) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isRunning, currentTotalSeconds, initialTotalSeconds]);

  const startTimer = () => {
    if (currentTotalSeconds > 0) {
      if (!isRunning) {
        setInitialTotalSeconds(currentTotalSeconds);
      }
      setIsRunning(true);
    }
  };

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setMinutes(Math.floor(initialTotalSeconds / 60));
    setSeconds(initialTotalSeconds % 60);
  };

  const setPreset = (preset) => {
    setIsRunning(false);
    setActivePreset(preset.key);
    const newTotal = preset.minutes * 60 + preset.seconds;
    setMinutes(preset.minutes);
    setSeconds(preset.seconds);
    setInitialTotalSeconds(newTotal);
  };

  const setCustomTime = () => {
    if (customMinutes >= 0 && customSeconds >= 0 && customSeconds < 60) {
      setIsRunning(false);
      setActivePreset('custom');
      const newTotal = customMinutes * 60 + customSeconds;
      setMinutes(customMinutes);
      setSeconds(customSeconds);
      setInitialTotalSeconds(newTotal);
    }
  };

  const handleMinChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 99) {
      setCustomMinutes(value);
    }
  };

  const handleSecChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value < 60) {
      setCustomSeconds(value);
    }
  };

  return (
    <div className="timer-wrapper">
      <h2 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
        <IconClock color="var(--blue-primary)" size="24" />
        Countdown Timer
      </h2>
      <div className="timer-card">
        {/* Clock Visual */}
        <div className="timer-visual-container">
          <div className="timer-progress-circle" style={progressStyle}></div>
          <div className="timer-display-inner">
            <div className="timer-display">{displayTime}</div>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {isRunning ? 'FOCUS' : 'READY'}
            </span>
          </div>
        </div>

        {/* Timer Recommendations */}
        <div className="timer-recommendations">
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>
            Recommended Focus Sessions:
          </div>
          <div className="recommendation-buttons">
            {timePresets.map((preset) => (
              <button
                key={preset.key}
                className={`time-preset-btn ${activePreset === preset.key ? 'active' : ''}`}
                onClick={() => setPreset(preset)}
                disabled={isRunning}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Time Input */}
        <div className="custom-time-inputs">
          <div className="time-input-group">
            <input
              type="number"
              className="todo-input timer-input"
              value={customMinutes}
              onChange={handleMinChange}
              min="0"
              max="99"
              disabled={isRunning}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Min</span>
          </div>
          <div className="time-input-group">
            <input
              type="number"
              className="todo-input timer-input"
              value={customSeconds}
              onChange={handleSecChange}
              min="0"
              max="59"
              disabled={isRunning}
            />
            <span style={{ color: 'var(--text-secondary)' }}>Sec</span>
          </div>
          <button
            className="btn btn-blue"
            onClick={setCustomTime}
            disabled={isRunning}
          >
            Set Custom
          </button>
        </div>

        {/* Timer Controls */}
        <div className="timer-controls">
          {isRunning ? (
            <button className="btn btn-gray" onClick={pauseTimer}>
              Pause
            </button>
          ) : (
            <button className="btn btn-green" onClick={startTimer} disabled={currentTotalSeconds === 0}>
              Start
            </button>
          )}
          <button className="btn btn-delete" onClick={resetTimer}>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

// Component 4: Music Player for Study - FIXED WITH YOUTUBE API
const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [player, setPlayer] = useState(null);
  const iframeRef = useRef(null);

  // Your YouTube videos
  const studyTracks = [
    {
      id: 1,
      title: "Lofi Study Beats",
      url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
      videoId: "jfKfPfyJRdk",
      description: "Chill lofi music for focus and concentration"
    },
    {
      id: 2,
      title: "Classical Study",
      url: "https://youtu.be/mdJU5ogrPMY?si=4cM7NiA9ouAC9tZ4",
      videoId: "mdJU5ogrPMY",
      description: "Classical music for deep concentration"
    },
    {
      id: 3,
      title: "Nature Sounds",
      url: "https://youtu.be/NvftPSb5Xtw?si=zmATrcF1lu2t8J79",
      videoId: "NvftPSb5Xtw",
      description: "Rain and thunder for peaceful studying"
    },
    {
      id: 4,
      title: "Alpha Waves",
      url: "https://youtu.be/lkkGlVWvkLk?si=16kumWVwYPIJVgX1g",
      videoId: "lkkGlVWvkLk",
      description: "Brain waves for enhanced focus"
    }
  ];

  // Load YouTube IFrame API
  useEffect(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      return;
    }

    // Load the YouTube IFrame API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = initializePlayer;
  }, []);

  // Initialize YouTube Player
  const initializePlayer = () => {
    if (!window.YT || !window.YT.Player) return;

    const newPlayer = new window.YT.Player('youtube-player', {
      height: '360',
      width: '640',
      videoId: studyTracks[currentTrack].videoId,
      playerVars: {
        'autoplay': 0,
        'controls': 0,
        'modestbranding': 1,
        'rel': 0,
        'showinfo': 0,
        'playsinline': 1
      },
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange,
        'onError': onPlayerError
      }
    });

    setPlayer(newPlayer);
  };

  // When player is ready
  const onPlayerReady = (event) => {
    event.target.setVolume(volume);
    console.log('YouTube Player Ready');
  };

  // Track player state changes
  const onPlayerStateChange = (event) => {
    // YouTube player states:
    // -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
    }
  };

  const onPlayerError = (event) => {
    console.error('YouTube Player Error:', event.data);
    // Fallback: Open video in new tab
    window.open(studyTracks[currentTrack].url, '_blank');
  };

  // Player controls
  const togglePlay = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (player) {
      player.setVolume(newVolume);
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrack + 1) % studyTracks.length;
    changeTrack(nextIndex);
  };

  const prevTrack = () => {
    const prevIndex = (currentTrack - 1 + studyTracks.length) % studyTracks.length;
    changeTrack(prevIndex);
  };

  const changeTrack = (index) => {
    if (player) {
      // Stop current video
      player.stopVideo();
      setIsPlaying(false);

      // Load new video
      player.loadVideoById(studyTracks[index].videoId);
      setCurrentTrack(index);
    } else {
      // Fallback if player not ready
      setCurrentTrack(index);
      if (iframeRef.current) {
        iframeRef.current.src = `https://www.youtube.com/embed/${studyTracks[index].videoId}?autoplay=0&controls=1&modestbranding=1&rel=0`;
      }
    }
  };

  const selectTrack = (index) => {
    changeTrack(index);
  };

  return (
    <div className="music-wrapper">
      <h2 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
        <IconMusic color="var(--purple-primary)" size="24" />
        Study Music Player
      </h2>
      <div className="music-card">
        <div className="music-player">
          <div className="music-info">
            <div className="music-title">{studyTracks[currentTrack].title}</div>
            <div className="music-desc">{studyTracks[currentTrack].description}</div>
            <div style={{
              fontSize: '0.85rem',
              color: isPlaying ? 'var(--green-primary)' : 'var(--text-secondary)',
              marginTop: '5px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              {isPlaying ? '▶️ Now Playing' : '⏸️ Paused'}
              <span style={{
                fontSize: '0.75rem',
                background: 'var(--todo-border)',
                padding: '2px 8px',
                borderRadius: '10px'
              }}>
                Track {currentTrack + 1}/{studyTracks.length}
              </span>
            </div>
          </div>

          {/* YouTube Player Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '56.25%', // 16:9 aspect ratio
            height: 0,
            marginBottom: '20px',
            borderRadius: '12px',
            overflow: 'hidden',
            backgroundColor: '#000'
          }}>
            <div
              id="youtube-player"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
            ></div>

            {/* Fallback iframe for mobile/backup */}
            <iframe
              ref={iframeRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: 'none' // Hidden by default, shown as fallback
              }}
              src={`https://www.youtube.com/embed/${studyTracks[currentTrack].videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0&showinfo=0`}
              title="Study Music"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Music Controls */}
          <div className="music-controls">
            <button
              className="music-btn"
              onClick={prevTrack}
              title="Previous Track"
            >
              <IconPrev color="white" size="24" />
            </button>

            <button
              className="music-btn music-btn-large"
              onClick={togglePlay}
              title={isPlaying ? "Pause" : "Play"}
              disabled={!player}
            >
              {isPlaying ?
                <IconPause color="white" size="28" /> :
                <IconPlay color="white" size="28" />
              }
            </button>

            <button
              className="music-btn"
              onClick={nextTrack}
              title="Next Track"
            >
              <IconNext color="white" size="24" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="volume-control">
            <IconVolume color="var(--text-secondary)" size="20" />
            <input
              type="range"
              className="volume-slider"
              min="0"
              max="100"
              step="1"
              value={volume}
              onChange={handleVolumeChange}
            />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', minWidth: '40px' }}>
              {volume}%
            </span>
          </div>

          {/* Track Selector */}
          <div className="track-selector">
            {studyTracks.map((track, index) => (
              <button
                key={track.id}
                className={`track-btn ${currentTrack === index ? 'active' : ''}`}
                onClick={() => selectTrack(index)}
              >
                {track.title}
              </button>
            ))}
          </div>

          {/* Player Status */}
          <div style={{
            marginTop: '15px',
            padding: '10px',
            background: 'rgba(79, 114, 255, 0.05)',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {!player && (
                <>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'var(--orange-primary)',
                    borderRadius: '50%',
                    animation: 'pulse 1.5s infinite'
                  }}></div>
                  Loading YouTube Player...
                </>
              )}
              {player && (
                <>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'var(--green-primary)',
                    borderRadius: '50%'
                  }}></div>
                  Player Ready • Click Play to start
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add CSS animation for loading indicator */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 1; }
            100% { opacity: 0.6; }
          }
        `}
      </style>
    </div>
  );
};
// Component 5: Simple Drawing Pad
const SimpleDrawingPad = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [mode, setMode] = useState('draw');
  const [color, setColor] = useState('#4f72ff');
  const [lineThickness, setLineThickness] = useState(3);

  const [textInput, setTextInput] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: '',
  });

  const colors = ['#4f72ff', '#1dcc70', '#ef4444', '#ff9900', '#1f2937', '#9c27b0'];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set initial drawing properties
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = lineThickness;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
  }, [lineThickness, color]);

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        const rect = container.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = 300;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const startDrawing = (e) => {
    if (mode !== 'draw') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    setIsDrawing(true);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const draw = (e) => {
    if (!isDrawing || mode !== 'draw') return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.beginPath();
    }
  };

  const placeText = (e) => {
    if (mode !== 'text') return;

    if (textInput.visible) {
      finalizeText();
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTextInput({
      visible: true,
      x: x,
      y: y,
      content: '',
    });
  };

  const finalizeText = () => {
    if (!textInput.content.trim()) {
      setTextInput({ ...textInput, visible: false });
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.font = `bold ${lineThickness * 4}px ${window.getComputedStyle(canvas).fontFamily || 'Arial'}`;
    ctx.fillStyle = color;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.fillText(textInput.content, textInput.x, textInput.y);

    setTextInput({ visible: false, x: 0, y: 0, content: '' });
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setTextInput({ visible: false, x: 0, y: 0, content: '' });
  };

  const handleTextInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finalizeText();
    } else if (e.key === 'Escape') {
      setTextInput({ ...textInput, visible: false });
    }
  };

  return (
    <div className="drawing-wrapper">
      <h2 style={{ color: "var(--text-primary)", marginBottom: "1rem" }}>
        <IconDrawing color="var(--blue-primary)" size="24" />
        Whiteboard
      </h2>
      <div className="drawing-card" ref={containerRef}>
        <div className="canvas-header">
          <div className="tool-selector">
            <button
              className={`btn ${mode === 'draw' ? 'btn-blue' : 'btn-gray'}`}
              onClick={() => { setMode('draw'); if (textInput.visible) finalizeText(); }}
              style={{ padding: '0.45rem 0.8rem' }}
            >
              Pen
            </button>
            <button
              className={`btn ${mode === 'text' ? 'btn-blue' : 'btn-gray'}`}
              onClick={() => setMode('text')}
              style={{ padding: '0.45rem 0.8rem' }}
            >
              Text
            </button>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginRight: '5px' }}>Size:</span>
              <input
                type="range"
                min="1"
                max="10"
                value={lineThickness}
                onChange={(e) => setLineThickness(parseInt(e.target.value))}
                style={{ width: '80px' }}
              />
              <div className="line-thickness-indicator" style={{ width: `${lineThickness * 2}px` }}></div>
            </div>
          </div>

          <div className="color-controls">
            {colors.map((c) => (
              <div
                key={c}
                className={`color-picker ${color === c ? 'active' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
                title={`Color: ${c}`}
              />
            ))}
          </div>

          <button className="clear-btn" onClick={clearCanvas}>
            Clear Canvas
          </button>
        </div>

        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            style={{
              display: 'block',
              cursor: mode === 'draw' ? 'crosshair' : 'text',
              touchAction: 'none',
              width: '100%',
              height: '100%'
            }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={(e) => {
              e.preventDefault();
              startDrawing(e);
            }}
            onTouchMove={(e) => {
              e.preventDefault();
              draw(e);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              stopDrawing();
            }}
            onClick={mode === 'text' ? placeText : undefined}
          />

          {/* Floating Text Input */}
          {textInput.visible && (
            <input
              type="text"
              className="canvas-text-input"
              style={{
                left: textInput.x,
                top: textInput.y,
                color: color,
                fontSize: `${lineThickness * 4}px`,
                fontWeight: 'bold'
              }}
              value={textInput.content}
              onChange={(e) => setTextInput({ ...textInput, content: e.target.value })}
              onBlur={finalizeText}
              onKeyDown={handleTextInputKeyDown}
              autoFocus
              placeholder="Type text..."
            />
          )}
        </div>

        <div style={{ marginTop: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          {mode === 'draw' ? 'Click and drag to draw' : 'Click on canvas to add text'}
        </div>
      </div>
    </div>
  );
};

// Main Wrapper Component
export default function ProductivityDashboard() {
  const [todos, setTodos] = useState([]);
  const [notes, setNotes] = useState("");

  return (
    <>
      {/* Apply all styles */}
      <style>{productivityStyles}</style>

      <div className="todo-page">
        {/* Main Header */}
        <div className="todo-header">
          <h1>Productivity Tools</h1>
          <p>Manage your tasks, notes, and focus time in one place.</p>
        </div>

        {/* --- Main Productivity Area using CSS Grid --- */}
        <div className="productivity-wrapper">
          {/* Top Left: Todo List */}
          <TodoList todos={todos} setTodos={setTodos} />

          {/* Top Right: Quick Notes */}
          <MemoPad notes={notes} setNotes={setNotes} />

          {/* Bottom Left: Countdown Timer */}
          <CountdownTimer />

          {/* Bottom Right: Whiteboard */}
          <SimpleDrawingPad />

          {/* Below Everything: Music Player */}
          <MusicPlayer />
        </div>
      </div>
    </>
  );
}