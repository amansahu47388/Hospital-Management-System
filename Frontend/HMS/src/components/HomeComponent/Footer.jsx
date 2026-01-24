import React from "react";
import hospitalImage from "../../assets/hospital-management-system.jpg";

function Footer() {
  return (
    <footer id="contact" className="bg-purple-100 text-gray-800 py-12">
      <div className="w-full mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Hospital Info */}
          <div>
            <img
              src={hospitalImage}
              alt="Hospital Logo"
              className="w-16 h-16 rounded-full mb-4"
            />
            <h3 className="text-xl font-bold mb-2">MediLab Hospital</h3>
            <p className="text-gray-600">
              Providing exceptional healthcare services with compassion and innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-600 hover:text-gray-800">Home</a></li>
              <li><a href="#about" className="text-gray-600 hover:text-gray-800">About Us</a></li>
              <li><a href="#services" className="text-gray-600 hover:text-gray-800">Services</a></li>
              <li><a href="#doctors" className="text-gray-600 hover:text-gray-800">Doctors</a></li>
              <li><a href="#contact" className="text-gray-600 hover:text-gray-800">Contact</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Services</h4>
            <ul className="space-y-2">
              <li className="text-gray-600">Emergency Care</li>
              <li className="text-gray-600">Appointment Booking</li>
              <li className="text-gray-600">Patient Management</li>
              <li className="text-gray-600">Telemedicine</li>
              <li className="text-gray-600">Pharmacy</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-2 text-gray-600">
              <p>📍 123 Medical Center Drive</p>
              <p>🏙️ City, State 12345</p>
              <p>📞 (555) 123-4567</p>
              <p>✉️ info@medilabhospital.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-purple-200 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            © 2025 MediLab Hospital. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;