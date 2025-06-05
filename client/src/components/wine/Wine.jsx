import './Wine.css';
import captions from '../../captions.json';
import { useLanguage } from '../../languageContext';
import { motion } from 'framer-motion';

const Wine = () => {
  const { language } = useLanguage();
  const content = captions[language].wines;

  const wines = [
    {
      name: content.mtsvane,
      image: '/images/mtsvane.jpg',
      description: content.mtsvaneDesc,
      price: '₾40',
    },
    {
      name: content.rkatsiteli,
      image: '/images/rkatsiteli.jpg',
      description: content.rkatsiteliDesc,
      price: '₾35',
    },
    {
      name: content.chinuri,
      image: '/images/chinuri.jpg',
      description: content.chinuriDesc,
      price: '₾35',
    },
    {
      name: content.aladasturi,
      image: '/images/aladasturi.jpg',
      description: content.aladasturiDesc,
      price: '₾40',
    },
    {
      name: content.dirbula,
      image: '/images/dirbula.jpg',
      description: content.dirbulaDesc,
      price: '₾40',
    },
  ];

  return (
    <div className="wine-page">
      <h1>{content.ourWines}</h1>
      <div className="wine-list">
        {wines.map((wine, index) => (
          <motion.div
            className="wine-card"
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
            whileHover={{ scale: 1.05, boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}
          >
            <img src={wine.image} alt={wine.name} />
            <h2>{wine.name}</h2>
            <p>{wine.description}</p>
            <span className="price">{wine.price}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Wine;
