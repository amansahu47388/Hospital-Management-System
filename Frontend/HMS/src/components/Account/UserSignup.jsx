// src/components/SignupModal.jsx
import React from "react";

 function UserSignup({ open, closeModal }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl w-[90%] max-w-md shadow-xl">

        <h2 className="text-xl  font-bold mb-4">Register</h2>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded mb-4"
        />

        <button className="w-full py-3 bg-purple-600  text-gray-600 rounded-lg mb-3">
          Create Account
        </button>

        <button
          onClick={closeModal}
          className="w-full py-2 text-gray-600"
        >
          Close
        </button>

      </div>
    </div>
  );
}
export default UserSignup;