import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, Award, Users, Heart } from "lucide-react";

function About() {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState({
    patients: 0,
    doctors: 0,
    awards: 0,
    years: 0
  });
  const sectionRef = useRef(null);

  const stats = [
    { icon: <Users className="w-8 h-8" />, value: 50000, label: "Happy Patients", suffix: "+" },
    { icon: <Award className="w-8 h-8" />, value: 150, label: "Expert Doctors", suffix: "+" },
    { icon: <Heart className="w-8 h-8" />, value: 25, label: "Awards Won", suffix: "+" },
    { icon: <CheckCircle className="w-8 h-8" />, value: 15, label: "Years Experience", suffix: "+" }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.2 }
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

  const animateCounters = () => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    stats.forEach((stat, index) => {
      let current = 0;
      const increment = stat.value / steps;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timer);
        }
        setCounters(prev => ({
          ...prev,
          [index]: Math.floor(current)
        }));
      }, interval);
    });
  };

  return (
    <section id="about" ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-purple-100 rounded-full -ml-32 -mt-32 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full -mr-48 -mb-48 opacity-50"></div>

      <div className="w-full mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] bg-clip-text text-transparent">
            About Our Hospital
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image */}
          <div className={`flex justify-center ${isVisible ? "animate-slide-in-left" : "opacity-0"}`}>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500"></div>
              <img
                src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800"
                alt="About Us"
                className="relative w-full max-w-md rounded-2xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#6046B5]">15+</p>
                  <p className="text-sm text-gray-600">Years of Excellence</p>
                </div>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className={`${isVisible ? "animate-slide-in-right" : "opacity-0"}`}>
            <h3 className="text-3xl font-bold mb-6 text-gray-800">
              Committed to Excellence in Healthcare
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              Our hospital is dedicated to providing exceptional healthcare services with a focus on patient-centered care. We combine advanced medical technology with compassionate treatment to ensure the best outcomes for our patients.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              With a team of experienced doctors, nurses, and support staff, we offer a wide range of services including emergency care, specialized treatments, and preventive health programs.
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Our mission is to improve the health and well-being of our community through innovative healthcare solutions and personalized attention.
            </p>

            {/* Features List */}
            <ul className="space-y-3">
              {[
                "State-of-the-art medical equipment",
                "Experienced and certified medical professionals",
                "24/7 emergency services",
                "Patient-centered care approach"
              ].map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 text-gray-700 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center group ${isVisible ? "animate-scale-in" : "opacity-0"
                }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#6046B5] to-[#8A63D2] text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                {counters[index]}{stat.suffix}
              </p>
              <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default About;