import React, { useState, useEffect, useRef } from "react";
import { Calendar, Users, Ambulance, Video, FileText, Pill, Activity, Heart } from "lucide-react";

function Features() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const features = [
    {
      title: "Appointment Booking",
      description: "Easily schedule appointments with our doctors online at your convenience.",
      icon: <Calendar className="w-10 h-10" />,
      gradient: "from-blue-500 to-cyan-500",
      delay: "0s"
    },
    {
      title: "Patient Management",
      description: "Comprehensive patient records and management system for seamless care.",
      icon: <Users className="w-10 h-10" />,
      gradient: "from-purple-500 to-pink-500",
      delay: "0.1s"
    },
    {
      title: "Emergency Care",
      description: "24/7 emergency services for critical situations with rapid response.",
      icon: <Ambulance className="w-10 h-10" />,
      gradient: "from-red-500 to-orange-500",
      delay: "0.2s"
    },
    {
      title: "Telemedicine",
      description: "Consult with doctors remotely via secure video calls from anywhere.",
      icon: <Video className="w-10 h-10" />,
      gradient: "from-green-500 to-teal-500",
      delay: "0.3s"
    },
    {
      title: "Medical Records",
      description: "Secure digital storage of medical history with easy access anytime.",
      icon: <FileText className="w-10 h-10" />,
      gradient: "from-indigo-500 to-purple-500",
      delay: "0.4s"
    },
    {
      title: "Pharmacy Services",
      description: "Integrated pharmacy for prescriptions and medications delivery.",
      icon: <Pill className="w-10 h-10" />,
      gradient: "from-pink-500 to-rose-500",
      delay: "0.5s"
    },
    {
      title: "Health Monitoring",
      description: "Advanced health monitoring and diagnostic services for prevention.",
      icon: <Activity className="w-10 h-10" />,
      gradient: "from-yellow-500 to-orange-500",
      delay: "0.6s"
    },
    {
      title: "Cardiac Care",
      description: "Specialized cardiac care with state-of-the-art equipment and experts.",
      icon: <Heart className="w-10 h-10" />,
      gradient: "from-red-500 to-pink-500",
      delay: "0.7s"
    },
  ];

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
    <section id="features" ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-purple-100 rounded-full -mr-48 opacity-30"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-blue-100 rounded-full -ml-48 opacity-30"></div>

      <div className="w-full mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] bg-clip-text text-transparent">
            Our Services
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Discover the comprehensive healthcare services we offer to meet all your medical needs with excellence and care.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`group relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden ${isVisible ? "animate-scale-in" : "opacity-0"
                }`}
              style={{ animationDelay: feature.delay }}
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

              {/* Icon Container */}
              <div className="relative mb-4">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} text-white rounded-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                  {feature.icon}
                </div>
                {/* Decorative Circle */}
                <div className={`absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br ${feature.gradient} rounded-full opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-[#6046B5] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Arrow */}
              <div className="mt-4 flex items-center text-[#6046B5] font-semibold text-sm opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                Learn More
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>

              {/* Bottom Border Animation */}
              <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${feature.gradient} w-0 group-hover:w-full transition-all duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.8s" }}>
          <button className="px-8 py-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            View All Services
          </button>
        </div>
      </div>

      <style jsx>{`
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

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
}

export default Features;