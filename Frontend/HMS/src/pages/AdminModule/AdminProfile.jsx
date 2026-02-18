import AdminLayout from "../../layout/AdminLayout";
import ProfileHeader from "../../components/AdminComponent/ProfileHeader";
import ProfileInfoGrid from "../../components/AdminComponent/ProfileInfoGrid";
import ProfileSection from "../../components/AdminComponent/ProfileSection";
import ProfileRow from "../../components/AdminComponent/ProfileRow";
import useAdminProfile from "../../hooks/useAdminProfile";

const AdminProfile = () => {
  const { profile, loading, error, refreshProfile } = useAdminProfile();

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

      <div className="w-full bg-white rounded shadow p-6 space-y-6">

        <ProfileHeader profile={profile} refreshProfile={refreshProfile} />
        <ProfileInfoGrid profile={profile} />
            <ProfileSection title="Personal Information">
              <ProfileRow label="Phone" value={profile.personal?.phone} />
              <ProfileRow label="Emergency Contact" value={profile.personal?.emergencyPhone} />
              <ProfileRow label="Email" value={profile.personal?.email} />
              <ProfileRow label="Gender" value={profile.personal?.gender} />
              <ProfileRow label="Blood Group" value={profile.personal?.bloodGroup} />
              <ProfileRow label="Date of Birth" value={profile.personal?.dob} />
              <ProfileRow label="Marital Status" value={profile.personal?.maritalStatus} />
              <ProfileRow label="Father Name" value={profile.personal?.fatherName} />
              <ProfileRow label="Mother Name" value={profile.personal?.motherName} />
              <ProfileRow label="Current Address" value={profile.personal?.currentAddress} />
              <ProfileRow label="Permanent Address" value={profile.personal?.permanentAddress} />
            </ProfileSection>

            <ProfileSection title="Professional Information">
              <ProfileRow label="Qualification" value={profile.professional?.qualification} />
              <ProfileRow label="Experience (Years)" value={profile.professional?.experience} />
              <ProfileRow label="Specialization" value={profile.professional?.specialization} />
              <ProfileRow label="Department" value={profile.job?.department} />
              <ProfileRow label="Work Shift" value={profile.payroll?.workShift} />
              <ProfileRow label="Work Location" value={profile.payroll?.workLocation} />
            </ProfileSection>

            <ProfileSection title="Identification">
              <ProfileRow label="PAN Number" value={profile.identification?.pan} />
              <ProfileRow label="National ID" value={profile.identification?.nationalId} />
              <ProfileRow label="Local ID" value={profile.identification?.localId} />
              <ProfileRow label="Reference Contact" value={profile.identification?.referenceContact} />
            </ProfileSection>

            <ProfileSection title="Payroll Information">
              <ProfileRow label="EPF No" value={profile.payroll?.epfNo} />
              <ProfileRow label="Contract Type" value={profile.payroll?.contractType} />
              <ProfileRow label="Basic Salary" value={profile.payroll?.basicSalary} />
              <ProfileRow label="Date Of Leaving" value={profile.payroll?.dateOfLeaving} />
            </ProfileSection>

            <ProfileSection title="Leave Information">
              <ProfileRow label="Casual Leave" value={profile.leave?.casualLeave} />
              <ProfileRow label="Privilege Leave" value={profile.leave?.privilegeLeave} />
              <ProfileRow label="Sick Leave" value={profile.leave?.sickLeave} />
              <ProfileRow label="Maternity Leave" value={profile.leave?.maternityLeave} />
              <ProfileRow label="Paternity Leave" value={profile.leave?.paternityLeave} />
              <ProfileRow label="Fever Leave" value={profile.leave?.feverLeave} />
            </ProfileSection>

            <ProfileSection title="Bank Account Details">
              <ProfileRow label="Account Title" value={profile.bank?.accountTitle} />
              <ProfileRow label="Bank Account Number" value={profile.bank?.bankAccountNumber} />
              <ProfileRow label="Bank Name" value={profile.bank?.bankName} />
              <ProfileRow label="IFSC Code" value={profile.bank?.ifscCode} />
              <ProfileRow label="Bank Branch Name" value={profile.bank?.bankBranchName} />
            </ProfileSection>

            <ProfileSection title="Social Media Links">
              <ProfileRow label="Facebook" value={profile.social?.facebook} />
              <ProfileRow label="Twitter" value={profile.social?.twitter} />
              <ProfileRow label="LinkedIn" value={profile.social?.linkedin} />
              <ProfileRow label="Instagram" value={profile.social?.instagram} />
            </ProfileSection>
      </div>

    </AdminLayout>
  );
};

export default AdminProfile;
