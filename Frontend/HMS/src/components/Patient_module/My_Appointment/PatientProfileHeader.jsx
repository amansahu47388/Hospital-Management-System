import React from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function PatientProfileHeader() {
    const { user } = useAuth();

    // Mock data for display purposes to match the screenshot
    const displayData = {
        name: user?.full_name || "Olivier Thomas",
        patientId: user?.id || "1",
        maritalStatus: "Married",
        gender: user?.gender || "Male",
        phone: user?.phone || "7896541230",
        email: user?.email || "olivier@gmail.com",
        address: user?.address || "482 Kingsway, Brooklyn West, CA",
        age: "41 Year, 8 Month, 16 Day",
        guardianName: "Edward Thomas",
        bloodGroup: "B+"
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Avatar and Name */}
                <div className="flex flex-col items-center justify-center border-r border-gray-100 pr-0 lg:pr-6 min-w-[200px]">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 mb-3">
                        <img
                            src="C:\Users\sahus\Downloads\1731677989789.jpeg"
                            alt="Profile"
                            className="w-full h-full object-cover"
                        />
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
                            <p className="text-gray-400 font-medium mb-1">Marital Status</p>
                            <p className="text-gray-700 font-semibold">{displayData.maritalStatus}</p>
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
                            <div className="flex flex-col items-center">
                                <div className="bg-white border p-1 mb-1">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Barcode-39.svg/1200px-Barcode-39.svg.png" alt="barcode" className="h-6 w-20 grayscale" />
                                </div>
                                <span className="text-[10px] font-bold">1</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 font-medium mb-1">Guardian Name</p>
                                <p className="text-gray-700 font-semibold">{displayData.guardianName}</p>
                            </div>
                            <div className="bg-white border p-1">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="qr" className="h-10 w-10 opacity-70" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
