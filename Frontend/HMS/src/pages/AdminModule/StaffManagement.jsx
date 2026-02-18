import React, { useState, useEffect } from "react";
import {
    Plus, Search, Pencil, Trash2, Power, Mail, Eye,
    UserCheck, UserX, RefreshCw
} from "lucide-react";
import { getStaffList, deleteStaff, toggleStaffActive, resendInvitation } from "../../api/staffApi";
import { useNotify } from "../../context/NotificationContext";
import AdminLayout from "../../layout/AdminLayout";
import AddStaffModal from "../../components/AdminComponent/AddStaffModal";
import EditStaffModal from "../../components/AdminComponent/EditStaffModal";
import StaffDetailsModal from "../../components/AdminComponent/StaffDetailsModal";

export default function StaffManagement() {
    const notify = useNotify();
    const [staffList, setStaffList] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterRole, setFilterRole] = useState("all");
    const [filterStatus, setFilterStatus] = useState("all");

    // Modals
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const roles = [
        "doctor", "pharmacist", "pathologist", "radiologist",
        "accountant", "receptionist", "nurse"
    ];

    useEffect(() => {
        loadStaffList();
    }, []);

    useEffect(() => {
        filterStaffList();
    }, [searchTerm, filterRole, filterStatus, staffList]);

    const loadStaffList = async () => {
        setLoading(true);
        try {
            const data = await getStaffList();
            setStaffList(data);
        } catch (error) {
            console.error("Error loading staff:", error);
            notify("error", error.response?.data?.error || "Failed to load staff list");
        } finally {
            setLoading(false);
        }
    };

    const filterStaffList = () => {
        let filtered = [...staffList];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(staff =>
                staff.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                staff.phone?.includes(searchTerm)
            );
        }

        // Role filter
        if (filterRole !== "all") {
            filtered = filtered.filter(staff => staff.role === filterRole);
        }

        // Status filter
        if (filterStatus === "active") {
            filtered = filtered.filter(staff => staff.is_active);
        } else if (filterStatus === "inactive") {
            filtered = filtered.filter(staff => !staff.is_active);
        } else if (filterStatus === "first_login") {
            filtered = filtered.filter(staff => staff.is_first_login);
        }

        setFilteredStaff(filtered);
    };

    const handleDelete = async (staff) => {
        if (!window.confirm(`Are you sure you want to delete ${staff.full_name}?`)) {
            return;
        }

        try {
            const response = await deleteStaff(staff.id);
            notify("success", response.message || "Staff deleted successfully");
            loadStaffList();
        } catch (error) {
            notify("error", error.response?.data?.error || "Failed to delete staff");
        }
    };

    const handleToggleActive = async (staff) => {
        try {
            const response = await toggleStaffActive(staff.id);
            notify("success", response.message || "Status updated successfully");
            loadStaffList();
        } catch (error) {
            notify("error", error.response?.data?.error || "Failed to update status");
        }
    };

    const handleResendInvitation = async (staff) => {
        try {
            const response = await resendInvitation(staff.id);
            notify("success", response.message || "Invitation sent successfully");

            // Show temporary password in a modal or alert
            if (response.temporary_password) {
                alert(`Temporary Password: ${response.temporary_password}\n\nThis password has been sent to ${staff.email}`);
            }
        } catch (error) {
            notify("error", error.response?.data?.error || "Failed to send invitation");
        }
    };

    const handleEdit = (staff) => {
        setSelectedStaff(staff);
        setShowEditModal(true);
    };

    const handleViewDetails = (staff) => {
        setSelectedStaff(staff);
        setShowDetailsModal(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    return (
        <AdminLayout>
            <div className="p-6 bg-gray-50 min-h-screen">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-2">Staff Management</h1>
                </div>

                 {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6 shadow">
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <p className="text-gray-600 text-sm">Total Staff</p>
                        <p className="text-2xl font-bold text-gray-800">{staffList.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 shadow">
                        <p className="text-gray-600 text-sm">Active</p>
                        <p className="text-2xl font-bold text-green-600">
                            {staffList.filter(s => s.is_active).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 shadow">
                        <p className="text-gray-600 text-sm">Inactive</p>
                        <p className="text-2xl font-bold text-red-600">
                            {staffList.filter(s => !s.is_active).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-4 shadow">
                        <p className="text-gray-600 text-sm">Pending First Login</p>
                        <p className="text-2xl font-bold text-orange-600">
                            {staffList.filter(s => s.is_first_login).length}
                        </p>
                    </div>
                </div>

                {/* Filters and Actions */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6 mt-2 shadow">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search staff..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] focus:border-[#6046B5] outline-none"
                            />
                        </div>

                        {/* Role Filter */}
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] focus:border-[#6046B5] outline-none"
                        >
                            <option value="all">All Roles</option>
                            {roles.map(role => (
                                <option key={role} value={role}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </option>
                            ))}
                        </select>

                        {/* Status Filter */}
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-[#6046B5] focus:border-[#6046B5] outline-none"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                            <option value="first_login">Pending First Login</option>
                        </select>

                        {/* Add Staff Button */}
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center justify-center gap-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded-lg transition-all shadow-md"
                        >
                            <Plus size={20} />
                            Add Staff
                        </button>
                    </div>
                </div>

                {/* Staff Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="animate-spin text-purple-600" size={32} />
                        </div>
                    ) : filteredStaff.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">No staff members found</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs text-gray-600 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs  text-gray-600 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs  text-gray-600 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs  text-gray-600 uppercase tracking-wider">
                                            Department
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs  text-gray-600 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs  text-gray-600 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs  text-gray-600 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredStaff.map((staff) => (
                                        <tr key={staff.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                        <span className="text-purple-600 font-semibold">
                                                            {staff.full_name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">{staff.full_name}</p>
                                                        {staff.is_first_login && (
                                                            <p className="text-xs text-orange-600">Pending first login</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {staff.email}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {staff.department || "N/A"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {staff.is_active ? (
                                                    <span className="flex items-center gap-1 text-green-600 text-sm">
                                                        <UserCheck size={16} />
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center gap-1 text-red-600 text-sm">
                                                        <UserX size={16} />
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(staff.created_at)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleViewDetails(staff)}
                                                        className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                                                        title="View Details"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEdit(staff)}
                                                        className="text-green-600 hover:bg-green-100 p-1 rounded"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleActive(staff)}
                                                        className={staff.is_active ? "text-orange-600 hover:bg-orange-100 p-1 rounded" : "text-green-600 hover:bg-green-100 p-1 rounded"}
                                                        title={staff.is_active ? "Deactivate" : "Activate"}
                                                    >
                                                        <Power size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleResendInvitation(staff)}
                                                        className="text-purple-600 hover:bg-purple-100 p-1 rounded"
                                                        title="Resend Invitation"
                                                    >
                                                        <Mail size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(staff)}
                                                        className="text-red-600 hover:bg-red-100 p-1 rounded"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Modals */}
                {showAddModal && (
                    <AddStaffModal
                        onClose={() => setShowAddModal(false)}
                        onSuccess={() => {
                            setShowAddModal(false);
                            loadStaffList();
                        }}
                    />
                )}

                {showEditModal && selectedStaff && (
                    <EditStaffModal
                        staff={selectedStaff}
                        onClose={() => {
                            setShowEditModal(false);
                            setSelectedStaff(null);
                        }}
                        onSuccess={() => {
                            setShowEditModal(false);
                            setSelectedStaff(null);
                            loadStaffList();
                        }}
                    />
                )}

                {showDetailsModal && selectedStaff && (
                    <StaffDetailsModal
                        staff={selectedStaff}
                        onClose={() => {
                            setShowDetailsModal(false);
                            setSelectedStaff(null);
                        }}
                        onResendInvitation={() => {
                            handleResendInvitation(selectedStaff);
                            setShowDetailsModal(false);
                            setSelectedStaff(null);
                        }}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
