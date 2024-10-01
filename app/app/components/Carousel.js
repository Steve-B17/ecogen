import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import One from "../public/assets/carousel/one.jpg";
import Two from "../public/assets/carousel/two.jpg";
import Three from "../public/assets/carousel/three.jpg";

const carouselData = [
  {
    id: 1,
    title: "Comprehensive Graphs And Stats",
    image: One,
  },
  {
    id: 2,
    title: "Another Feature",
    image: Two,
  },
  {
    id: 3,
    title: "Yet Another Feature",
    image: Three,
  },
];

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="w-full max-w-6xl mx-auto"> {/* Increased the max width */}
      <Slider {...settings}>
        {carouselData.map((slide) => (
          <div key={slide.id} className="relative px-4">
            {/* Carousel Image */}
            <div className="relative">
              <img
                src={slide.image.src}
                alt={slide.title}
                className="w-full h-[500px] md:h-[700px] object-cover rounded-lg"
              />
              {/* Overlay Text */}
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                <h2 className="text-3xl md:text-5xl font-bold text-white text-center px-4">
                  {slide.title}
                </h2>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
