const ProfileSection = ({ title, children }) => {
  return (
    <div className="border border-gray-300 rounded-lg shadow-sm">
      <div className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] px-4 py-2 font-semibold text-xl text-white rounded-t-lg">
        {title}
      </div>
      <div className="p-4 bg-white">{children}</div>
    </div>
  );
};

export default ProfileSection;
