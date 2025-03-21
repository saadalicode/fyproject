import React, { useState, useEffect } from "react";
import "./Carousel.css";
import image1 from "../assets/images/carousel/image1.png";
import image2 from "../assets/images/carousel/image2.png";
import image3 from "../assets/images/carousel/image3.png";
import image4 from "../assets/images/carousel/image4.png";

const images = [image1, image2, image3, image4];

const CarouselComponent = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false); // Track hover state

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(nextSlide, 3000);
      return () => clearInterval(interval);
    }
  }, [isPaused]); // Depend on isPaused state

  return (
    <div
      className="carousel"
      onMouseEnter={() => setIsPaused(true)}  // Pause on hover
      onMouseLeave={() => setIsPaused(false)} // Resume on leave
    >
      {/* Previous Button */}
      <button className="prev" onClick={prevSlide}>&#10094;</button>

      {/* Images */}
      <div className="carousel-images">
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Slide ${index + 1}`}
            className={index === currentIndex ? "active" : ""}
          />
        ))}
      </div>

      {/* Next Button */}
      <button className="next" onClick={nextSlide}>&#10095;</button>

      {/* Dots */}
      <div className="dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={index === currentIndex ? "dot active" : "dot"}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default CarouselComponent;
