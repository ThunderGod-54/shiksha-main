import { NavLink, Link } from 'react-router-dom';
import ProfileDropdown from './ProfileDropdown';
import "./navbar.css";

const Navbar = () => {
  return (
    <nav className="nav">
      <Link to="/about" className="logo">
        SHIKSHA PLUS
      </Link>

      <div className="nav-links">
        {[
          { path: "/dashboard", label: "Dashboard" },
          { path: "/courses", label: "Courses" },
          { path: "/focus", label: "Focus" },
          { path: "/todolist", label: "Productivity Tools" },
          { path: "/aichatbot", label: "AI Tools" }
        ].map((link) => (
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
    </nav>
  );
};

export default Navbar;
