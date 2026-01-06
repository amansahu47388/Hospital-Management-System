const InfoItem = ({ label, value }) => {
  return (
    <div className="border-r border-gray-400 last:border-r-0 px-4 py-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
  );
};

const ProfileInfoGrid = ({ profile }) => {
  return (
    <div className="border border-gray-400 rounded-lg shadow-sm mt-4 overflow-hidden bg-white">

      {/* ROW 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-400">
        <InfoItem label="Department" value={profile.job?.department || 'N/A'} />
        <InfoItem label="Specialist" value={profile.job?.specialist || 'N/A'} />
        <InfoItem label="EPF No" value={profile.payroll?.epfNo || 'N/A'} />
        <InfoItem label="Basic Salary" value={profile.payroll?.basicSalary || 'N/A'} />
      </div>

      {/* ROW 2 */}
      <div className="grid grid-cols-1 md:grid-cols-4 border-b border-gray-400">
        <InfoItem label="Contract Type" value={profile.payroll?.contractType || 'N/A'} />
        <InfoItem label="Work Shift" value={profile.payroll?.workShift || 'N/A'} />
        <InfoItem label="Work Location" value={profile.payroll?.workLocation || 'N/A'} />
        <InfoItem label="Date Of Joining" value={profile.job?.dateOfJoining || 'N/A'} />
      </div>

      {/* ROW 3 */}
      <div className="grid grid-cols-1 md:grid-cols-4">
        <InfoItem label="Date Of Leaving" value={profile.payroll?.dateOfLeaving || 'N/A'} />
        <InfoItem label="Staff ID" value={profile.staffId || 'N/A'} />
        <InfoItem label="Qualification" value={profile.professional?.qualification || 'N/A'} />
        <InfoItem label="Experience" value={`${profile.professional?.experience || 0} years`} />
      </div>

    </div>
  );
};;

export default ProfileInfoGrid;
