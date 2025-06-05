import { motion } from 'framer-motion';
import Slider from "../Slider/Slider.jsx";
import SocialBar from "../SocialBar/SocialBar.jsx";
import './Home.css';
import captions from '../../captions.json';
import { useLanguage } from '../../languageContext';

const Home = () => {
    const { language } = useLanguage();
    const content = captions[language].home;

    return (
        <div className="home-container">
            <motion.h1
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="home-title"
            >
                DOOD'S WINE
            </motion.h1>

            <motion.h2
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="home-subtitle"
            >
                {content.brandName}
            </motion.h2>

            <motion.div
                initial={{ x: "100%", opacity: 0 }} // იწყება ეკრანის მარჯვენა კიდიდან (100% of viewport width)
                animate={{ x: "0%", opacity: 1 }}  // სრულდება თავის პოზიციაზე (0% of viewport width offset)
                transition={{
                    duration: 0.8, // ანიმაციის ხანგრძლივობა (0.8 წამი)
                    delay: 1.2,    // დაყოვნება სანამ დაიწყება ანიმაცია (1.2 წამი)
                    ease: "easeOut" // ანიმაციის გამარტივება: სწრაფი დასაწყისი, ნელი დასასრული
                }}
            >
                <SocialBar />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.9 }}
            >
                <Slider />
            </motion.div>
        </div>
    );
};

export default Home;
