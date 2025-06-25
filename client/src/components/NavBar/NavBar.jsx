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
      <Link to="/wine" onClick={() => setIsMenuOpen(false)}>{captions.headerProducts}</Link>
      <Link to="/order" onClick={() => setIsMenuOpen(false)}>Order</Link>
      <Link to="/about" onClick={() => setIsMenuOpen(false)}>{captions.headerAbout}</Link>
    </>
  );

  const renderAuthButtons = () => (
    <div className="auth-buttons">
      <LanguageSelector />
      {user ? (
        <>
          <div className="user-initial">{user?.name?.charAt(0).toUpperCase() || "?"}</div>
          <button onClick={logout}>{captions.logOut}</button>
        </>
      ) : (
        <>
          <button onClick={() => openModal("login")}>{captions.logIn}</button>
          <button onClick={() => openModal("signup")}>{captions.signUp}</button>
        </>
      )}
    </div>
  );

  return (
    <nav className="App-nav">
      <BrowserView>
        <div className={`menu ${isMenuOpen ? "open" : ""}`}>
          {renderLinks()}
          {renderAuthButtons()}
        </div>
      </BrowserView>

      <MobileView>
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
