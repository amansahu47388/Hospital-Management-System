import React from "react";
import { X, Mail, Calendar, User, Shield, Clock } from "lucide-react";

export default function StaffDetailsModal({ staff, onClose, onResendInvitation }) {
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-3 border-b border-gray-200 sticky top-0 bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">
                    <h2 className="text-xl font-bold text-white">Staff Details</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Profile Section */}
                    <div className="flex items-center gap-4">
                        <div className="h-20 w-20 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-600 font-bold text-2xl">
                                {staff.full_name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{staff.full_name}</h3>
                            <p className="text-gray-600">{staff.role.charAt(0).toUpperCase() + staff.role.slice(1)}</p>
                            <div className="flex items-center gap-2 mt-1">
                                {staff.is_active ? (
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                        Active
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                                        Inactive
                                    </span>
                                )}
                                {staff.is_first_login && (
                                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                        Pending First Login
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Email */}
                        <div className="flex items-start gap-3">
                            <Mail className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="text-gray-800 font-medium">{staff.email}</p>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex items-start gap-3">
                            <User className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="text-gray-800 font-medium">{staff.phone || "N/A"}</p>
                            </div>
                        </div>

                        {/* Department */}
                        <div className="flex items-start gap-3">
                            <Shield className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Department</p>
                                <p className="text-gray-800 font-medium">{staff.department || "N/A"}</p>
                            </div>
                        </div>

                        {/* Created By */}
                        <div className="flex items-start gap-3">
                            <User className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Created By</p>
                                <p className="text-gray-800 font-medium">{staff.created_by_name || "System"}</p>
                            </div>
                        </div>

                        {/* Created At */}
                        <div className="flex items-start gap-3">
                            <Calendar className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Created At</p>
                                <p className="text-gray-800 font-medium">{formatDate(staff.created_at)}</p>
                            </div>
                        </div>

                        {/* Password Changed At */}
                        <div className="flex items-start gap-3">
                            <Clock className="text-gray-400 mt-1" size={20} />
                            <div>
                                <p className="text-sm text-gray-500">Password Last Changed</p>
                                <p className="text-gray-800 font-medium">{formatDate(staff.password_changed_at)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Warning if first login */}
                    {staff.is_first_login && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                            <p className="text-sm text-orange-800">
                                <strong>⚠️ Pending Action:</strong> This staff member has not logged in yet.
                                They need to use their temporary password and change it on first login.
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Close
                        </button>
                        <button
                            onClick={onResendInvitation}
                            className="flex-1 px-4 py-2 bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            <Mail size={18} />
                            Resend Invitation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
