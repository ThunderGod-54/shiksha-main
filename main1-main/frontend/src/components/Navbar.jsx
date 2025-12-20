import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import "./navbar.css";

const navLinks = [
  { path: "/dashboard", label: "Dashboard" },
  { path: "/courses", label: "Courses" },
  { path: "/focus", label: "Focus" },
  { path: "/todolist", label: "Productivity Tools" },
  { path: "/aichatbot", label: "AI Tools" },
  { path: "/notes", label: "Notes" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav className="nav">
        <Link to="/about" className="logo">
          SHIKSHA PLUS
        </Link>

        {/* Desktop Links */}
        <div className="nav-links desktop-only">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              {link.label}
            </NavLink>
          ))}
          <ProfileDropdown />
        </div>

        {/* Hamburger */}
        <button
          className={`hamburger ${open ? "open" : ""}`}
          onClick={() => setOpen(!open)}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <div className={`sidebar ${open ? "show" : ""}`}>
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            {link.label}
          </NavLink>
        ))}

        <div className="sidebar-profile">
          <ProfileDropdown />
        </div>
      </div>

      {/* Overlay */}
      {open && <div className="backdrop" onClick={() => setOpen(false)} />}
    </>
  );
};

export default Navbar;