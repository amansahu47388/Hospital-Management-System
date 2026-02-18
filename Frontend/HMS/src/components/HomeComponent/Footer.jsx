import React from "react";
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, Linkedin, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import FullLogo from "../../assets/icons/logo4.png";

function Footer() {
  const quickLinks = [
    { name: "Home", href: "#hero" },
    { name: "About Us", href: "#about" },
    { name: "Services", href: "#features" },
    { name: "Doctors", href: "#doctors" },
    { name: "Contact", href: "#contact" },
  ];

  const services = [
    "Emergency Care",
    "Appointment Booking",
    "Patient Management",
    "Telemedicine",
    "Pharmacy Services",
    "Health Monitoring"
  ];

  const socialLinks = [
    { icon: <Facebook className="w-5 h-5" />, href: "#", name: "Facebook" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", name: "Twitter" },
    { icon: <Instagram className="w-5 h-5" />, href: "#", name: "Instagram" },
    { icon: <Linkedin className="w-5 h-5" />, href: "#", name: "LinkedIn" },
  ];

  return (
    <footer id="contact" className="bg-gradient-to-b from-gray-900 to-black text-gray-300 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full -ml-48 -mt-48"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 rounded-full -mr-48 -mb-48"></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="w-full mx-auto px-4 md:px-6 py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Hospital Info */}
            <div className="space-y-6">
              <img
                src={FullLogo}
                alt="Hospital Logo"
                className="h-16 w-auto object-contain"
              />
              <p className="text-gray-400 leading-relaxed">
                Providing exceptional healthcare services with compassion and innovation. Your health is our priority.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-[#6046B5] hover:to-[#8A63D2] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 relative inline-block">
                Quick Links
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#6046B5] to-[#8A63D2]"></span>
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Our Services */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 relative inline-block">
                Our Services
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#6046B5] to-[#8A63D2]"></span>
              </h4>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index} className="text-gray-400 hover:text-white hover:pl-2 transition-all duration-300 flex items-center gap-2 group">
                    <span className="w-1.5 h-1.5 bg-[#6046B5] rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                    {service}
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-white text-lg font-bold mb-6 relative inline-block">
                Contact Us
                <span className="absolute bottom-0 left-0 w-12 h-0.5 bg-gradient-to-r from-[#6046B5] to-[#8A63D2]"></span>
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3 group">
                  <MapPin className="w-5 h-5 text-[#6046B5] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="text-gray-400">123 Medical Center Drive</p>
                    <p className="text-gray-400">City, State 12345</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <Phone className="w-5 h-5 text-[#6046B5] flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <a href="tel:+15551234567" className="text-gray-400 hover:text-white transition-colors duration-300">
                    (555) 123-4567
                  </a>
                </div>
                <div className="flex items-center gap-3 group">
                  <Mail className="w-5 h-5 text-[#6046B5] flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                  <a href="mailto:info@medilabhospital.com" className="text-gray-400 hover:text-white transition-colors duration-300">
                    info@medilabhospital.com
                  </a>
                </div>
                <div className="flex items-start gap-3 group">
                  <Clock className="w-5 h-5 text-[#6046B5] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-300" />
                  <div>
                    <p className="text-gray-400">Mon-Fri: 8:00 - 17:00</p>
                    <p className="text-gray-400">Emergency: 24/7</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800">
          <div className="w-full mx-auto px-4 md:px-6 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="text-white text-lg font-bold mb-2">Subscribe to Our Newsletter</h4>
                <p className="text-gray-400 text-sm">Get the latest health tips and hospital updates</p>
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6046B5] flex-1 md:w-64 transition-all duration-300"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800">
          <div className="w-full mx-auto px-4 md:px-6 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
              <p className="text-gray-400">
                © 2026 MediLab Hospital. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Terms of Service
                </Link>
                <Link to="/sitemap" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Sitemap
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;