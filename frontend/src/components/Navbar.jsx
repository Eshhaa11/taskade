import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, CheckSquare } from 'lucide-react';
import '../styles/Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate(); // 🔑 Used for navigation

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-content">
          {/* Logo */}
          <div className="navbar-logo">
            <div className="logo-icon">
              <CheckSquare className="logo-icon-svg" />
            </div>
            <span className="logo-text">
              Taskade
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            <a href="#features" className="navbar-link">Features</a>
            <a href="#pricing" className="navbar-link">Pricing</a>
            <a href="#about" className="navbar-link">About</a>
            <a href="#contact" className="navbar-link">Contact</a>
          </div>

          {/* CTA Buttons */}
          <div className="navbar-cta">
            <button
              className="navbar-signin"
              onClick={() => navigate('/login')} // ✅ GO TO LOGIN
            >
              Login
            </button>
            <button
              className="navbar-cta-button"
              onClick={() => navigate('/signup')} // ✅ GO TO SIGNUP
            >
              Signup
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="navbar-mobile-toggle">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="mobile-toggle-btn"
            >
              {isMenuOpen ? <X className="mobile-icon" /> : <Menu className="mobile-icon" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="navbar-mobile-menu">
            <div className="mobile-menu-content">
              <a href="#features" className="mobile-menu-link">Features</a>
              <a href="#pricing" className="mobile-menu-link">Pricing</a>
              <a href="#about" className="mobile-menu-link">About</a>
              <a href="#contact" className="mobile-menu-link">Contact</a>
              <hr className="mobile-menu-divider" />
              <button
                className="mobile-menu-signin"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/login'); // ✅ Login page
                }}
              >
                Login
              </button>
              <button
                className="mobile-menu-cta"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigate('/signup'); // ✅ Signup page
                }}
              >
                Signup
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
