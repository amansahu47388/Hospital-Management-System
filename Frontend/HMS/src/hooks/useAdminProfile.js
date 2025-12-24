import { useState } from "react";

const useAdminProfile = () => {
  const [profile] = useState({
    name: "Sonia Bush",
    role: "Doctor",
    designation: "Doctor",
    staffId: "9002",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",

    job: {
      department: "OT",
      specialist: "Cardiologists",
      epfNo: "16545645",
      basicSalary: "30000",
      contractType: "Permanent",
      workShift: "Day Time",
      workLocation: "1st Floor",
      dateOfJoining: "07/07/2013",
    },

    personal: {
      phone: "96464644341",
      emergencyPhone: "96464644341",
      email: "sonia@gmail.com",
      gender: "Female",
      bloodGroup: "O+",
      dob: "02/10/1999",
      maritalStatus: "Single",
      fatherName: "William Bush",
      motherName: "Ana Bush",
    },

    professional: {
      qualification: "MS",
      experience: "6",
      specialization: "Neurology",
    },

    identification: {
      pan: "HGHJ86879",
      nationalId: "985834937",
    },
  });

  return { profile };
};

export default useAdminProfile;
