// src/pages/Home.jsx
import React from "react";
import Navbar from "../../components/AdminComponent/Navbar";
import Hero from "../../components/HomeComponent/Hero";
import HomeNavbar from "../../components/HomeComponent/HomeNavbar";
import InfoCards from "../../components/HomeComponent/Infocards";
import About from "../../components/HomeComponent/About";
import Features from "../../components/HomeComponent/Features";
import Doctors from "../../components/HomeComponent/Doctors";
import Footer from "../../components/HomeComponent/Footer";

 function Home({ openLogin, openSignup }) {
  return (
    <div>

      <HomeNavbar/>
      
      <Hero />
      <InfoCards />
      <About />
      <Features />
      <Doctors />
      <Footer />
    </div>
  );
}

export default Home;