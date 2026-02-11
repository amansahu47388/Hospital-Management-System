import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function PatientProfileHeader() {
    const { user } = useAuth();
    const [patientData, setPatientData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchPatientData();
        }
    }, [user]);

    const fetchPatientData = async () => {
        // Get patient ID from user object
        const patientId = user?.patient_id || user?.id;

        if (!patientId) {
            console.error('❌ No patient ID found in user object:', user);
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('access_token');
            console.log('📡 Fetching patient data for ID:', patientId);

            const response = await axios.get(`${API_BASE_URL}/admin/patients/${patientId}/`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log('✅ Patient data fetched:', response.data);
            setPatientData(response.data);
        } catch (error) {
            console.error('❌ Failed to fetch patient data:', error);
            console.error('Error details:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        if (!dob) return "N/A";
        const birthDate = new Date(dob);
        const today = new Date();
        let years = today.getFullYear() - birthDate.getFullYear();
        let months = today.getMonth() - birthDate.getMonth();
        let days = today.getDate() - birthDate.getDate();

        if (days < 0) {
            months--;
            days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        }
        if (months < 0) {
            years--;
            months += 12;
        }

        return `${years} Year, ${months} Month, ${days} Day`;
    };

    const displayData = {
        name: patientData?.full_name || user?.full_name || "Loading...",
        patientId: patientData?.id || user?.patient_id || user?.id || "N/A",
        gender: patientData?.gender || user?.gender || "N/A",
        phone: patientData?.phone || user?.phone || "N/A",
        email: patientData?.email || user?.email || "N/A",
        address: patientData?.address || user?.address || "N/A",
        age: patientData?.date_of_birth ? calculateAge(patientData.date_of_birth) : "N/A",
        guardianName: patientData?.emergency_contact_name || "N/A",
        bloodGroup: patientData?.blood_group || "N/A"
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6046B5]"></div>
                    <span className="ml-3 text-gray-600">Loading patient data...</span>
                </div>
            ) : (
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left: Avatar and Name */}
                    <div className="flex flex-col items-center justify-center border-r border-gray-100 pr-0 lg:pr-6 min-w-[200px]">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 mb-3 bg-gray-100">
                            {patientData?.photo ? (
                                <img
                                    src={patientData.photo}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = 'https://via.placeholder.com/150/6046B5/ffffff?text=' + (displayData.name?.charAt(0) || 'P');
                                    }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-[#6046B5] text-white text-3xl font-bold">
                                    {displayData.name?.charAt(0) || 'P'}
                                </div>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-800">{displayData.name}</h2>
                    </div>

                    {/* Right: Info Grid */}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-4 gap-x-8 text-sm pt-2">
                        {/* Column 1 */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-400 font-medium mb-1">Patient Id</p>
                                <p className="text-gray-700 font-semibold">{displayData.patientId}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 font-medium mb-1">Gender</p>
                                <p className="text-gray-700 font-semibold">{displayData.gender}</p>
                            </div>
                        </div>

                        {/* Column 2 */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-400 font-medium mb-1">Blood Group</p>
                                <p className="text-gray-700 font-semibold">{displayData.bloodGroup}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 font-medium mb-1">Phone</p>
                                <p className="text-gray-700 font-semibold">{displayData.phone}</p>
                            </div>
                        </div>

                        {/* Column 3 */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-gray-400 font-medium mb-1">Email</p>
                                <p className="text-[#6046B5] font-semibold">{displayData.email}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 font-medium mb-1">Address</p>
                                <p className="text-gray-700 font-semibold leading-relaxed">{displayData.address}</p>
                            </div>
                        </div>

                        {/* Column 4: Age/Guardian + Identifiers */}
                        <div className="space-y-4 border-l border-gray-100 pl-0 lg:pl-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 font-medium mb-1">Age</p>
                                    <p className="text-gray-700 font-semibold">{displayData.age}</p>
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 font-medium mb-1">Guardian Name</p>
                                    <p className="text-gray-700 font-semibold">{displayData.guardianName}</p>
                                </div>
                            </div>
                           
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
