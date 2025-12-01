// src/components/NavBar/NavBar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import "./NavBar.css";

function NavBar({ user, logout, openModal, captions }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const renderLinks = () => (
    <>
      <Link to="/" onClick={() => setIsMenuOpen(false)}>{captions.headerHome}</Link>
      <div className="divider" />
      <Link to="/wine" onClick={() => setIsMenuOpen(false)}>{captions.headerProducts}</Link>
      <div className="divider" />
      <Link to="/about" onClick={() => setIsMenuOpen(false)}>{captions.headerAbout}</Link>
      <div className="divider" />
      <Link to="/contact" onClick={() => setIsMenuOpen(false)}>{captions.headerContact}</Link>
    </>
  );

  const renderAuthButtons = () => (
    <div className="auth-buttons">
      {user ? (
        <>
          <button className="logout" onClick={logout}></button>
        </>
      ) : (
        <>
          <button className="login" onClick={() => openModal("login")}></button>
          <button className="signup" onClick={() => openModal("signup")}></button>
        </>
      )}
      <LanguageSelector />
    </div>
  );

  return (
    <nav className="App-nav">
      <BrowserView className="header-container">
        <div className="title">
          <div className="header-logo"></div>
          <div className="home-title">DOOD'S WINE</div>
        </div>
        <div className={`menu ${isMenuOpen ? "open" : ""}`}>
          {renderLinks()}
          {renderAuthButtons()}
        </div>
      </BrowserView>

      <MobileView className="header-container">
        <div className="title">
          <div className="header-logo"></div>
          <div className="home-title">DOOD'S WINE</div>
        </div>
        {renderAuthButtons()}
        <div ref={menuRef}>
          <div className={`hamburger ${isMenuOpen ? "open" : ""}`} onClick={() => setIsMenuOpen(prev => !prev)}>
            <div className="bar" /><div className="bar" /><div className="bar" />
          </div>
          {isMenuOpen && <div className="mobile-menu">{renderLinks()}</div>}
        </div>
      </MobileView>
    </nav>
  );
}

export default NavBar;
