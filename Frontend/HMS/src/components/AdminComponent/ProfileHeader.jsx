import { Lock, Pencil } from "lucide-react";
import { useState } from "react";
import EditProfileModal from "./EditProfile";
import ChangePasswordModal from "./ChangePasswordModal";

const ProfileHeader = ({ profile }) => {
  const [openEdit, setOpenEdit] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between border-gray-300 pb-6">

        {/* Left */}
        <div className="flex items-center gap-4">
          <img
            src={profile.avatar}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover"
          />

          <div>
            {/* Name + Icons */}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold">{profile.name}</h2>

              {/* 🔒 Lock → Change Password */}
              <button
                title="Change Password"
                className="text-green-600 hover:text-green-700"
                onClick={() => setOpenPassword(true)}
              >
                <Lock size={16} />
              </button>

              {/* ✏️ Pencil → Edit Profile */}
              <button
                title="Edit Profile"
                className="text-green-600 hover:text-green-700"
                onClick={() => setOpenEdit(true)}
              >
                <Pencil size={16} />
              </button>
            </div>

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

      {/* ✏️ Edit Profile Modal */}
      {openEdit && (
        <EditProfileModal
          profile={profile}
          onClose={() => setOpenEdit(false)}
        />
      )}

      {/* 🔒 Change Password Modal */}
      {openPassword && (
        <ChangePasswordModal
          onClose={() => setOpenPassword(false)}
        />
      )}
    </>
  );
};

export default ProfileHeader;
