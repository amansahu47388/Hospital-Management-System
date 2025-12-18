import React, { useState, useEffect, useRef } from "react";

function Hero() {
  const scrollRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const images = [
    "../src/assets/icons/doctor1.jpeg",
    "../src/assets/icons/d1.webp",
    "../src/assets/hospital-management-system.jpg"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => (prev + 1) % images.length);
    }, 3000); // Auto scroll every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  const manualScroll = (direction) => {
    setScrollPosition((prev) => {
      if (direction === 'left') {
        return prev === 0 ? images.length - 1 : prev - 1;
      } else {
        return (prev + 1) % images.length;
      }
    });
  };

  return (
    <section className="w-full pt-20">
      <div className="w-full grid md:grid-cols-3 gap-6 px-6">

        {/* LEFT BANNER */}
        <div className="md:col-span-2 relative rounded-lg overflow-hidden h-[400px]">
          <div
            ref={scrollRef}
            className="flex transition-transform duration-1000 ease-in-out h-full"
            style={{ transform: `translateX(-${scrollPosition * 100}%)` }}
          >
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Hero ${index + 1}`}
                className="w-full h-full object-cover flex-shrink-0"
              />
            ))}
          </div>

          <div className="absolute inset-0 bg-black/40 flex items-center">
            <h1 className="text-white text-3xl md:text-4xl font-bold px-8">
              Revolutionizing Care
            </h1>
          </div>

          {/* Manual scroll buttons */}
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30"
            onClick={() => manualScroll('left')}
          >
            ‹
          </button>
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30"
            onClick={() => manualScroll('right')}
          >
            ›
          </button>
        </div>

        {/* RIGHT NEWS */}
        <div className="bg-white rounded-lg shadow p-4 h-[400px] overflow-hidden">
          <h2 className="bg-purple-500 text-white px-4 py-2 rounded">
            Latest News
          </h2>

          <div className="mt-4 h-full overflow-hidden">
            <div className="animate-scroll space-y-6">
              <NewsItem date="03" month="December" title="International Day of Persons with Disabilities" />
              <NewsItem date="10" month="November" title="World Neuroendocrine Cancer Day" />
              <NewsItem date="21" month="October" title="Global Handwashing Day" />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

function NewsItem({ date, month, title }) {
  return (
    <div className="flex gap-4 border-b pb-4">
      <div className="bg-purple-600 text-white text-center px-3 py-2 rounded">
        <p className="text-lg font-bold">{date}</p>
        <p className="text-xs">{month}</p>
      </div>
      <p className="text-sm text-gray-700">{title}</p>
    </div>
  );
}

export default Hero;
