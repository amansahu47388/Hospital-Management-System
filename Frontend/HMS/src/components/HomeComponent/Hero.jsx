import React from "react";
import Button from "../AdminComponent/Button";

function Hero() {
  return (
    <section className="w-full px-6 pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT TEXT */}
        <div className="text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6">
            We help people to <br className="hidden md:block" />
            get appointment <br className="hidden md:block" />
            online easily
          </h1>

          <p className="text-gray-600 mb-6 text-base sm:text-lg md:text-base">
            Lorem Media is a full-service social media agency. We deliver
            innovative solutions that enhance your visibility, brand, and
            communication.
          </p>

          <div className="flex justify-center md:justify-start">
            <Button title="Tour" />
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center">
          <img
            src="../src/assets/icons/doctor1.jpeg"
            alt="Hero Illustration"
            className="w-[80%] sm:w-[60%] md:w-full max-w-md"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;
