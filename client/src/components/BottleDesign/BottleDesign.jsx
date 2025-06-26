import React from 'react';
import { useState } from 'react';
import './BottleDesign.css'; // Assuming you have a CSS file for styling
import WineCustomizer from '../WineCustomizer/WineCustomizer.jsx';
import captions from '../../captions.json';
import { useLanguage } from '../../languageContext.js';
import { motion } from 'framer-motion';

const BottleDesign = () => {
    const { language } = useLanguage();
    const content = captions[language].bottleDesign;

    const predefinedColors = [
        { name: "წითელი", value: "#990000" },
        { name: "ოქროსფერი", value: "#b39800" },
        { name: "შავი", value: "#000000" },
        { name: "მწვანე", value: "#004d00" },
        { name: "თეთრი", value: "#FFFFFF" }
    ];
    const [labelText, setLabelText] = useState("DOOD'S WINE");
    const [capColor, setCapColor] = useState(predefinedColors[0].value);

    const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
        when: "beforeChildren",
        staggerChildren: 0.2, // მეტი დაგვიანება თითო ელემენტზე
        },
    },
    };

    const childVariants = {
    hidden: { opacity: 0, y: 40 }, // მეტი Y, უფრო ქვემოდან ამოსვლა
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
        viewport={{ once: true, amount: 0.3 }}
    >
        <div className="bottle-design-container">
        <motion.h1 variants={childVariants}>{content.header}</motion.h1>

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
                <motion.div
                key={color.value}
                onClick={() => setCapColor(color.value)}
                className={`color-circle ${capColor === color.value ? 'selected' : ''}`}
                style={{ backgroundColor: color.value }}
                title={color.name}
                variants={childVariants}
                whileHover={{ scale: 1.15 }}
                transition={{ type: "spring", stiffness: 400 }}
                >
                {capColor === color.value && (
                    <span className="color-checkmark">✓</span>
                )}
                </motion.div>
            ))}
            </motion.div>
        </motion.div>

        <motion.div variants={childVariants}>
            <WineCustomizer capColor={capColor} labelText={labelText} />
        </motion.div>
        </div>
    </motion.div>
    );

};

export default BottleDesign;