import { useLanguage } from "../../languageContext";
import "./LanguageSelector.css";

const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="flag-container">
      <img
        src="../../../images/flags/us.png"
        alt="English"
        className={`flag ${language === "en" ? "active" : ""}`}
        onClick={() => changeLanguage("en")}
      />

      <img
        src="../../../images/flags/geo.png"
        alt="Georgian"
        className={`flag ${language === "ge" ? "active" : ""}`}
        onClick={() => changeLanguage("ge")}
      />
    </div>
  );
};

export default LanguageSelector;
