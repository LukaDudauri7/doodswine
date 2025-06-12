import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";
import Home from "./components/Home/Home";
import Wine from "./components/Wine/Wine";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
import AuthModal from "./components/AuthModal/AuthModal";
import LanguageSelector from "./components/LanguageSelector/LanguageSelector";
import captions from './captions.json';
import { useLanguage } from './languageContext';
import "./fonts.css";
import Loader from "./components/Loader/Loader";
import OrderPage from "./components/OrderPage/OrderPage";

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [user, setUser] = useState(null);
  
  const { language } = useLanguage();
  const content = captions[language].header;

  const location = useLocation();
  useEffect(() => {
    const saveUser = JSON.parse(localStorage.getItem("user"));
    if (saveUser) {
      setUser(saveUser);
    }
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu(); // დახურე თუ გარეთ დააწკაპუნა
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  console.log(user)
  const renderAuthButtons = () => (
      <div className="auth-buttons">
        <LanguageSelector />
        {user ? (
        <>
          <div className="user-initial">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <button className="logout-btn" onClick={logout}>
            {content.logOut}
          </button>
        </>
        ) : (
          <>
            <button className="login-btn" onClick={() => openModal("login")}>
              {content.logIn}
            </button>
            <button className="signup-btn" onClick={() => openModal("signup")}>
              {content.signUp}
            </button>
          </>
        )}
    </div>
  );

  const renderMenuLinks = () => (
    <>
      <Link to="/" onClick={toggleMenu}>{content.headerHome}</Link>
      <Link to="/Wine" onClick={toggleMenu}>{content.headerProducts}</Link>
      <Link to="/Order" onClick={toggleMenu}>Order</Link>
      <Link to="/About" onClick={toggleMenu}>{content.headerAbout}</Link>
    </>
  );

  return (
    <div className="App">
      <nav className="App-nav">
        <BrowserView>
          <div className={`menu ${isMenuOpen ? "open" : ""}`}>
            {renderMenuLinks()}
            {renderAuthButtons()}
          </div>
        </BrowserView>

        <MobileView>
          {renderAuthButtons()}
          <div ref={menuRef}>
            <div className={`hamburger ${isMenuOpen ? "open" : ""}`} onClick={toggleMenu}>
              <div className="bar" />
              <div className="bar" />
              <div className="bar" />
            </div>
            {isMenuOpen && <div className="mobile-menu">{renderMenuLinks()}</div>}
          </div>
        </MobileView>
      </nav>

      {isModalOpen && <AuthModal type={modalType} onClose={closeModal} setUser={setUser}/>}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Wine" element={<Wine />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/About" element={<About />} />
        </Routes>

        {location.pathname === "/" && (
          <>
            <Wine />
            <OrderPage />
            <About />
          </>
        )}

      </main>
      <Footer />
    </div>
  );
}

function App() {
  
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // როდესაც ყველაფერი ჩაიტვირთება, ლოადერი გაქრება
    }, 2900);

    return () => clearTimeout(timer);
  }, []);
  return (
    <Router>
      {loading ? (
        <Loader />
      ) : (
        <AppContent />
      )}
    </Router>
  );
}

export default App;
