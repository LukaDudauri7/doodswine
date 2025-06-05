import React from "react";
import "./SocialBar.css";

const socialLinks = [
  { label: "Facebook", icon: "fa-facebook-f", className: "facebook", url: 'https://www.facebook.com/share/12LKpgPvRCf/?mibextid=wwXIfr' },
  { label: "Instagram", icon: "fa-instagram", className: "instagram", url: 'https://www.instagram.com/doods_wine/' },
  { label: "WhatsApp", icon: "fa-whatsapp", className: "whatsapp", url: 'https://wa.me/995598312612' },
  { label: "TikTok", icon: "fa-tiktok", className: "tiktok", url: 'https://www.tiktok.com/@doods.wine?_t=ZS-8vzJpTfwniy&_r=1' },
];

const SocialBar = () => {
  return (
    <div className="social-bar">
      {socialLinks.map(({ label, icon, className, url }) => (
        <a 
          key={label}
          href={url}
          className={`social-link ${className}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className={`fa-brands ${icon}`} />
          <span className="label">{label}</span>
        </a>
      ))}
    </div>
  );
};

export default SocialBar;
