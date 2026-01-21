import Sidebar from "../components/CommonComponent/Sidebar";
import Navbar from "../components/AdminComponent/Navbar";

const PatientLayout = ({ children }) => {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">

            {/* Sidebar for Patient */}
            <Sidebar role="patient" />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar role="patient" />
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    {children}
                </div>
            </div>

        </div>
    );
};

export default PatientLayout;
