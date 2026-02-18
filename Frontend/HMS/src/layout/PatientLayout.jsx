import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/CommonComponent/Sidebar";
import PatientNavbar from "../components/Patient_module/PatientNavbar";
import { useAuth } from "../context/AuthContext";

const PatientLayout = ({ children }) => {
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Automatically logout then navigate to login page if user state is empty
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    // Don't render layout if user is not authenticated to prevent flickering
    if (!user) return null;

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Sidebar for Patient */}
            <Sidebar role="patient" user={user} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <PatientNavbar />
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PatientLayout;
