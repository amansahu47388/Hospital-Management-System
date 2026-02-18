const ProfileRow = ({ label, value }) => {
  return (
    <div className="grid grid-cols-2 border-b border-gray-300 py-2 ">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
};

export default ProfileRow;