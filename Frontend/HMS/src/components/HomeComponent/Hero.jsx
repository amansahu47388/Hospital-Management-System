import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Hero({ height = "100vh", width = "100%" }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80",
      title: "Revolutionizing Healthcare",
      subtitle: "Advanced Medical Technology & Compassionate Care"
    },
    {
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&q=80",
      title: "Expert Medical Team",
      subtitle: "Dedicated Professionals Committed to Your Health"
    },
    {
      image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?auto=format&fit=crop&q=80",
      title: "24/7 Emergency Services",
      subtitle: "Always Here When You Need Us Most"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const nextSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  return (
    <section 
      id="hero" 
      className="relative overflow-hidden transition-all duration-500 ease-in-out"
      style={{ height, width }}
    >
      {/* Slides */}
      <div className="absolute inset-0 w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover transition-transform duration-[2000ms] ease-out"
              style={{ transform: index === currentSlide ? "scale(1)" : "scale(1.1)" }}
            />
            {/* Dynamic Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60 md:bg-gradient-to-r md:from-black/70 md:via-black/20 md:to-transparent" />
          </div>
        ))}
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-start px-6 md:px-20 z-10">
        <div className="max-w-3xl transform transition-all duration-1000 ease-out">
          <div className={`transition-all duration-700 delay-300 ${isAnimating ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"}`}>
            <span className="inline-block px-4 py-1.5 mb-4 text-sm font-semibold tracking-wider text-white uppercase bg-[#6046B5]/80 backdrop-blur-md rounded-full border border-white/20">
              Welcome to our Medical Center
            </span>
            <h1 className="text-white text-4xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-2xl">
              {slides[currentSlide].title.split(" ").map((word, i) => (
                <span key={i} className={i === 1 ? "text-purple-400" : ""}>{word} </span>
              ))}
            </h1>
            <p className="text-white/90 text-lg md:text-2xl mb-10 max-w-xl leading-relaxed drop-shadow-lg">
              {slides[currentSlide].subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-[0_10px_20px_rgba(96,70,181,0.4)] hover:scale-105 active:scale-95 transition-all duration-300 group">
                Book Appointment
                <ChevronRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300">
                View Services
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="hidden md:block">
        <button
          onClick={prevSlide}
          className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-4 rounded-full border border-white/20 hover:bg-[#6046B5] hover:border-[#6046B5] transition-all duration-300 z-20 group"
          disabled={isAnimating}
        >
          <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md text-white p-4 rounded-full border border-white/20 hover:bg-[#6046B5] hover:border-[#6046B5] transition-all duration-300 z-20 group"
          disabled={isAnimating}
        >
          <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (!isAnimating && index !== currentSlide) {
                setIsAnimating(true);
                setCurrentSlide(index);
                setTimeout(() => setIsAnimating(false), 700);
              }
            }}
            className="group relative py-2"
          >
            <div className={`h-1 rounded-full transition-all duration-500 ${
              index === currentSlide ? "w-12 bg-white" : "w-6 bg-white/40 group-hover:bg-white/60"
            }`} />
          </button>
        ))}
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default Hero;
