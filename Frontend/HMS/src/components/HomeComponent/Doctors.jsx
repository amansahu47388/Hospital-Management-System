import React, { useState, useEffect, useRef } from "react";
import { Star, Award, Calendar } from "lucide-react";

function Doctors() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  const doctors = [
    {
      name: "Dr. John Smith",
      specialty: "Cardiology",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400",
      experience: "15 years",
      rating: 4.9,
      patients: "5000+"
    },
    {
      name: "Dr. Sarah Johnson",
      specialty: "Neurology",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400",
      experience: "12 years",
      rating: 4.8,
      patients: "4500+"
    },
    {
      name: "Dr. Michael Brown",
      specialty: "Orthopedics",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
      experience: "10 years",
      rating: 4.7,
      patients: "4000+"
    },
    {
      name: "Dr. Emily Davis",
      specialty: "Pediatrics",
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400",
      experience: "8 years",
      rating: 4.9,
      patients: "3500+"
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
    <section id="doctors" ref={sectionRef} className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full -ml-48 -mt-48 opacity-40"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-100 rounded-full -mr-48 -mb-48 opacity-40"></div>

      <div className="w-full mx-auto px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] bg-clip-text text-transparent">
            Meet Our Doctors
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Our team of experienced and dedicated doctors is committed to providing the highest quality healthcare services with compassion and expertise.
          </p>
        </div>

        {/* Doctors Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <div
              key={index}
              className={`group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden ${isVisible ? "animate-scale-in" : "opacity-0"
                }`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden h-64">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1 shadow-lg">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-sm font-bold text-gray-800">{doctor.rating}</span>
                </div>

                {/* Book Appointment Button */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                  <button className="px-6 py-2 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-lg font-semibold hover:shadow-xl transition-all duration-300">
                    Book Appointment
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-[#6046B5] transition-colors duration-300">
                  {doctor.name}
                </h3>
                <p className="text-[#6046B5] font-semibold mb-4 text-lg">
                  {doctor.specialty}
                </p>

                {/* Info Grid */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-gray-400" />
                    <span>{doctor.experience} experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span>{doctor.patients} patients treated</span>
                  </div>
                </div>

                {/* Bottom Border Animation */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Available Today</span>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className={`text-center mt-16 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`} style={{ animationDelay: "0.6s" }}>
          <button className="px-8 py-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-xl font-semibold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
            View All Doctors
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

export default Doctors;