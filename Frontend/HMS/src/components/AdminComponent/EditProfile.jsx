import { X, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { updateAdminProfile } from "../../api/adminApi";

/* ---------- Reusable Field Wrapper ---------- */
const Field = ({ label, children }) => {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      {children}
    </div>
  );
};

const EditProfileModal = ({ profile, onClose, onSave }) => {
  const [showMoreDetails, setShowMoreDetails] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile || !profile.id) {
      alert("Profile not loaded. Please wait and try again.");
      return;
    }

    // Validation
    if (!formData.firstName.trim()) {
      alert("First Name is required.");
      return;
    }
    if (!formData.lastName.trim()) {
      alert("Last Name is required.");
      return;
    }
    if (!formData.designation.trim()) {
      alert("Designation is required.");
      return;
    }
    // Add more validations as needed

    try {
      // Helper function to clean date fields
      const cleanDate = (dateStr) => {
        if (!dateStr || dateStr.trim() === "") {
          return null;
        }
        // Ensure it's in YYYY-MM-DD format
        return dateStr;
      };

      // Map formData to backend fields
      const dataToSend = {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        staff_id: formData.staffId.trim() || "",
        designation: formData.designation.trim(),
        department: formData.department.trim() || "",
        specialist: formData.specialist.trim() || "",
        gender: formData.gender.trim() || "",
        merital_status: formData.maritalStatus.trim() || "",
        blood_group: formData.bloodGroup.trim() || "",
        date_of_birth: cleanDate(formData.dob),
        date_of_joining: cleanDate(formData.doj),
        emergency_contact: formData.emergencyContact.trim() || "",
        current_address: formData.currentAddress.trim() || "",
        permanent_address: formData.permanentAddress.trim() || "",
        qualifications: formData.qualification.trim() || "",
        experience_years: parseInt(formData.experience) || 0,
        father_name: formData.fatherName.trim() || "",
        mother_name: formData.motherName.trim() || "",
        pan_number: formData.pan.trim() || "",
        national_id: formData.nationalId.trim() || "",
        local_id: formData.localId.trim() || "",
        reference_contact: formData.referenceContact.trim() || "",
        epf_no: formData.epfNo.trim() || "",
        contract_type: formData.contractType.trim() || "",
        basic_salary: parseFloat(formData.basicSalary) || 0,
        work_shift: formData.workShift.trim() || "",
        work_location: formData.workLocation.trim() || "",
        date_of_leaving: cleanDate(formData.dateOfLeaving),
        casual_leave: parseInt(formData.casualLeave) || 0,
        privilege_leave: parseInt(formData.privilegeLeave) || 0,
        sick_leave: parseInt(formData.sickLeave) || 0,
        maternity_leave: parseInt(formData.maternityLeave) || 0,
        paternity_leave: parseInt(formData.paternityLeave) || 0,
        fever_leave: parseInt(formData.feverLeave) || 0,
        account_title: formData.accountTitle.trim() || "",
        bank_account_number: formData.bankAccountNumber.trim() || "",
        bank_name: formData.bankName.trim() || "",
        ifsc_code: formData.ifscCode.trim() || "",
        bank_branch_name: formData.bankBranchName.trim() || "",
        socia_media_links: {
          facebook: formData.facebook.trim() || "",
          twitter: formData.twitter.trim() || "",
          linkedin: formData.linkedin.trim() || "",
          instagram: formData.instagram.trim() || "",
        }
      };

      console.log("Payload to send:", dataToSend); // For debugging

      await updateAdminProfile(profile.id, dataToSend);
      alert('Profile updated successfully!');
      if (onSave) onSave();
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response && error.response.data) {
        console.error('Validation errors:', error.response.data);
        alert('Validation errors: ' + JSON.stringify(error.response.data));
      } else {
        alert('Failed to update profile. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[95%] max-w-6xl rounded shadow-lg">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-3 border-b">
          <h3 className="font-semibold text-lg">Basic Information</h3>
          <button onClick={onClose}><X /></button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[75vh] overflow-y-auto"
        >

          {/* ================= BASIC INFORMATION (UNCHANGED) ================= */}
         {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Field label="Staff ID">
              <input name="staffId" value={formData.staffId} onChange={handleChange} className="input" />
            </Field>

            <Field label="Role">
              <select name="role" value={formData.role} onChange={handleChange} className="input">
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
              <select name="designation" value={formData.designation} onChange={handleChange} className="input">
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
  <select
    name="department"
    value={formData.department}
    onChange={handleChange}
    className="input"
  >
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
              <select name="specialist" className="input">
                <option>Select Specialist</option>
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
                <option>Divorced</option>
                <option>Widowed</option>
                <option >Seprated</option>
                <option>No Seprated</option>

              </select>
            </Field>

            <Field label="Blood Group">
              <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className="input">
                <option>O+</option>
                <option>A+</option>
                <option>B+</option>
                <option>AB+</option>
                <option>O-</option> 
              </select>
            </Field>

            <Field label="Date of Birth">
              <input type="date" name="dob" value={formData.dob || ''} onChange={handleChange} className="input" />
            </Field>
          </div>

          {/* Dates & Contact */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Field label="Date of Joining">
              <input type="date" name="doj" value={formData.doj || ''} onChange={handleChange} className="input" />
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

          
          {/* ================= ADD MORE DETAILS TOGGLE ================= */}
          <div
            onClick={() => setShowMoreDetails(!showMoreDetails)}
            className="border rounded px-4 py-3 flex justify-between items-center text-sm text-gray-700 cursor-pointer bg-gray-50"
          >
            <span className="font-medium">Add More Details</span>
            {showMoreDetails ? <Minus size={16} /> : <Plus size={16} />}
          </div>

          {/* ================= ADD MORE DETAILS SECTION ================= */}
          {showMoreDetails && (
            <div className="space-y-8 border rounded p-4">

              {/* PAYROLL */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Payroll</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="EPF No">
                    <input name="epfNo" value={formData.epfNo} onChange={handleChange} className="input" />
                  </Field>
                  <Field label="Contract Type">
                    <select name="contractType" value={formData.contractType} onChange={handleChange} className="input">
                      <option>Permanent</option>
                      <option>Contract</option>
                    </select>
                  </Field>
                  <Field label="Basic Salary">
                    <input name="basicSalary" value={formData.basicSalary} onChange={handleChange} className="input" />
                  </Field>
                  <Field label="Work Shift">
                    <input name="workShift" value={formData.workShift} onChange={handleChange} className="input" />
                  </Field>
                  <Field label="Work Location">
                    <input name="workLocation" value={formData.workLocation} onChange={handleChange} className="input" />
                  </Field>
                  <Field label="Date Of Leaving">
                    <input type="date" name="dateOfLeaving" value={formData.dateOfLeaving || ''} onChange={handleChange} className="input" />
                  </Field>
                </div>
              </div>

              {/* LEAVE */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Leave</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Casual Leave"><input name="casualLeave" value={formData.casualLeave} onChange={handleChange} className="input" /></Field>
                  <Field label="Privilege Leave"><input name="privilegeLeave" value={formData.privilegeLeave} onChange={handleChange} className="input" /></Field>
                  <Field label="Sick Leave"><input name="sickLeave" value={formData.sickLeave} onChange={handleChange} className="input" /></Field>
                  <Field label="Maternity Leave"><input name="maternityLeave" value={formData.maternityLeave} onChange={handleChange} className="input" /></Field>
                  <Field label="Paternity Leave"><input name="paternityLeave" value={formData.paternityLeave} onChange={handleChange} className="input" /></Field>
                  <Field label="Fever Leave"><input name="feverLeave" value={formData.feverLeave} onChange={handleChange} className="input" /></Field>
                </div>
              </div>

              {/* BANK */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Bank Account Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Account Title"><input name="accountTitle" value={formData.accountTitle} onChange={handleChange} className="input" /></Field>
                  <Field label="Bank Account Number"><input name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} className="input" /></Field>
                  <Field label="Bank Name"><input name="bankName" value={formData.bankName} onChange={handleChange} className="input" /></Field>
                  <Field label="IFSC Code"><input name="ifscCode" value={formData.ifscCode} onChange={handleChange} className="input" /></Field>
                  <Field label="Bank Branch Name"><input name="bankBranchName" value={formData.bankBranchName} onChange={handleChange} className="input" /></Field>
                </div>
              </div>

              {/* SOCIAL MEDIA */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Social Media Links</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Facebook URL"><input name="facebook" value={formData.facebook} onChange={handleChange} className="input" /></Field>
                  <Field label="Twitter URL"><input name="twitter" value={formData.twitter} onChange={handleChange} className="input" /></Field>
                  <Field label="LinkedIn URL"><input name="linkedin" value={formData.linkedin} onChange={handleChange} className="input" /></Field>
                  <Field label="Instagram URL"><input name="instagram" value={formData.instagram} onChange={handleChange} className="input" /></Field>
                </div>
              </div>

              {/* DOCUMENTS */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Upload Documents</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Resume"><input type="file" className="input" /></Field>
                  <Field label="Joining Letter"><input type="file" className="input" /></Field>
                  <Field label="Resignation Letter"><input type="file" className="input" /></Field>
                  <Field label="Other Documents"><input type="file" className="input" /></Field>
                </div>
              </div>

            </div>
          )}

          {/* FOOTER */}
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
