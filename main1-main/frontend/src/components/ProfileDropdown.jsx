import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api";
import "./profile-dropdown.css";

export default function ProfileDropdown() {
  const [show, setShow] = useState(false);
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);

    (async () => {
      try {
        const data = await apiService.getUserProfile();
        setUser(data);
      } catch (e) {
        console.log("Failed to fetch user:", e);
      }
    })();
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    window.dispatchEvent(new Event("theme-changed"));
    setShow(false);
  };

  // Re-added the proper Sign Out logic
  const signOut = () => {
    apiService.logout(); // Clears tokens/session
    setShow(false);
    navigate("/"); // Redirect to landing/login
  };

  return (
    <div className="profile-wrapper">
      <div
        className="profile-trigger"
        onClick={() => setShow(!show)}
      >
        {user?.profile_photo && (
          <img src={user.profile_photo} alt="profile" className="profile-avatar" />
        )}
        <button className="profile-btn">👤</button>
      </div>

      {/* Backdrop for mobile & desktop click-away */}
      {show && <div className="profile-overlay" onClick={() => setShow(false)} />}

      {show && (
        <div className="profile-dropdown">
          {/* Edit Profile */}
          <div className="profile-item" onClick={() => { navigate("/profile"); setShow(false); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Edit Profile
          </div>

          <div className="profile-divider"></div>

          {/* Theme Toggle */}
          <div className="profile-item" onClick={toggleTheme}>
            {theme === "light" ? (
              <><span style={{ fontSize: '18px', marginRight: '10px' }}>🌙</span> Dark Mode</>
            ) : (
              <><span style={{ fontSize: '18px', marginRight: '10px' }}>☀️</span> Light Mode</>
            )}
          </div>

          <div className="profile-divider"></div>

          {/* Logout - Now using the signOut function */}
          <div className="profile-item logout-red" onClick={signOut}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="#ff4d4d">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span style={{ color: "#ff4d4d", fontWeight: "600" }}>Sign Out</span>
          </div>
        </div>
      )}
    </div>
  );
}