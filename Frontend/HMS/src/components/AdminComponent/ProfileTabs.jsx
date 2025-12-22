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
    <div className="flex gap-6 border-b border-gray-200 mt-6 text-md">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`pb-2 px-1 transition-colors duration-200 ${
            activeTab === tab
              ? "border-b-2 border-[#6046B5] font-semibold text-[#6046B5]"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};;

export default ProfileTabs;
