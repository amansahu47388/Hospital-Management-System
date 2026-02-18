import { X, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { updateAdminProfile } from "../../api/adminApi";

/* ---------- Reusable Field Wrapper ---------- */
const Field = ({ label, required, children }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
};

const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [formData, setFormData] = useState({
    staffId: profile?.staffId || "",
    role: profile?.role || "Admin",
    designation: profile?.designation || "Admin",
    department: profile?.job?.department || "",
    specialist: profile?.job?.specialist || "",
    firstName: profile?.name?.split(' ')[0] || "",
    lastName: profile?.name?.split(' ').slice(1).join(' ') || "",
    fatherName: profile?.personal?.fatherName || "",
    motherName: profile?.personal?.motherName || "",
    gender: profile?.personal?.gender || "Male",
    maritalStatus: profile?.personal?.maritalStatus || "Single",
    bloodGroup: profile?.personal?.bloodGroup || "O+",
    dob: profile?.personal?.dob || null,
    doj: profile?.job?.dateOfJoining || null,
    phone: profile?.personal?.phone || "",
    emergencyContact: profile?.personal?.emergencyPhone || "",
    email: profile?.personal?.email || "",
    currentAddress: profile?.personal?.currentAddress || "",
    permanentAddress: profile?.personal?.permanentAddress || "",
    qualification: profile?.professional?.qualification || "",
    experience: profile?.professional?.experience || "",
    specialization: profile?.professional?.specialization || "",
    note: "",
    pan: profile?.identification?.pan || "",
    nationalId: profile?.identification?.nationalId || "",
    localId: "",
    referenceContact: "",

    /* ===== ADD MORE DETAILS ===== */
    epfNo: profile?.job?.epfNo || "",
    contractType: profile?.job?.contractType || "Permanent",
    basicSalary: profile?.job?.basicSalary || "",
    workShift: profile?.job?.workShift || "Morning",
    workLocation: profile?.job?.workLocation || "",
    dateOfLeaving: null,

    casualLeave: "",
    privilegeLeave: "",
    sickLeave: "",
    maternityLeave: "",
    paternityLeave: "",
    feverLeave: "",

    accountTitle: "",
    bankAccountNumber: "",
    bankName: "",
    ifscCode: "",
    bankBranchName: "",

    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    // For date fields, convert empty string to null
    const processedValue = (name === 'dob' || name === 'doj' || name === 'dateOfLeaving') && value === '' ? null : value;
    setFormData({ ...formData, [name]: processedValue });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const fieldClass = "bg-white border border-gray-300 px-3 py-2 rounded focus:ring-1 focus:ring-[#6046B5] outline-none text-sm w-full";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile || !profile.id) {
      alert("Profile not loaded. Please wait and try again.");
      return;
    }

    const form = new FormData();
    form.append("first_name", formData.firstName);
    form.append("last_name", formData.lastName);
    form.append("staff_id", formData.staffId);
    form.append("designation", formData.designation);
    form.append("department", formData.department);
    form.append("specialist", formData.specialist);
    form.append("gender", formData.gender);
    form.append("merital_status", formData.maritalStatus);
    form.append("blood_group", formData.bloodGroup);
    if (formData.dob) form.append("date_of_birth", formData.dob);
    if (formData.doj) form.append("date_of_joining", formData.doj);
    form.append("emergency_contact", formData.emergencyContact);
    form.append("current_address", formData.currentAddress);
    form.append("permanent_address", formData.permanentAddress);
    form.append("qualifications", formData.qualification);
    form.append("experience_years", parseInt(formData.experience) || 0);
    form.append("father_name", formData.fatherName);
    form.append("mother_name", formData.motherName);
    form.append("pan_number", formData.pan);
    form.append("national_id", formData.nationalId);
    form.append("local_id", formData.localId);
    form.append("reference_contact", formData.referenceContact);
    form.append("epf_no", formData.epfNo);
    form.append("contract_type", formData.contractType);
    form.append("basic_salary", parseFloat(formData.basicSalary) || 0);
    form.append("work_shift", formData.workShift);
    form.append("work_location", formData.workLocation);
    if (formData.dateOfLeaving) form.append("date_of_leaving", formData.dateOfLeaving);

    form.append("casual_leave", parseInt(formData.casualLeave) || 0);
    form.append("privilege_leave", parseInt(formData.privilege_leave) || 0);
    form.append("sick_leave", parseInt(formData.sickLeave) || 0);
    form.append("maternity_leave", parseInt(formData.maternityLeave) || 0);
    form.append("paternity_leave", parseInt(formData.paternityLeave) || 0);
    form.append("fever_leave", parseInt(formData.feverLeave) || 0);

    form.append("account_title", formData.accountTitle);
    form.append("bank_account_number", formData.bankAccountNumber);
    form.append("bank_name", formData.bankName);
    form.append("ifsc_code", formData.ifscCode);
    form.append("bank_branch_name", formData.bankBranchName);

    form.append("socia_media_links", JSON.stringify({
      facebook: formData.facebook,
      twitter: formData.twitter,
      linkedin: formData.linkedin,
      instagram: formData.instagram,
    }));

    if (selectedImage) {
      form.append("profile_picture", selectedImage);
    }

    try {
      await updateAdminProfile(profile.id, form);
      alert('Profile updated successfully!');
      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[98%] max-w-7xl rounded-lg shadow-xl overflow-hidden max-h-[95vh] flex flex-col">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
          <h3 className="font-bold text-xl">Edit Profile</h3>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto space-y-8"
        >
          {/* Basic Information Section */}
          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-300 pb-2">Basic Information</h4>

            {/* Grid Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
              <Field label="Staff ID" required>
                <input name="staffId" value={formData.staffId} onChange={handleChange} className={fieldClass} required />
              </Field>

              <Field label="Role" required>
                <select name="role" value={formData.role} onChange={handleChange} className={fieldClass} required>
                  <option>Admin</option>
                  <option>Doctor</option>
                  <option>Nurse</option>
                  <option>Pharmacist</option>
                  <option>Pathologist</option>
                  <option>Radiologist</option>
                  <option>Accountant</option>
                  <option>Receptionist</option>
                </select>
              </Field>

              <Field label="Designation">
                <select name="designation" value={formData.designation} onChange={handleChange} className={fieldClass}>
                  <option value="">Select</option>
                  <option>Admin</option>
                  <option>Doctor</option>
                  <option>IT Admin</option>
                  <option>Nurse</option>
                  <option>Pharmacist</option>
                  <option>Pathologist</option>
                  <option>Radiologist</option>
                  <option>Accountant</option>
                  <option>Receptionist</option>
                  <option>Driver</option>
                </select>
              </Field>

              <Field label="Department">
                <select name="department" value={formData.department} onChange={handleChange} className={fieldClass}>
                  <option value="">Select</option>
                  <option value="OT">OT</option>
                  <option value="Doctor Department">Doctor Department</option>
                  <option value="Admin">Admin</option>
                  <option value="IPD Department">IPD Department</option>
                  <option value="OPD Department">OPD Department</option>
                  <option value="ICU">ICU</option>
                  <option value="Blood Bank Department">Blood Bank Department</option>
                  <option value="Pathology">Pathology</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Pharmacy Department">Pharmacy Department</option>
                  <option value="Reception">Reception</option>
                  <option value="Human Resource">Human Resource</option>
                  <option value="Gynecology">Gynecology</option>
                  <option value="Finance">Finance</option>
                  <option value="Emergency Department">Emergency Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="BURN CARE">BURN CARE</option>
                  <option value="NICU">NICU</option>
                  <option value="Nursing Department">Nursing Department</option>
                </select>
              </Field>

              <Field label="Specialist">
                <select name="specialist" value={formData.specialist} onChange={handleChange} className={fieldClass}>
                  <option value="">Select Specialist</option>
                  <option>Cardiology</option>
                  <option>Neurology</option>
                  <option>Urology</option>
                  <option>Gynecology</option>
                  <option>Orthopedics</option>
                  <option>Pathology</option>
                  <option>Radiology</option>
                  <option>General Surgery</option>
                </select>
              </Field>
            </div>

            {/* Grid Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <Field label="First Name" required>
                <input name="firstName" value={formData.firstName} onChange={handleChange} className={fieldClass} required />
              </Field>

              <Field label="Last Name">
                <input name="lastName" value={formData.lastName} onChange={handleChange} className={fieldClass} />
              </Field>

              <Field label="Father Name">
                <input name="fatherName" value={formData.fatherName} onChange={handleChange} className={fieldClass} />
              </Field>

              <Field label="Mother Name">
                <input name="motherName" value={formData.motherName} onChange={handleChange} className={fieldClass} />
              </Field>
            </div>

            {/* Grid Row 3 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <Field label="Gender" required>
                <select name="gender" value={formData.gender} onChange={handleChange} className={fieldClass} required>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </Field>

              <Field label="Marital Status">
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={fieldClass}>
                  <option>Single</option>
                  <option>Married</option>
                  <option>Divorced</option>
                  <option>Widowed</option>
                  <option>Separated</option>
                </select>
              </Field>

              <Field label="Blood Group">
                <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={fieldClass}>
                  <option value="">Select</option>
                  <option>O+</option>
                  <option>A+</option>
                  <option>B+</option>
                  <option>AB+</option>
                  <option>O-</option>
                  <option>A-</option>
                  <option>B-</option>
                  <option>AB-</option>
                </select>
              </Field>

              <Field label="Date Of Birth" required>
                <input type="date" name="dob" value={formData.dob || ''} onChange={handleChange} className={fieldClass} required />
              </Field>
            </div>

            {/* Grid Row 4 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
              <Field label="Date Of Joining">
                <input type="date" name="doj" value={formData.doj || ''} onChange={handleChange} className={fieldClass} />
              </Field>

              <Field label="Phone">
                <input name="phone" value={formData.phone} onChange={handleChange} className={fieldClass} />
              </Field>

              <Field label="Emergency Contact">
                <input name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} className={fieldClass} />
              </Field>

              <Field label="Email" required>
                <input name="email" type="email" value={formData.email} onChange={handleChange} className={fieldClass} required />
              </Field>

              <Field label="Photo">
                <input type="file" onChange={handleImageChange} className={fieldClass} />
              </Field>
            </div>

            {/* Grid Row 5: Addresses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Current Address">
                <textarea name="currentAddress" value={formData.currentAddress} onChange={handleChange} className={`${fieldClass} py-3`} rows="1" />
              </Field>

              <Field label="Permanent Address">
                <textarea name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} className={`${fieldClass} py-3`} rows="1" />
              </Field>
            </div>

            {/* Grid Row 6: Professional */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              <Field label="Qualification">
                <input name="qualification" value={formData.qualification} onChange={handleChange} className={fieldClass} />
              </Field>

              <Field label="Work Experience">
                <input name="experience" value={formData.experience} onChange={handleChange} className={fieldClass} />
              </Field>

              <Field label="Specialization">
                <input name="specialization" value={formData.specialization} onChange={handleChange} className={fieldClass} />
              </Field>

              <Field label="Note">
                <input name="note" value={formData.note} onChange={handleChange} className={fieldClass} />
              </Field>
            </div>

            {/* Grid Row 7: Identity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field label="Pan Number">
                <input name="pan" value={formData.pan} onChange={handleChange} className={fieldClass} />
              </Field>

              <Field label="National Identification Number">
                <input name="nationalId" value={formData.nationalId} onChange={handleChange} className={fieldClass} />
              </Field>

              <Field label="Local Identification Number">
                <input name="localId" value={formData.localId} onChange={handleChange} className={fieldClass} />
              </Field>
            </div>

            {/* Grid Row 8: Reference */}
            <div className="w-full">
              <Field label="Reference Contact">
                <input name="referenceContact" value={formData.referenceContact} onChange={handleChange} className={fieldClass} />
              </Field>
            </div>
          </div>

          {/* ================= ADD MORE DETAILS TOGGLE ================= */}
          <div
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="border rounded-lg px-4 py-4 flex justify-between items-center text-sm text-[#6046B5] cursor-pointer bg-purple-50 hover:bg-purple-100 transition-colors border-purple-200"
          >
            <span className="font-bold flex items-center gap-2">
              <Plus size={18} className={showMoreDetails ? "rotate-45 transition-transform" : "transition-transform"} />
              {showMoreDetails ? "Hide Additional Information" : "Add More Details (Payroll, Bank, Social Media)"}
            </span>
          </div>

          {/* ================= ADD MORE DETAILS SECTION ================= */}
          {showMoreDetails && (
            <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-300">

              {/* PAYROLL */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-4 bg-[#6046B5] rounded"></div>
                  Payroll Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
                  <Field label="EPF No">
                    <input name="epfNo" value={formData.epfNo} onChange={handleChange} className={fieldClass} />
                  </Field>
                  <Field label="Contract Type">
                    <select name="contractType" value={formData.contractType} onChange={handleChange} className={fieldClass}>
                      <option>Permanent</option>
                      <option>Contract</option>
                    </select>
                  </Field>
                  <Field label="Basic Salary">
                    <input name="basicSalary" value={formData.basicSalary} onChange={handleChange} className={fieldClass} />
                  </Field>
                  <Field label="Work Shift">
                    <input name="workShift" value={formData.workShift} onChange={handleChange} className={fieldClass} />
                  </Field>
                  <Field label="Work Location">
                    <input name="workLocation" value={formData.workLocation} onChange={handleChange} className={fieldClass} />
                  </Field>
                  <Field label="Date Of Leaving">
                    <input type="date" name="dateOfLeaving" value={formData.dateOfLeaving || ''} onChange={handleChange} className={fieldClass} />
                  </Field>
                </div>
              </div>

              {/* LEAVE */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-4 bg-[#6046B5] rounded"></div>
                  Leave Entitlement
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 p-4 bg-gray-50 rounded-lg">
                  <Field label="Casual Leave"><input name="casualLeave" value={formData.casualLeave} onChange={handleChange} className={fieldClass} /></Field>
                  <Field label="Privilege Leave"><input name="privilegeLeave" value={formData.privilegeLeave} onChange={handleChange} className={fieldClass} /></Field>
                  <Field label="Sick Leave"><input name="sickLeave" value={formData.sickLeave} onChange={handleChange} className={fieldClass} /></Field>
                  <Field label="Maternity Leave"><input name="maternityLeave" value={formData.maternityLeave} onChange={handleChange} className={fieldClass} /></Field>
                  <Field label="Paternity Leave"><input name="paternityLeave" value={formData.paternityLeave} onChange={handleChange} className={fieldClass} /></Field>
                  <Field label="Fever Leave"><input name="feverLeave" value={formData.feverLeave} onChange={handleChange} className={fieldClass} /></Field>
                </div>
              </div>

              {/* BANK */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-4 bg-[#6046B5] rounded"></div>
                  Bank Account Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg">
                  <Field label="Account Title"><input name="accountTitle" value={formData.accountTitle} onChange={handleChange} className={fieldClass} /></Field>
                  <Field label="Bank Account Number"><input name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} className={fieldClass} /></Field>
                  <Field label="Bank Name"><input name="bankName" value={formData.bankName} onChange={handleChange} className={fieldClass} /></Field>
                  <Field label="IFSC Code"><input name="ifscCode" value={formData.ifscCode} onChange={handleChange} className={fieldClass} /></Field>
                  <Field label="Bank Branch Name"><input name="bankBranchName" value={formData.bankBranchName} onChange={handleChange} className={fieldClass} /></Field>
                </div>
              </div>

              {/* SOCIAL MEDIA */}
              <div className="space-y-4">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <div className="w-2 h-4 bg-[#6046B5] rounded"></div>
                  Social Media Links
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg">
                  <Field label="Facebook URL"><input name="facebook" value={formData.facebook} onChange={handleChange} className={fieldClass} /></Field>
                  <Field label="Twitter URL"><input name="twitter" value={formData.twitter} onChange={handleChange} className={fieldClass} /></Field>
                  <Field label="LinkedIn URL"><input name="linkedin" value={formData.linkedin} onChange={handleChange} className={fieldClass} /></Field>
                  <Field label="Instagram URL"><input name="instagram" value={formData.instagram} onChange={handleChange} className={fieldClass} /></Field>
                </div>
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-300 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-8 py-2.5 rounded text-gray-700 font-semibold border-2 border-gray-200 hover:bg-gray-50 transition-all shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-10 py-2.5 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white font-bold rounded shadow-lg hover:opacity-90 transition-all active:scale-95"
            >
              Update Profile
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;



