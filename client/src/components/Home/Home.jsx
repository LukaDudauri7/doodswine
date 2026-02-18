import { motion } from 'framer-motion';
import Slider from "../Slider/Slider.jsx";
import SocialBar from "../SocialBar/SocialBar.jsx";
import './Home.css';
import captions from '../../captions.json';
import { useLanguage } from '../../languageContext.js';

const Home = () => {
    const { language } = useLanguage();
    const content = captions[language].home;

    return (
        <div className="home-container">
            <motion.h2
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="home-subtitle"
            >
                {content.brandName}
            </motion.h2>

            <motion.div
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                transition={{
                    duration: 0.8,
                    delay: 1.2,
                    ease: "easeOut"
                }}
            >
                <SocialBar />
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.4 }}
            >
                <Slider />
            </motion.div>
        </div>
    );
};

export default Home;
