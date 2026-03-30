import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200",
      title: "Revolutionizing Healthcare",
      subtitle: "Advanced Medical Technology & Compassionate Care"
    },
    {
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1200",
      title: "Expert Medical Team",
      subtitle: "Dedicated Professionals Committed to Your Health"
    },
    {
      image: "https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=1200",
      title: "24/7 Emergency Services",
      subtitle: "Always Here When You Need Us Most"
    }
  ];

  const news = [
    { date: "03", month: "December", title: "International Day of Persons with Disabilities" },
    { date: "10", month: "November", title: "World Neuroendocrine Cancer Day" },
    { date: "21", month: "October", title: "Global Handwashing Day" },
    { date: "15", month: "September", title: "World Patient Safety Day" },
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
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevSlide = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <section id="hero" className="w-full pt-20 pb-8">
      <div className="w-full grid md:grid-cols-3 gap-6 px-4 md:px-6">

        {/* LEFT BANNER - Image Slider */}
        <div className="md:col-span-2 relative rounded-2xl overflow-hidden h-[400px] md:h-[500px] shadow-2xl group">
          {/* Slides */}
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${index === currentSlide
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-105"
                }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
            </div>
          ))}

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 z-10">
            <div className="transform transition-all duration-700 ease-out">
              <h1 className="text-white text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">
                {slides[currentSlide].title}
              </h1>
              <p className="text-white/90 text-lg md:text-xl mb-6 animate-fade-in-up animation-delay-200">
                {slides[currentSlide].subtitle}
              </p>
              <button className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-400">
                Learn More
              </button>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
            disabled={isAnimating}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100 z-20"
            disabled={isAnimating}
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (!isAnimating) {
                    setIsAnimating(true);
                    setCurrentSlide(index);
                    setTimeout(() => setIsAnimating(false), 500);
                  }
                }}
                className={`h-2 rounded-full transition-all duration-300 ${index === currentSlide
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/75"
                  }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT NEWS SECTION */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-[400px] md:h-[500px]">
          <div className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white px-6 py-4 flex items-center gap-3">
            <Calendar size={24} />
            <h2 className="text-xl font-bold">Latest News & Events</h2>
          </div>

          <div className="p-6 h-[calc(100%-64px)] overflow-hidden">
            <div className="space-y-4 animate-scroll-vertical">
              {[...news, ...news].map((item, index) => (
                <NewsItem
                  key={index}
                  date={item.date}
                  month={item.month}
                  title={item.title}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scroll-vertical {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-50%);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
          opacity: 0;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
          opacity: 0;
        }

        .animate-scroll-vertical {
          animation: scroll-vertical 20s linear infinite;
        }

        .animate-scroll-vertical:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}

function NewsItem({ date, month, title }) {
  return (
    <div className="flex gap-4 border-b border-gray-100 pb-4 hover:bg-purple-50 p-3 rounded-lg transition-all duration-300 cursor-pointer group">
      <div className="bg-gradient-to-br from-[#6046B5] to-[#8A63D2] text-white text-center px-4 py-3 rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
        <p className="text-2xl font-bold">{date}</p>
        <p className="text-xs uppercase">{month}</p>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-700 font-medium group-hover:text-[#6046B5] transition-colors duration-300">
          {title}
        </p>
      </div>
    </div>
  );
}

export default Hero;
