import { useState, useEffect, useCallback } from "react";
import { getAdminProfiles } from "../api/adminApi";

const useAdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAdminProfiles();
      if (response.data.length > 0) {
        const adminProfile = response.data[0];
        setProfile({
          id: adminProfile.id,
          name: adminProfile.full_name,
          role: "Admin",
          designation: adminProfile.designation,
          staffId: adminProfile.staff_id,
          avatar: adminProfile.profile_picture || "https://randomuser.me/api/portraits/women/44.jpg",

          job: {
            department: adminProfile.department,
            specialist: adminProfile.specialist,
            epfNo: adminProfile.epf_no,
            basicSalary: adminProfile.basic_salary,
            contractType: adminProfile.contract_type,
            workShift: adminProfile.work_shift,
            workLocation: adminProfile.work_location,
            dateOfJoining: adminProfile.date_of_joining,
            dateOfLeaving: adminProfile.date_of_leaving,
          },

          personal: {
            phone: adminProfile.phone,
            emergencyPhone: adminProfile.emergency_contact,
            email: adminProfile.email,
            gender: adminProfile.gender,
            bloodGroup: adminProfile.blood_group,
            dob: adminProfile.date_of_birth,
            maritalStatus: adminProfile.merital_status,
            fatherName: adminProfile.father_name,
            motherName: adminProfile.mother_name,
            currentAddress: adminProfile.current_address,
            permanentAddress: adminProfile.permanent_address,
          },

          professional: {
            qualification: adminProfile.qualifications,
            experience: adminProfile.experience_years,
            specialization: adminProfile.specialist,
          },

          identification: {
            pan: adminProfile.pan_number,
            nationalId: adminProfile.national_id,
            localId: adminProfile.local_id,
            referenceContact: adminProfile.reference_contact,
          },

          payroll: {
            epfNo: adminProfile.epf_no,
            contractType: adminProfile.contract_type,
            basicSalary: adminProfile.basic_salary,
            workShift: adminProfile.work_shift,
            workLocation: adminProfile.work_location,
            dateOfLeaving: adminProfile.date_of_leaving,
          },

          leave: {
            casualLeave: adminProfile.casual_leave,
            privilegeLeave: adminProfile.privilege_leave,
            sickLeave: adminProfile.sick_leave,
            maternityLeave: adminProfile.maternity_leave,
            paternityLeave: adminProfile.paternity_leave,
            feverLeave: adminProfile.fever_leave,
          },

          bank: {
            accountTitle: adminProfile.account_title,
            bankAccountNumber: adminProfile.bank_account_number,
            bankName: adminProfile.bank_name,
            ifscCode: adminProfile.ifsc_code,
            bankBranchName: adminProfile.bank_branch_name,
          },

          social: adminProfile.socia_media_links || {},
        });
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refreshProfile = () => {
    fetchProfile();
  };

  return { profile, loading, error, refreshProfile };
};

export default useAdminProfile;


