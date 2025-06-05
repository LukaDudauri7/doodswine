import { useNavigate, useLocation } from 'react-router-dom';
import captions from '../../captions.json';
import { useLanguage } from '../../languageContext';
import './about.css';
const About = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { language } = useLanguage();
    const content = captions[language].about;
    const isFullPage = location.pathname === "/About";
    return (
    <div className="about-container">
      <h2 className="about-title">{content.title}</h2>
      <p className="about-text">{isFullPage ? content.fullText : content.shortText}</p>
       {!isFullPage && (
        <button className="toggle-button" onClick={() => navigate("/About")}>{content.seeMore}</button>
      )}
    </div>
  );
};

export default About;

