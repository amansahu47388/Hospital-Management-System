import React from "react";

function Features() {
  const features = [
    {
      title: "Appointment Booking",
      description: "Easily schedule appointments with our doctors online.",
      icon: "📅",
    },
    {
      title: "Patient Management",
      description: "Comprehensive patient records and management system.",
      icon: "👥",
    },
    {
      title: "Emergency Care",
      description: "24/7 emergency services for critical situations.",
      icon: "🚑",
    },
    {
      title: "Telemedicine",
      description: "Consult with doctors remotely via video calls.",
      icon: "💻",
    },
    {
      title: "Medical Records",
      description: "Secure digital storage of medical history.",
      icon: "📋",
    },
    {
      title: "Pharmacy Services",
      description: "Integrated pharmacy for prescriptions and medications.",
      icon: "💊",
    },
  ];

  return (
    <section id="features" className="py-16 bg-white">
      <div className="w-full mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Services</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the comprehensive healthcare services we offer to meet all your medical needs.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;