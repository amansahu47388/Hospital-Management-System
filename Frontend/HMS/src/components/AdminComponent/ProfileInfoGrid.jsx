const InfoItem = ({ label, value }) => {
  return (
    <div className="border-r last:border-r-0 px-4 py-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
};

const ProfileInfoGrid = ({ profile }) => {
  return (
    <div className="border rounded-lg shadow-sm mt-4 overflow-hidden bg-white">

      {/* ROW 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-b ">
        <InfoItem label="Department" value={profile.job.department} />
        <InfoItem label="Specialist" value={profile.job.specialist} />
        <InfoItem label="EPF No" value={profile.job.epfNo} />
        <InfoItem label="Basic Salary" value={profile.job.basicSalary} />
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4">
        <InfoItem label="Contract Type" value={profile.job.contractType} />
        <InfoItem label="Work Shift" value={profile.job.workShift} />
        <InfoItem label="Work Location" value={profile.job.workLocation} />
        <InfoItem label="Date Of Joining" value={profile.job.dateOfJoining} />
      </div>

    </div>
  );
};;

export default ProfileInfoGrid;
