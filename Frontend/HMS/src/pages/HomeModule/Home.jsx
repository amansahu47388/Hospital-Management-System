import React, { useEffect } from "react";
import HomeNavbar from "../../components/HomeComponent/HomeNavbar";
import Hero from "../../components/HomeComponent/Hero";
import InfoCards from "../../components/HomeComponent/InfoCards";
import About from "../../components/HomeComponent/About";
import Features from "../../components/HomeComponent/Features";
import Doctors from "../../components/HomeComponent/Doctors";
import Footer from "../../components/HomeComponent/Footer";

function Home() {
  useEffect(() => {
    // Smooth scroll behavior for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });

    // Add scroll-to-top button functionality
    const scrollBtn = document.getElementById('scroll-to-top');
    const handleScroll = () => {
      if (window.scrollY > 300) {
        scrollBtn?.classList.remove('opacity-0', 'pointer-events-none');
        scrollBtn?.classList.add('opacity-100');
      } else {
        scrollBtn?.classList.add('opacity-0', 'pointer-events-none');
        scrollBtn?.classList.remove('opacity-100');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="relative">
      <HomeNavbar />
      <Hero />
      <InfoCards />
      <About />
      <Features />
      <Doctors />
      <Footer />

      {/* Scroll to Top Button */}
      <button
        id="scroll-to-top"
        onClick={scrollToTop}
        className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 opacity-0 pointer-events-none flex items-center justify-center group"
        aria-label="Scroll to top"
      >
        <svg
          className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform duration-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 10l7-7m0 0l7 7m-7-7v18"
          />
        </svg>
      </button>

      <style jsx>{`
        /* Smooth scroll for the entire page */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #6046B5 0%, #8A63D2 100%);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #4f3a9a 0%, #7552b8 100%);
        }
      `}</style>
    </div>
  );
}

export default Home;