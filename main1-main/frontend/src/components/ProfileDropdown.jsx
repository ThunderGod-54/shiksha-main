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

  // IMPORTANT: tell all pages theme changed
  window.dispatchEvent(new Event("theme-changed"));

  setShow(false);
};


  const signOut = () => {
    apiService.logout();
    navigate("/");
  };

  return (
    <div className="profile-wrapper">
      {user?.profile_photo && (
        <img
          src={user.profile_photo}
          alt="profile"
          className="profile-avatar"
        />
      )}

      <button className="profile-btn" onClick={() => setShow((p) => !p)}>
        👤
      </button>

      {show && (
        <div className="profile-dropdown">
          {/* Edit */}
          <div className="profile-item" onClick={() => { navigate("/profile"); setShow(false); }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Edit Profile
          </div>

          <div className="profile-divider"></div>

          {/* Theme */}
          <div className="profile-item" onClick={toggleTheme}>
            {theme === "light" ? (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
                </svg>
                Light Mode
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 12.79A9 9 0 0 1 11.21 3C11 3 11 3 11 3a9 9 0 1 0 9.79 9.79c.21-.33-.23-.78-.78-.78Z" />
                </svg>
                Dark Mode
              </>
            )}
          </div>

          <div className="profile-divider"></div>

          {/* Logout */}
          <div className="profile-item" onClick={signOut}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Sign Out
          </div>

        </div>
      )}
    </div>
  );
}
