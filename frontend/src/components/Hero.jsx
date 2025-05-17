import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { Autoplay } from 'swiper/modules';
import { assets } from '../assets/assets';

const Hero = () => {
  const images = [
    { src: assets.hero_img1, alt: 'Slide 1' },
    { src: assets.hero_img2, alt: 'Slide 2' },
    { src: assets.hero_img3, alt: 'Slide 3' },
  ];

  return (
    <div className="flex flex-col sm:flex-row border border-gray-400">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 3000, // 5 seconds
          disableOnInteraction: false, // Continue autoplay even after user interaction
        }}
        className="h-[350px] sm:h-[400px] md:h-[600px] rounded-lg overflow-hidden"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;
