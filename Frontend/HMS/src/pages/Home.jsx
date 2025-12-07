// src/pages/Home.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HomeNavbar from "../components/HomeNavbar";

 function Home({ openLogin, openSignup }) {
  return (
    <div>

      <HomeNavbar onLogin={openLogin} onSignup={openSignup} />

      <Hero />

    </div>
  );
}

export default Home;