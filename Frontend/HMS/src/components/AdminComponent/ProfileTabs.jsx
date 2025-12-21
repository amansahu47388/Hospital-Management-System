const tabs = [
  "Profile",
  "Payroll",
  "Leaves",
  "Staff Attendance",
  "Documents",
  "Timeline",
];

const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex gap-6 border-b mt-6 text-sm">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 ${
            activeTab === tab
              ? "border-b-2 border-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
