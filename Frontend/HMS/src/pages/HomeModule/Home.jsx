// src/pages/Home.jsx
import React from "react";
import Navbar from "../../components/AdminComponent/Navbar";
import Hero from "../../components/HomeComponent/Hero";
import HomeNavbar from "../../components/HomeComponent/HomeNavbar";

 function Home({ openLogin, openSignup }) {
  return (
    <div>

      <HomeNavbar/>

      <Hero />

    </div>
  );
}

export default Home;