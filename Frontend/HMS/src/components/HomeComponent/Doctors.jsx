import React from "react";
import doctorImage from "../../assets/doctor.webp";

function Doctors() {
  const doctors = [
    {
      name: "Dr. John Smith",
      specialty: "Cardiology",
      image: doctorImage,
      experience: "15 years",
    },
    {
      name: "Dr. Sarah Johnson",
      specialty: "Neurology",
      image: doctorImage,
      experience: "12 years",
    },
    {
      name: "Dr. Michael Brown",
      specialty: "Orthopedics",
      image: doctorImage,
      experience: "10 years",
    },
    {
      name: "Dr. Emily Davis",
      specialty: "Pediatrics",
      image: doctorImage,
      experience: "8 years",
    },
  ];

  return (
    <section id="doctors" className="py-16 bg-gray-50">
      <div className="w-full mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Meet Our Doctors</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our team of experienced and dedicated doctors is committed to providing the highest quality healthcare services.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {doctors.map((doctor, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold mb-2">{doctor.name}</h3>
              <p className="text-blue-600 font-medium mb-2">{doctor.specialty}</p>
              <p className="text-gray-600">{doctor.experience} experience</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Doctors;