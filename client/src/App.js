// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Loader from "./components/Loader/Loader";
import NavBar from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import AuthModal from "./components/AuthModal/AuthModal";

import Home from "./components/Home/Home";
import Wine from "./components/Wine/Wine";
import OrderPage from "./components/OrderPage/OrderPage";
import About from "./components/About/About";

import { useLanguage } from './languageContext';
import captions from './captions.json';
import "./App.css";
import "./fonts.css";

function AppContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [user, setUser] = useState(null);

  const { language } = useLanguage();
  const content = captions[language].header;

  const location = useLocation();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("user"));
    if (saved) setUser(saved);
  }, []);

  const openModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className="App">
      <NavBar user={user} logout={logout} openModal={openModal} captions={content} />

      {isModalOpen && (
        <AuthModal type={modalType} onClose={closeModal} setUser={setUser} />
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wine" element={<Wine />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      {loading ? <Loader /> : <AppContent />}
    </Router>
  );
}

export default App;
