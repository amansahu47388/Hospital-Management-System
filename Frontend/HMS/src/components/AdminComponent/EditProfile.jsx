import { X, Plus } from "lucide-react";
import { useState } from "react";

/* ---------- Reusable Field Wrapper ---------- */
const Field = ({ label, children }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">
        {label}
      </label>
      {children}
    </div>
  );
};

const EditProfileModal = ({ profile, onClose }) => {
  const [formData, setFormData] = useState({
    staffId: profile.staffId || "9017",
    role: "Admin",
    designation: "Admin",
    department: "Admin",
    specialist: "",
    firstName: "Jason",
    lastName: "Abbot",
    fatherName: "smith Abbot",
    motherName: "Mariya Abbot",
    gender: "Male",
    maritalStatus: "Single",
    bloodGroup: "O+",
    dob: "1990-01-30",
    doj: "2021-09-14",
    phone: "4785963210",
    emergencyContact: "4785963210",
    email: "jason@gmail.com",
    currentAddress: "927 New Moon Apartment, CA",
    permanentAddress: "spain",
    qualification: "MS",
    experience: "7",
    specialization: "",
    note: "",
    pan: "FGFDG56657",
    nationalId: "657567557",
    localId: "0761-56765",
    referenceContact: "897978978",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Data:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[95%] max-w-6xl rounded shadow-lg">

        {/* Header */}
        <div className="flex justify-between items-center px-6 py-3 border-b">
          <h3 className="font-semibold text-lg">Basic Information</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[75vh] overflow-y-auto"
        >

          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Field label="Staff ID">
              <input name="staffId" value={formData.staffId} onChange={handleChange} className="input" />
            </Field>

            <Field label="Role">
              <select name="role" value={formData.role} onChange={handleChange} className="input">
                <option>Admin</option>
                <option>Doctor</option>
              </select>
            </Field>

            <Field label="Designation">
              <select name="designation" value={formData.designation} onChange={handleChange} className="input">
                <option>Admin</option>
                <option>Staff</option>
              </select>
            </Field>

            <Field label="Department">
              <select name="department" value={formData.department} onChange={handleChange} className="input">
                <option>Admin</option>
              </select>
            </Field>

            <Field label="Specialist">
              <select name="specialist" className="input">
                <option>Select Specialist</option>
              </select>
            </Field>
          </div>

          {/* Names */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Field label="First Name">
              <input name="firstName" value={formData.firstName} onChange={handleChange} className="input" />
            </Field>

            <Field label="Last Name">
              <input name="lastName" value={formData.lastName} onChange={handleChange} className="input" />
            </Field>

            <Field label="Father Name">
              <input name="fatherName" value={formData.fatherName} onChange={handleChange} className="input" />
            </Field>

            <Field label="Mother Name">
              <input name="motherName" value={formData.motherName} onChange={handleChange} className="input" />
            </Field>
          </div>

          {/* Personal */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Field label="Gender">
              <select name="gender" value={formData.gender} onChange={handleChange} className="input">
                <option>Male</option>
                <option>Female</option>
              </select>
            </Field>

            <Field label="Marital Status">
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className="input">
                <option>Single</option>
                <option>Married</option>
              </select>
            </Field>

            <Field label="Blood Group">
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input">
                <option>O+</option>
                <option>A+</option>
              </select>
            </Field>

            <Field label="Date of Birth">
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="input" />
            </Field>
          </div>

          {/* Dates & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Field label="Date of Joining">
              <input type="date" name="doj" value={formData.doj} onChange={handleChange} className="input" />
            </Field>

            <Field label="Phone">
              <input name="phone" value={formData.phone} onChange={handleChange} className="input" />
            </Field>

            <Field label="Emergency Contact">
              <input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className="input" />
            </Field>

            <Field label="Email">
              <input name="email" value={formData.email} onChange={handleChange} className="input" />
            </Field>

            <Field label="Profile Photo">
              <input type="file" className="input" />
            </Field>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Current Address">
              <input name="currentAddress" value={formData.currentAddress} onChange={handleChange} className="input" />
            </Field>

            <Field label="Permanent Address">
              <input name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} className="input" />
            </Field>
          </div>

          {/* Qualification */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Field label="Qualification">
              <input name="qualification" value={formData.qualification} onChange={handleChange} className="input" />
            </Field>

            <Field label="Work Experience">
              <input name="experience" value={formData.experience} onChange={handleChange} className="input" />
            </Field>

            <Field label="Specialization">
              <input name="specialization" value={formData.specialization} onChange={handleChange} className="input" />
            </Field>

            <Field label="Note">
              <input name="note" value={formData.note} onChange={handleChange} className="input" />
            </Field>
          </div>

          {/* IDs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="PAN Number">
              <input name="pan" value={formData.pan} onChange={handleChange} className="input" />
            </Field>

            <Field label="National ID">
              <input name="nationalId" value={formData.nationalId} onChange={handleChange} className="input" />
            </Field>

            <Field label="Local ID">
              <input name="localId" value={formData.localId} onChange={handleChange} className="input" />
            </Field>
          </div>

          {/* Reference */}
          <Field label="Reference Contact">
            <input name="referenceContact" value={formData.referenceContact} onChange={handleChange} className="input" />
          </Field>

          {/* Add More */}
          <div className="border rounded px-4 py-3 flex justify-between items-center text-sm text-gray-600">
            <span>Add More Details</span>
            <Plus size={16} />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 border rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
              Save
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
