import React from 'react';
import { useState } from 'react';
import './BottleDesign.css'; // Assuming you have a CSS file for styling
import WineCustomizer from '../WineCustomizer';
import captions from '../../captions.json';
import { useLanguage } from '../../languageContext.js';

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
    return (
        <div className='bottle-design-container'>
            <h1>{content.header}</h1>
            <div className="container">
                <div className="label-group">
                <label>{content.label}</label>
                <textarea
                    value={labelText}
                    onChange={(e) => setLabelText(e.target.value)}
                    placeholder={"ჩაწერეთ ტექსტი...\n (Enter - ახალი ხაზი)"}
                    rows="3"
                />
                </div>
                
                <p>{content.cap}</p>
                <div className="color-options">
                    {predefinedColors.map((color) => (
                    <div
                        key={color.value}
                        onClick={() => setCapColor(color.value)}
                        className={`color-circle ${capColor === color.value ? 'selected' : ''}`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                    >
                        {capColor === color.value && (
                        <span className="color-checkmark">✓</span>
                        )}
                    </div>
                    ))}
                </div>
            </div>
            <WineCustomizer capColor={capColor} labelText={labelText} />
        </div>
    );
};

export default BottleDesign;