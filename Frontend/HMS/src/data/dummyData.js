export const stats = [
  { id: 1, title: "Total Patients", value: 2120, icon: "users" },
  { id: 2, title: "Total Doctors", value: 120, icon: "stethoscope" },
  { id: 3, title: "Total Wards", value: 12, icon: "building" },
  { id: 4, title: "Total Labs", value: 20, icon: "flask" },
];

export const chartSeries = [
  { date: "2023-09-01", patients: 1200 },
  { date: "2023-09-05", patients: 1700 },
  { date: "2023-09-10", patients: 2212 },
  { date: "2023-09-15", patients: 1800 },
  { date: "2023-09-20", patients: 2000 },
  { date: "2023-09-25", patients: 1500 },
  { date: "2023-09-30", patients: 1800 },
];

export const doctors = [
  { id: 1, name: "Dr. Sam", mobile: "0785553221", address: "Kolkata", fee: 2500, education: "MBBS", dob: "1980-04-01", status: "online" },
  { id: 2, name: "John", mobile: "072745894", address: "Kandy", fee: 2500, education: "PhD", dob: "1975-03-12", status: "offline" },
  { id: 3, name: "David", mobile: "074526892", address: "Galle", fee: 2500, education: "MBBS", dob: "1986-07-21", status: "online" },
  { id: 4, name: "Christiano", mobile: "076476789", address: "Matara", fee: 2500, education: "MBBS", dob: "1990-05-03", status: "offline" },
];

export const stock = [
  { id: 1, drug: "Vitamin C", expire: "2025-04-13", mfr: "2021-12-13", price: 1500, qty: 150 },
  { id: 2, drug: "Paracetamol", expire: "2024-12-01", mfr: "2021-01-01", price: 50, qty: 200 },
];

export const appointments = [
  { id: 1, name: "Chance Vancaro", date: "10.01.2023", status: "pending" },
  { id: 2, name: "Desiree Kenter", date: "04.12.2023", status: "rejected" },
  { id: 3, name: "Pailyn Lubin", date: "10.01.2023", status: "pending" },
  { id: 4, name: "Phillip Bator", date: "04.12.2023", status: "pending" },
  { id: 5, name: "Emerson Stanton", date: "04.12.2023", status: "accepted" },
];


// Existing data...

export const appointments_data= [
  {
    patient_name: "John Doe",
    appointment_no: "APP001",
    created_by: "Admin",
    appointment_date: "2023-10-01",
    phone: "1234567890",
    gender: "Male",
    doctor: "Dr. Smith",
    source: "Online",
    priority: "High",
    live_consultant: "Yes",
    alternate_address: "123 Main St",
    fees: 100,
    discount: 10,
    paid: 90,
    status: "Confirmed",
  },
  {
    patient_name: "Jane Smith",
    appointment_no: "APP002",
    created_by: "Receptionist",
    appointment_date: "2023-10-02",
    phone: "0987654321",
    gender: "Female",
    doctor: "Dr. Johnson",
    source: "Walk-in",
    priority: "Medium",
    live_consultant: "No",
    alternate_address: "456 Elm St",
    fees: 150,
    discount: 0,
    paid: 150,
    status: "Pending",
  },
  // Add more as needed
];