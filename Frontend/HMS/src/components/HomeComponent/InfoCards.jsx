import React, { useState, useEffect, useRef } from "react";

function InfoCards() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section ref={sectionRef} className="mt-12 px-4 md:px-6 w-full">
      <div className="w-full grid md:grid-cols-4 gap-6 p-4 m-4">
        {/* Clinic News Card */}
        <div
          className={`bg-white hover:bg-gradient-to-r hover:from-[#6046B5] hover:to-[#8A63D2] p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group ${isVisible ? "animate-slide-up" : "opacity-0"
            }`}
          style={{ animationDelay: "0s" }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-white transition-colors duration-500">
              Clinic News
            </h3>
            <p className="text-sm text-gray-600 group-hover:text-white mb-6 leading-relaxed transition-colors duration-500">
              Stay updated with the latest medical advancements, hospital events, and health awareness initiatives at Sai Hospital.
            </p>
            <button className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] group-hover:bg-white group-hover:bg-none text-white group-hover:text-[#6046B5] px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-transparent group-hover:border-white">
              Read More
            </button>
          </div>
        </div>

        {/* Top Doctors Card */}
        <div
          className={`bg-white hover:bg-gradient-to-r hover:from-[#6046B5] hover:to-[#8A63D2] p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group ${isVisible ? "animate-slide-up" : "opacity-0"
            }`}
          style={{ animationDelay: "0.15s" }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-white transition-colors duration-500">
              Top Doctors
            </h3>
            <p className="text-sm text-gray-600 group-hover:text-white mb-6 leading-relaxed transition-colors duration-500">
              Meet our team of highly qualified and experienced specialists committed to providing compassionate, world-class healthcare.
            </p>
            <button className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] group-hover:bg-white group-hover:bg-none text-white group-hover:text-[#6046B5] px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-transparent group-hover:border-white">
              Read More
            </button>
          </div>
        </div>

        {/* 24 Hours Service Card */}
        <div
          className={`bg-white hover:bg-gradient-to-r hover:from-[#6046B5] hover:to-[#8A63D2] p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group ${isVisible ? "animate-slide-up" : "opacity-0"
            }`}
          style={{ animationDelay: "0.3s" }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-white transition-colors duration-500">
              24 Hours Service
            </h3>
            <p className="text-sm text-gray-600 group-hover:text-white mb-6 leading-relaxed transition-colors duration-500">
              Sai Hospital offers round-the-clock medical care, ensuring emergency services and patient support are always available.
            </p>
            <button className="bg-gradient-to-r from-[#6046B5] to-[#8A63D2] group-hover:bg-white group-hover:bg-none text-white group-hover:text-[#6046B5] px-6 py-2 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border-2 border-transparent group-hover:border-white">
              Read More
            </button>
          </div>
        </div>

        {/* Opening Hours Card */}
        <div
          className={`bg-white hover:bg-gradient-to-r hover:from-[#6046B5] hover:to-[#8A63D2] p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 group ${isVisible ? "animate-slide-up" : "opacity-0"
            }`}
          style={{ animationDelay: "0.45s" }}
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-6 text-gray-900 group-hover:text-white transition-colors duration-500">
              Opening Hours
            </h3>
            <div className="text-sm space-y-3 text-left">
              <div className="flex justify-between items-center pb-2">
                <span className="font-medium text-gray-700 group-hover:text-white transition-colors duration-500">Monday - Friday</span>
                <span className="text-gray-600 group-hover:text-white transition-colors duration-500">8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="font-medium text-gray-700 group-hover:text-white transition-colors duration-500">Saturday</span>
                <span className="text-gray-600 group-hover:text-white transition-colors duration-500">9:30 AM - 5:30 PM</span>
              </div>
              <div className="flex justify-between items-center pb-2">
                <span className="font-medium text-gray-700 group-hover:text-white transition-colors duration-500">Sunday</span>
                <span className="text-gray-600 group-hover:text-white transition-colors duration-500">9:30 AM - 3:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default InfoCards;
