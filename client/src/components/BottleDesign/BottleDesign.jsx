import React, { useState } from 'react';
import './BottleDesign.css';
import WineCustomizer from '../WineCustomizer/WineCustomizer.jsx';
import captions from '../../captions.json';
import { useLanguage } from '../../languageContext.js';
import { motion } from 'framer-motion';
import axios from "axios";

const API = process.env.REACT_APP_API_URL || "https://doodswine.onrender.com";

const BottleDesign = ({ user, openModal }) => {
    const { language } = useLanguage();
    const content = captions[language].bottleDesign;

    const [labelImage, setLabelImage] = useState(null);
    const [labelImageBase64, setLabelImageBase64] = useState(null);
    const [labelText, setLabelText] = useState("DOOD'S WINE");
    const [capColor, setCapColor] = useState("#990000");

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

        const fileInput = document.querySelector("input[type='file']");
        if (fileInput?.files?.[0]) {
            formData.append("image", fileInput.files[0]);
        }

        try {
            setSaving(true);
            await axios.post(`${API}/api/label`, formData, {
                headers: {
                    "x-auth-token": user.token
                }
            });

            alert(content.savedLabel);
            setShowPhoneModal(false);
            setPhone("");
        } catch (err) {
            console.error(err);
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
            className='bottle-design-section'
        >
            <motion.h1 className='chooseText'>{content.header}</motion.h1>

            <div className="bottle-design-container">

                <div className="container">
                    <p>{content.cap}</p>
                    <div className="color-options">
                        {predefinedColors.map((color, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => setCapColor(color.value)}
                                className={`color-circle ${capColor === color.value ? 'selected' : ''}`}
                                style={{ backgroundColor: color.value }}
                            >
                                {capColor === color.value && <span className="color-checkmark">✓</span>}
                            </button>
                        ))}
                    </div>
                </div>

                <div className='wine-customizer-wrapper'>
                    <WineCustomizer
                        capColor={capColor}
                        labelText={labelText}
                        labelImage={labelImageBase64}
                    />
                </div>

                <div className="upload-box">
                    <div className="center-box">
                        <h2>{content.uploadPhoto}</h2>
                        <label className="upload-area">
                            <span>📁 {content.chooseFile}</span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setLabelImage(URL.createObjectURL(file));
                                        convertToBase64(file);
                                    }
                                }}
                            />
                        </label>

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
            
            <button
                className="popup-close"
                onClick={() => setShowPhoneModal(false)}
            >
                ×
            </button>

            <h2 className="popup-title">{content.phonePrompt}</h2>
            <p className="popup-text">{content.phoneNote}</p>

            <input
                type="tel"
                className="popup-input"
                placeholder="+995 5XX XX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />

            <button
                className="popup-confirm"
                onClick={submitLabel}
                disabled={saving}
            >
                {saving ? content.sending : content.confirm}
            </button>

            </div>
        </div>
        )}

        </>
    );
};

export default BottleDesign;
