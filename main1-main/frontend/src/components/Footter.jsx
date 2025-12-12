import React from "react";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="app-footer">
      <p className="brand">&copy; 2025 ShikshaPlus. All rights reserved.</p>

      <div className="footer-links">
        <a href="#">Privacy Policy</a>
        <span>•</span>
        <a href="#">Terms of Use</a>
        <span>•</span>
        <a href="#">Support</a>
      </div>
    </footer>
  );
};

export default Footer;
