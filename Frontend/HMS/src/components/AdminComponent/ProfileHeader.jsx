const ProfileHeader = ({ profile }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between border-gray-300 pb-6">

      {/* Left */}
      <div className="flex items-center gap-4">
        <img
          src={profile.avatar}
          alt="profile"
          className="w-20 h-20 rounded-full object-cover"
        />

        <div>
          <h2 className="text-xl font-semibold">{profile.name}</h2>
          <p className="text-sm text-gray-500">{profile.role}</p>
        </div>
      </div>

      {/* Right */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-4 md:mt-0 text-sm">
        <div>
          <p className="text-gray-500">Staff ID</p>
          <p className="font-medium">{profile.staffId}</p>
        </div>
        <div>
          <p className="text-gray-500">Designation</p>
          <p className="font-medium">{profile.designation}</p>
        </div>
        <div>
          <p className="text-gray-500">Barcode</p>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
        <div>
          <p className="text-gray-500">QR Code</p>
          <div className="h-8 w-8 bg-gray-200 rounded"></div>
        </div>
      </div>

    </div>
  );
};

export default ProfileHeader;
