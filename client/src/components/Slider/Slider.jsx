import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Slider.css';

const Slider = () => {
  const imageCount = 7;
  const images = Array.from({ length: imageCount }, (_, i) => `/images/wines/wine${i + 1}.webp`);
  return (
    <div className="slider-container">
    <Swiper
      modules={[Navigation, Pagination]}
      slidesPerView={2.3}
      centeredSlides={true}
      spaceBetween={30}
      navigation
      pagination={{ clickable: true }}
      loop={true}
      className="card-slider"
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
