// src/components/Hero.jsx
import React from "react";
import Button from "./Button";

 function Hero() {
  return (
    <section className="max-w-full mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">

      {/* LEFT TEXT */}
      <div>
        <h1 className="text-5xl font-bold leading-tight mb-6">
          We help people to <br /> get appointment <br /> in online
        </h1>
        <p className="text-gray-600 mb-6">
          Lorem Media is a full-service social media agency. We deliver
          innovative solutions that enhance your visibility, brand, and
          communication.
        </p>

        <Button title="Tour" />
      </div>

      {/* RIGHT IMAGE */}
      <div className="flex justify-center">
        <img
           src="../src/assets/icons/doctor1.jpeg"
          alt="Hero Illustration"
          className="w-[85%] "
        />
      </div>
    </section>
  );
}
export default Hero;