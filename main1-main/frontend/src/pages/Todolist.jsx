import { useState } from "react";

const todoStyles = `
.todo-page {
  min-height: 100vh;
  background: var(--dash-bg);
  padding: 6rem 1.25rem 3rem;
  font-family: var(--font-primary);
  display: flex;
  justify-content: center;
}

.todo-wrapper {
  width: 100%;
  max-width: 600px;
}

.todo-header {
  background: linear-gradient(135deg, var(--blue-primary) 0%, #00f2fe 100%);
  padding: 2.75rem;
  border-radius: 1rem;
  margin-bottom: 1.8rem;
  color: white;
  box-shadow: 0 12px 30px rgba(79, 172, 254, 0.25);
}

.todo-header h1 {
  font-size: 2rem;
  margin-bottom: 4px;
  font-weight: 700;
}

.todo-header p {
  opacity: 0.9;
  font-size: 0.95rem;
}

.todo-card {
  background: var(--card-bg);
  padding: 1.9rem;
  border-radius: 1rem;
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  margin-bottom: 1.4rem;
}

.todo-input {
  flex: 1;
  padding: 0.85rem 1rem;
  border-radius: 10px;
  border: 2px solid var(--input-border);
  background: var(--card-bg);
  outline: none;
  font-size: 0.95rem;
  color: var(--text-primary);
  transition: 0.2s;
}

.todo-input:focus {
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

.todo-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(79,172,254,0.45);
}

.todo-item {
  background: var(--todo-bg);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--todo-border);
  transition: 0.25s;
}

.todo-item:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
}

.todo-text {
  flex: 1;
  font-size: 0.95rem;
  color: var(--text-primary);
}

.todo-completed {
  text-decoration: line-through;
  color: var(--text-secondary);
  opacity: 0.75;
  filter: blur(0.4px);
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

.btn:hover {
  opacity: 0.85;
}

.btn-blue {
  background: linear-gradient(135deg, var(--blue-primary) 0%, #00f2fe 100%);
  color: white;
}

.btn-green {
  background: linear-gradient(135deg, #11998e 0%, var(--green-primary) 100%);
  color: white;
}

.btn-gray {
  background: var(--todo-border);
  color: var(--text-secondary);
}

.btn-delete {
  background: transparent;
  border: none;
  font-size: 1.15rem;
  padding: 0.3rem 0.5rem;
  color: var(--text-secondary);
}

.btn-delete:hover {
  background: rgba(185, 28, 28, 0.2);
  color: var(--red-primary);
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

@media(max-width: 500px) {
  .todo-header {
    padding: 2rem;
  }
}
`;

export default function TodoList() {
  const [todos, setTodos] = useState([]);
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

  const deleteTodo = (id) =>
    setTodos(todos.filter((todo) => todo.id !== id));

  return (
    <>
      <style>{todoStyles}</style>

      <div className="todo-page">
        <div className="todo-wrapper">
          
          {/* Header */}
          <div className="todo-header">
            <h1>Todo List</h1>
            <p>Stay organized, stay productive</p>
          </div>

          {/* Input */}
          <div className="todo-card">
            <div style={{ display: "flex", gap: "10px" }}>
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
          </div>

          {/* List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="todo-item"
                style={{
                  opacity: todo.completed ? 0.75 : 1,
                }}
              >
                {editingId === todo.id ? (
                  <>
                    <input
                      type="text"
                      className="todo-input"
                      style={{ borderColor: "var(--blue-primary)" }}
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(todo.id)}
                      autoFocus
                    />
                    <button className="btn btn-blue" onClick={() => saveEdit(todo.id)}>
                      Save
                    </button>
                    <button className="btn btn-gray" onClick={() => setEditingId(null)}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className={`todo-text ${todo.completed ? "todo-completed" : ""}`}
                    >
                      {todo.text}
                    </span>

                    {!todo.completed && (
                      <>
                        <button className="btn btn-blue" onClick={() => startEdit(todo)}>
                          Edit
                        </button>

                        <button className="btn btn-green" onClick={() => finishTodo(todo.id)}>
                          Finish
                        </button>
                      </>
                    )}

                    {todo.completed && (
                      <button className="btn-delete" onClick={() => deleteTodo(todo.id)}>
                        🗑️
                      </button>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Empty State */}
          {todos.length === 0 && (
            <div className="empty-state">
              No tasks yet. Add one to get started!
            </div>
          )}
        </div>
      </div>
    </>
  );
}
