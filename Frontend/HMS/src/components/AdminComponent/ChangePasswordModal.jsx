import { X } from "lucide-react";
import { useState } from "react";

const ChangePasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log("Password Updated:", formData.password);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-md rounded shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center bg-gradient-to-b from-[#6046B5] to-[#8A63D2] px-4 py-2 rounded-t">
          <h3 className="text-white font-semibold">Change Password</h3>
          <button onClick={onClose} className="text-white">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded"
            >
              Save
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default ChangePasswordModal;
