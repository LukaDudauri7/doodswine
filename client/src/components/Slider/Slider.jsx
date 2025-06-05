import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Slider.css';

const Slider = () => {
  const imageCount = 7;
  const images = Array.from({ length: imageCount }, (_, i) => `/images/wine${i + 1}.png`);
  return (
    <div className="slider-container">
      <Swiper
        modules={[Navigation, Pagination]}
        slidesPerView={1}
        spaceBetween={10}
        navigation
        pagination={{ clickable: true }}
        loop={true}
      >
      {images.map((src, index) => (
        <SwiperSlide key={index}>
          <img src={src} alt={`Wine ${index + 1}`} />
        </SwiperSlide>
      ))}
      </Swiper>
    </div>
  );
};

export default Slider;
