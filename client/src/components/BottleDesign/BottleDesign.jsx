import React, { useState } from 'react';
import './BottleDesign.css';
import WineCustomizer from '../WineCustomizer/WineCustomizer.jsx';
import captions from '../../captions.json';
import { useLanguage } from '../../languageContext.js';
import { motion } from 'framer-motion';
import axios from "axios";

const BottleDesign = ({ user, openModal }) => {
    const { language } = useLanguage();
    const content = captions[language].bottleDesign;

    const [labelImage, setLabelImage] = useState(null);
    const [labelImageBase64, setLabelImageBase64] = useState(null);

    const predefinedColors = [
        { name: "წითელი", value: "#990000" },
        { name: "ოქროსფერი", value: "#b39800" },
        { name: "შავი", value: "#000000" },
        { name: "მწვანე", value: "#004d00" },
        { name: "თეთრი", value: "#FFFFFF" }
    ];

    const [labelText, setLabelText] = useState("DOOD'S WINE");
    const [capColor, setCapColor] = useState(predefinedColors[0].value);

    // Convert uploaded image → Base64
    const convertToBase64 = (file) => {
        const reader = new FileReader();
        reader.onloadend = () => setLabelImageBase64(reader.result);
        reader.readAsDataURL(file);
    };
    const handleSave = async () => {
        if (!user) {
            alert("გთხოვთ გაიაროთ ავტორიზაცია.");
            openModal("login");
            return;
        }

        const fileInput = document.querySelector("input[type='file']");
        const file = fileInput?.files?.[0];

        const formData = new FormData();
        formData.append("labelText", labelText);
        formData.append("capColor", capColor);

        if (file) {
            formData.append("image", file);
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_URL}/api/label`,
                formData,
                {
                    headers: {
                        "x-auth-token": user.token
                    }
                }
            );

            alert("თქვენი ეტიკეტი წარმატებით შეინახა!");
        } catch (err) {
            console.error(err);
            alert("შეცდომა მოხდა შენახვისას.");
        }
    };

    // Animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { when: "beforeChildren", staggerChildren: 0.2 },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.25, ease: "easeOut" },
        },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            className='bottle-design-section'
        >
            <motion.h1 className='chooseText' variants={childVariants}>{content.header}</motion.h1>

            {/* IMAGE UPLOAD */}
            <motion.div className="upload-box" variants={childVariants}>
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
                                    const url = URL.createObjectURL(file);
                                    setLabelImage(url);
                                    convertToBase64(file);
                                }
                            }}
                        />
                    </label>
                </div>
            </motion.div>

            <div className="bottle-design-container">

                <motion.div className="container" variants={childVariants}>
                    <motion.div className="label-group" variants={childVariants}>
                        <motion.label variants={childVariants}>{content.label}</motion.label>
                        <motion.textarea
                            variants={childVariants}
                            value={labelText}
                            onChange={(e) => setLabelText(e.target.value)}
                            placeholder={"ჩაწერეთ ტექსტი...\n (Enter - ახალი ხაზი)"}
                            rows="3"
                        />
                    </motion.div>

                    <motion.p variants={childVariants}>{content.cap}</motion.p>

                    <motion.div className="color-options" variants={childVariants}>
                        {predefinedColors.map((color, index) => (
                            <motion.button
                                key={index}
                                type="button"
                                onClick={() => setCapColor(color.value)}
                                className={`color-circle ${capColor === color.value ? 'selected' : ''}`}
                                style={{ backgroundColor: color.value }}
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {capColor === color.value && <span className="color-checkmark">✓</span>}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* SAVE BUTTON */}
                    <motion.button
                        className="save-label-btn"
                        variants={childVariants}
                        onClick={handleSave}
                    >
                        ეტიკეტის შენახვა 📦🍷
                    </motion.button>
                </motion.div>

                <motion.div variants={childVariants} className='wine-customizer-wrapper'>
                    <WineCustomizer 
                        capColor={capColor} 
                        labelText={labelText} 
                        labelImage={labelImageBase64} 
                    />
                </motion.div>
            </div>
        </motion.div>
    );
};

export default BottleDesign;
