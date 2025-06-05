import './Footer.css';
import captions from '../../captions.json';
import { useLanguage } from '../../languageContext';

const Footer = () => {
    const { language } = useLanguage();
    const content = captions[language].footer;
    return(
        <div className="footer">
            <div>
                <div className='copyright'>{content.copyright}</div>
                <div className='footer-links'>
                    <div>{content.terms}</div>
                </div>
            </div>
        </div>
    )
}

export default Footer;