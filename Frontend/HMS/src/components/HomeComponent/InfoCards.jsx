import React from "react";

const cards = [
  {
    title: "Clinic News",
    desc: "Cum sociis natoque penatibus et magnis dis parturient montesmus.",
  },
  {
    title: "Top Doctors",
    desc: "Cum sociis natoque penatibus et magnis dis parturient montesmus.",
  },
  {
    title: "24 Hours Service",
    desc: "Cum sociis natoque penatibus et magnis dis parturient montesmus.",
  },
];

function InfoCards() {
  return (
    <section className="mt-12 px-6 w-full">
      <div className="w-full grid md:grid-cols-4 gap-0 rounded-lg overflow-hidden h-[300px]">

        {cards.map((card, index) => (
          <div key={index} className="bg-purple-500 text-white p-8">
            <h3 className="text-xl font-semibold mb-4">{card.title}</h3>
            <p className="text-sm mb-6">{card.desc}</p>
            <button className="bg-white text-purple-500 px-4 py-2 rounded ">
              Read More
            </button>
          </div>
        ))}

        {/* Opening Hours */}
        <div className="bg-purple-600 text-white p-8">
          <h3 className="text-xl font-semibold mb-4">Opening Hours</h3>
          <ul className="text-sm space-y-2">
            <li className="flex justify-between">
              <span>Monday - Friday</span>
              <span>8.00 - 17.00</span>
            </li>
            <li className="flex justify-between">
              <span>Saturday</span>
              <span>9.30 - 17.30</span>
            </li>
            <li className="flex justify-between">
              <span>Sunday</span>
              <span>9.30 - 15.00</span>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
}

export default InfoCards;
