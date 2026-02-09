import Sidebar from "../components/CommonComponent/Sidebar";  // adjust path
import Navbar from "../components/AdminComponent/Navbar";     // adjust path
import { useAuth } from "../context/AuthContext";

const AdminLayout = ({ children }) => {
  const { user } = useAuth();
  const userRole = user?.role || "admin"; // Get role from logged-in user

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">

      {/* Sidebar */}
      <Sidebar role={userRole} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar role="admin" />
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </div>
      </div>

    </div>
  );
};

export default AdminLayout;