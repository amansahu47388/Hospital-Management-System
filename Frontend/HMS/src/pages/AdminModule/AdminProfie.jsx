import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";

import ProfileHeader from "../../components/AdminComponent/ProfileHeader";
import ProfileInfoGrid from "../../components/AdminComponent/ProfileInfoGrid";
import ProfileTabs from "../../components/AdminComponent/ProfileTabs";
import ProfileSection from "../../components/AdminComponent/ProfileSection";
import ProfileRow from "../../components/AdminComponent/ProfileRow";
import useAdminProfile from "../../hooks/useAdminProfile";

const AdminProfile = () => {
  const { profile, loading, error, refreshProfile } = useAdminProfile();
  const [activeTab, setActiveTab] = useState("Profile");

  if (loading) {
    return (
      <AdminLayout>
        <div className="w-full bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">Loading profile...</div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="w-full bg-white rounded-lg shadow-sm p-6">
          <div className="text-center text-red-500">Error loading profile: {error.message}</div>
        </div>
      </AdminLayout>
    );
  }

  if (!profile) {
    return (
      <AdminLayout>
        <div className="w-full bg-white rounded-lg shadow-sm p-6">
          <div className="text-center">No profile found</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="w-full bg-white rounded-lg shadow-sm p-6 space-y-6">

        <ProfileHeader profile={profile} refreshProfile={refreshProfile} />
        <ProfileInfoGrid profile={profile} />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "Profile" && (
          <div className="space-y-6">

            <ProfileSection title="Personal Information">
              <ProfileRow label="Phone" value={profile.personal?.phone || 'N/A'} />
              <ProfileRow label="Emergency Contact" value={profile.personal?.emergencyPhone || 'N/A'} />
              <ProfileRow label="Email" value={profile.personal?.email || 'N/A'} />
              <ProfileRow label="Gender" value={profile.personal?.gender || 'N/A'} />
              <ProfileRow label="Blood Group" value={profile.personal?.bloodGroup || 'N/A'} />
              <ProfileRow label="Date of Birth" value={profile.personal?.dob || 'N/A'} />
              <ProfileRow label="Marital Status" value={profile.personal?.maritalStatus || 'N/A'} />
              <ProfileRow label="Father Name" value={profile.personal?.fatherName || 'N/A'} />
              <ProfileRow label="Mother Name" value={profile.personal?.motherName || 'N/A'} />
              <ProfileRow label="Current Address" value={profile.personal?.currentAddress || 'N/A'} />
              <ProfileRow label="Permanent Address" value={profile.personal?.permanentAddress || 'N/A'} />
            </ProfileSection>

            <ProfileSection title="Professional Information">
              <ProfileRow label="Qualification" value={profile.professional?.qualification || 'N/A'} />
              <ProfileRow label="Experience (Years)" value={profile.professional?.experience || 'N/A'} />
              <ProfileRow label="Specialization" value={profile.professional?.specialization || 'N/A'} />
              <ProfileRow label="Department" value={profile.job?.department || 'N/A'} />
              <ProfileRow label="Work Shift" value={profile.payroll?.workShift || 'N/A'} />
              <ProfileRow label="Work Location" value={profile.payroll?.workLocation || 'N/A'} />
            </ProfileSection>

            <ProfileSection title="Identification">
              <ProfileRow label="PAN Number" value={profile.identification?.pan || 'N/A'} />
              <ProfileRow label="National ID" value={profile.identification?.nationalId || 'N/A'} />
              <ProfileRow label="Local ID" value={profile.identification?.localId || 'N/A'} />
              <ProfileRow label="Reference Contact" value={profile.identification?.referenceContact || 'N/A'} />
            </ProfileSection>

            <ProfileSection title="Payroll Information">
              <ProfileRow label="EPF No" value={profile.payroll?.epfNo || 'N/A'} />
              <ProfileRow label="Contract Type" value={profile.payroll?.contractType || 'N/A'} />
              <ProfileRow label="Basic Salary" value={profile.payroll?.basicSalary || 'N/A'} />
              <ProfileRow label="Date Of Leaving" value={profile.payroll?.dateOfLeaving || 'N/A'} />
            </ProfileSection>

            <ProfileSection title="Leave Information">
              <ProfileRow label="Casual Leave" value={profile.leave?.casualLeave || 'N/A'} />
              <ProfileRow label="Privilege Leave" value={profile.leave?.privilegeLeave || 'N/A'} />
              <ProfileRow label="Sick Leave" value={profile.leave?.sickLeave || 'N/A'} />
              <ProfileRow label="Maternity Leave" value={profile.leave?.maternityLeave || 'N/A'} />
              <ProfileRow label="Paternity Leave" value={profile.leave?.paternityLeave || 'N/A'} />
              <ProfileRow label="Fever Leave" value={profile.leave?.feverLeave || 'N/A'} />
            </ProfileSection>

            <ProfileSection title="Bank Account Details">
              <ProfileRow label="Account Title" value={profile.bank?.accountTitle || 'N/A'} />
              <ProfileRow label="Bank Account Number" value={profile.bank?.bankAccountNumber || 'N/A'} />
              <ProfileRow label="Bank Name" value={profile.bank?.bankName || 'N/A'} />
              <ProfileRow label="IFSC Code" value={profile.bank?.ifscCode || 'N/A'} />
              <ProfileRow label="Bank Branch Name" value={profile.bank?.bankBranchName || 'N/A'} />
            </ProfileSection>

            <ProfileSection title="Social Media Links">
              <ProfileRow label="Facebook" value={profile.social?.facebook || 'N/A'} />
              <ProfileRow label="Twitter" value={profile.social?.twitter || 'N/A'} />
              <ProfileRow label="LinkedIn" value={profile.social?.linkedin || 'N/A'} />
              <ProfileRow label="Instagram" value={profile.social?.instagram || 'N/A'} />
            </ProfileSection>

          </div>
        )}

      </div>

    </AdminLayout>
  );
};

export default AdminProfile;
