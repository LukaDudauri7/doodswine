// OrderPage.jsx
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { db } from "../../firebase"; // firebase init
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useState } from "react";
import "./OrderPage.css";

const wines = ["რქაწითელი", "გორული მწვანე", "ალადასტური", "ჩინური", "დირბულა"];

const OrderPage = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [wine, setWine] = useState(wines[0]);

  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) controls.start({ opacity: 1, y: 0 });
  }, [controls, inView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "orders"), {
        name,
        phone,
        wine,
        created: Timestamp.now(),
      });
      alert("შეკვეთა მიღებულია! 🍷");
      setName("");
      setPhone("");
      setAddress("");
      setWine(wines[0]);
    } catch (err) {
      alert("დაფიქსირდა შეცდომა: " + err.message);
    }
  };

  return (
    <motion.div
      className="order-page-container"
      ref={ref}
      initial={{ opacity: 0, y: 120 }}
      animate={controls}
      transition={{ duration: 1 }}
    >
      <h2>შეკვეთის გაფორმება</h2>
      <form onSubmit={handleSubmit} className="order-form">
        <input
          type="text"
          placeholder="თქვენი სახელი"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="ტელეფონი"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="მისამართი"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <select className="wine-select" value={wine} onChange={(e) => setWine(e.target.value)}>
          {wines.map((w, i) => (
            <option key={i} value={w}>{w}</option>
          ))}
        </select>
        <button type="submit">გაგზავნა</button>
      </form>
    </motion.div>
  );
};

export default OrderPage;
