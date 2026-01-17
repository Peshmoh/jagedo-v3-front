import { useState, useEffect } from "react";
import { Pause, Play, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react"; 
import { motion } from "framer-motion";

const images = [
  { src: "/Sub-landing/Energy.jpeg", text: "We innovate with partners to expand clean, efficient, and sustainable energy" },
  { src: "/Sub-landing/Housing.jpg", text: "We commit to sustainable land, housing, and future green cities development" },
  { src: "/Sub-landing/Partnership.jpg", text: "We foster trusted partnerships for lasting, mutually beneficial success" },
  { src: "/Sub-landing/water.jpg", text: "We create sustainable water solutions through partnerships and smart investments" },
];

const Home = () => {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const nextSlide = () => setIndex((prev) => (prev + 1) % images.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + images.length) % images.length);
  const togglePlayPause = () => setIsPlaying((prev) => !prev);

  const smoothScroll = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className=" py-4 relative w-full h-screen overflow-hidden" id="Home">
      {/* Screen reader announcements for slide changes */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {images[index].text}
      </div>

      {images.map((image, i) => (
        <div
          key={i}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Image with gradient overlay */}
          <div className="relative w-full h-full">
            <img
              src={image.src}
              alt=""
              className="w-full h-full object-cover object-center"
              style={{ minHeight: "100vh", minWidth: "100vw" }} 
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>

          {/* Left-Aligned Text Content */}
          <div className="absolute top-1/3 left-4 sm:left-16 max-w-xs sm:max-w-xl text-left">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 2 }}
              transition={{ duration: 0.8 }}
              className="text-white text-lg sm:text-3xl font-semibold"
            >
              {image.text}
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-4"
            >
            
              <button
                onClick={(e) => smoothScroll(e, "#About")} // Scroll to #About
                className="text-left focus:outline-none group"
              >
                <span className="text-white text-sm sm:text-lg mb-2 hover:underline">
                  Learn More
                </span>
                <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center group-hover:bg-blue-700 transition-all duration-300">
                  <ChevronDown className="w-4 h-4 text-white" /> {/* Use ChevronDown */}
                </span>
              </button>
            </motion.div>
          </div>
        </div>
      ))}

      {/* Controls and Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 bg-white/80 p-2 sm:p-3 rounded-full shadow-lg backdrop-blur-md">
        <button 
          onClick={togglePlayPause} 
          aria-label={isPlaying ? "Pause slideshow" : "Play slideshow"}
          className="p-1 sm:p-2 rounded-full hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isPlaying ? <Pause className="w-4 h-4 sm:w-5 sm:h-5" /> : <Play className="w-4 h-4 sm:w-5 sm:h-5" />}
        </button>
        <button 
          onClick={prevSlide} 
          aria-label="Previous slide"
          className="p-1 sm:p-2 rounded-full hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="flex space-x-1 sm:space-x-2">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                i === index ? "bg-black scale-125" : "border border-black bg-transparent"
              }`}
            />
          ))}
        </div>
        <button 
          onClick={nextSlide} 
          aria-label="Next slide"
          className="p-1 sm:p-2 rounded-full hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );
};

export default Home;