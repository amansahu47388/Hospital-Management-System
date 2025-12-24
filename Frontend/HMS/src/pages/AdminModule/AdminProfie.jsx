import { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";

import ProfileHeader from "../../components/AdminComponent/ProfileHeader";
import ProfileInfoGrid from "../../components/AdminComponent/ProfileInfoGrid";
import ProfileTabs from "../../components/AdminComponent/ProfileTabs";
import ProfileSection from "../../components/AdminComponent/ProfileSection";
import ProfileRow from "../../components/AdminComponent/ProfileRow";
import useAdminProfile from "../../hooks/useAdminProfile";

const AdminProfile = () => {
  const { profile } = useAdminProfile();
  const [activeTab, setActiveTab] = useState("Profile");

  return (
    <AdminLayout>

      <div className="w-full bg-white rounded-lg shadow-sm p-6 space-y-6">

        <ProfileHeader profile={profile} />
        <ProfileInfoGrid profile={profile} />
        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "Profile" && (
          <div className="space-y-6">

            <ProfileSection title="Personal Information">
              <ProfileRow label="Phone" value={profile.personal.phone} />
              <ProfileRow label="Emergency Contact" value={profile.personal.emergencyPhone} />
              <ProfileRow label="Email" value={profile.personal.email} />
              <ProfileRow label="Gender" value={profile.personal.gender} />
              <ProfileRow label="Blood Group" value={profile.personal.bloodGroup} />
              <ProfileRow label="Date of Birth" value={profile.personal.dob} />
              <ProfileRow label="Marital Status" value={profile.personal.maritalStatus} />
              <ProfileRow label="Father Name" value={profile.personal.fatherName} />
              <ProfileRow label="Mother Name" value={profile.personal.motherName} />
            </ProfileSection>

            <ProfileSection title="Professional Information">
              <ProfileRow label="Qualification" value={profile.professional.qualification} />
              <ProfileRow label="Experience (Years)" value={profile.professional.experience} />
              <ProfileRow label="Specialization" value={profile.professional.specialization} />
              <ProfileRow label="Department" value={profile.professional.department} />
              <ProfileRow label="Work Shift" value={profile.professional.shift} />
              <ProfileRow label="Work Location" value={profile.professional.location} />
            </ProfileSection>

            <ProfileSection title="Identification">
              <ProfileRow label="PAN Number" value={profile.identification.pan} />
              <ProfileRow label="National ID" value={profile.identification.nationalId} />
            </ProfileSection>

          </div>
        )}

      </div>

    </AdminLayout>
  );
};

export default AdminProfile;
