// src/components/Button.jsx
import React from "react";

 function Button({ title }) {
  return (
    <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition">
      {title}
    </button>
  );
}
export default Button;