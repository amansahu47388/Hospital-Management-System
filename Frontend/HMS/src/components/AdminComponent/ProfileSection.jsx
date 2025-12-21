const ProfileSection = ({ title, children }) => {
  return (
    <div className="border rounded">
      <div className="bg-gray-100 px-4 py-2 font-semibold text-sm">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
};

export default ProfileSection;
