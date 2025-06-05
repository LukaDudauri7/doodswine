import { useLanguage } from "../../languageContext";
import "./LanguageSelector.css"; // Assuming you have a CSS file for styling

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const handleChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <select value={language} onChange={handleChange} className="language-selector">
      <option value="en">EN</option>
      <option value="ka">KA</option>
    </select>
  );
};

export default LanguageSelector;
