import React, { useState } from "react";
import "./BottleDesign.css";
import WineCustomizer from "../WineCustomizer/WineCustomizer.jsx";
import captions from "../../captions.json";
import { useLanguage } from "../../languageContext.js";
import { motion } from "framer-motion";
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "https://doodswine.onrender.com";

const BottleDesign = ({ user, openModal }) => {
  const { language } = useLanguage();
  const content = captions[language].bottleDesign;

  const [labelImageBase64, setLabelImageBase64] = useState(null);
  const [labelText, setLabelText] = useState("DOOD'S WINE");
  const [capColor, setCapColor] = useState("#990000");

  // ✅ ერთადერთი არჩევანი
  const [layout, setLayout] = useState("text-image"); 
  // "text-image" | "image-text"

  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const predefinedColors = [
    { name: "წითელი", value: "#990000" },
    { name: "ოქროსფერი", value: "#b39800" },
    { name: "შავი", value: "#000000" },
    { name: "მწვანე", value: "#004d00" },
    { name: "თეთრი", value: "#FFFFFF" }
  ];

  const convertToBase64 = (file) => {
    const reader = new FileReader();
    reader.onloadend = () => setLabelImageBase64(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setLabelImageBase64(null);
  };

  const handleSave = () => {
    if (!user) {
      alert(content.authRequired);
      openModal("login");
      return;
    }
    setShowPhoneModal(true);
  };

  const submitLabel = async () => {
    if (!phone) {
      alert("შეიყვანეთ ტელეფონის ნომერი");
      return;
    }

    const formData = new FormData();
    formData.append("labelText", labelText);
    formData.append("capColor", capColor);
    formData.append("phone", phone);
    formData.append("layout", layout); // სურვილის შემთხვევაში backend-ზე

    try {
      setSaving(true);
      await axios.post(`${API}/api/label`, formData, {
        headers: { "x-auth-token": user.token }
      });

      alert(content.savedLabel);
      setShowPhoneModal(false);
      setPhone("");
    } catch (err) {
      alert(content.saveError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bottle-design-section"
      >
        <motion.h1 className="chooseText">{content.header}</motion.h1>

        <div className="bottle-design-container">

          {/* ===== LEFT CONTROLS ===== */}
          <div className="container">
            <p>{content.cap}</p>

            <div className="color-options">
              {predefinedColors.map((color, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCapColor(color.value)}
                  className={`color-circle ${capColor === color.value ? "selected" : ""}`}
                  style={{ backgroundColor: color.value }}
                >
                  {capColor === color.value && <span className="color-checkmark">✓</span>}
                </button>
              ))}
            </div>
          </div>
          <div className="wine-customizer-wrapper">
            <WineCustomizer
              capColor={capColor}
              labelText={labelText}
              labelImage={labelImageBase64}
              layout={layout}
            />
          </div>
            
        

          <div className="upload-box">
            <div className="label-controls">
                <div className="control-section">
                <p>{content.labelLayout}</p>

                <div className="control-buttons">
                    <button
                      className={layout === "text-image" ? "active" : ""}
                      onClick={() => setLayout("text-image")}
                      disabled={!labelImageBase64 || !labelText.trim()}
                    >
                    {content.textAbove}
                    </button>

                    <button
                      className={layout === "image-text" ? "active" : ""}
                      onClick={() => setLayout("image-text")}
                      disabled={!labelImageBase64 || !labelText.trim()}
                    >
                    {content.imageAbove}
                    </button>
                </div>
                </div>
            </div>
            <div className="center-box">
              <h2>{content.uploadPhoto}</h2>

              <label className="upload-area">
                <span>📁 {content.chooseFile}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files[0] && convertToBase64(e.target.files[0])
                  }
                />
              </label>

              {labelImageBase64 && (
                <button className="remove-image-btn" onClick={removeImage}>
                  {content.removeImage}
                </button>
              )}

              <label>{content.label}</label>
              <textarea
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                placeholder={content.labelPlaceholder}
                rows="3"
              />
            </div>

            <button className="save-label-btn" onClick={handleSave}>
              {content.save}
            </button>
          </div>
        </div>
      </motion.div>

      {showPhoneModal && (
        <div className="popup-overlay" onClick={() => setShowPhoneModal(false)}>
          <div className="popup-card" onClick={(e) => e.stopPropagation()}>
            <button className="popup-close" onClick={() => setShowPhoneModal(false)}>×</button>
            <h2 className="popup-title">{content.phonePrompt}</h2>
            <p className="popup-text">{content.phoneNote}</p>

            <input
              type="tel"
              className="popup-input"
              placeholder="+995 5XX XX XX XX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <button className="popup-confirm" onClick={submitLabel} disabled={saving}>
              {saving ? content.sending : content.confirm}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default BottleDesign;
