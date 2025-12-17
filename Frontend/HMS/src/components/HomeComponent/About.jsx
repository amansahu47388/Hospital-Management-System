import React from "react";
import hospitalImage from "../../assets/hospital-management-system.jpg";

function About() {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="w-full mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="flex justify-center">
            <img
              src={hospitalImage}
              alt="About Us"
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </div>
          {/* Text */}
          <div>
            <h2 className="text-3xl font-bold mb-6">About Our Hospital</h2>
            <p className="text-gray-600 mb-4">
              Our hospital is dedicated to providing exceptional healthcare services with a focus on patient-centered care. We combine advanced medical technology with compassionate treatment to ensure the best outcomes for our patients.
            </p>
            <p className="text-gray-600 mb-4">
              With a team of experienced doctors, nurses, and support staff, we offer a wide range of services including emergency care, specialized treatments, and preventive health programs.
            </p>
            <p className="text-gray-600">
              Our mission is to improve the health and well-being of our community through innovative healthcare solutions and personalized attention.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;