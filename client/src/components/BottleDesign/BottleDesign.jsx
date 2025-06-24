import React from 'react';
import { useState } from 'react';
import './BottleDesign.css'; // Assuming you have a CSS file for styling
import WineCustomizer from '../WineCustomizer';
const BottleDesign = () => {
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
    <div>
        <h1>შეარჩიე შენი დიზაინი 🍷</h1>

        <div className="container">
            <div className="label-group">
            <label>ეტიკეტის ტექსტი:</label>
            <textarea
                value={labelText}
                onChange={(e) => setLabelText(e.target.value)}
                placeholder={"ჩაწერეთ ტექსტი...\n (Enter - ახალი ხაზი)"}
                rows="3"
            />
            </div>
            
            <p>ჩაჩის ფერი:</p>
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