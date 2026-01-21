import React from 'react';
import {
    Printer,
    Menu,
    Copy,
    FileSpreadsheet,
    FileText,
    FileJson,
    FileDown
} from 'lucide-react';

export default function MyAppointmentsTable({ appointments = [], loading = false, onDetail }) {

    // Mock data to match screenshot if none provided
    const tableData = appointments.length > 0 ? appointments : [
        { id: '7620', appointment_no: 'APPNO7620', date: '01/01/2026 03:46 PM', priority: 'Normal', specialist: 'Cardiologists, Gastroenterologists', doctor: 'Amit Singh (9009)', status: 'Approved', message: '', alternate_address: '' },
        { id: '7558', appointment_no: 'APPNO7558', date: '12/01/2025 03:10 PM', priority: 'Normal', specialist: 'Cardiologists, Gastroenterologists', doctor: 'Amit Singh (9009)', status: 'Approved', message: '', alternate_address: '' },
        { id: '7498', appointment_no: 'APPNO7498', date: '11/10/2025 05:46 PM', priority: 'Normal', specialist: 'Cardiologists', doctor: 'Sonia Bush (9002)', status: 'Approved', message: '', alternate_address: '' },
        { id: '7497', appointment_no: 'APPNO7497', date: '11/05/2025 12:00 PM', priority: 'Normal', specialist: 'Cardiologists, Gastroenterologists', doctor: 'Amit Singh (9009)', status: 'Approved', message: 'Urgent Appointment', alternate_address: '' },
        { id: '7434', appointment_no: 'APPNO7434', date: '10/05/2025 11:00 AM', priority: 'Normal', specialist: 'Cardiologists', doctor: 'Sonia Bush (9002)', status: 'Approved', message: 'Urgent Appointment -TBK', alternate_address: '' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Top Toolbar */}
            <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full pl-3 pr-10 py-1.5 border-b border-gray-200 focus:border-[#6046B5] outline-none text-sm"
                    />
                </div>

                <div className="flex items-center gap-1">
                    <button title="Copy" className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Copy size={16} /></button>
                    <button title="Excel" className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><FileSpreadsheet size={16} /></button>
                    <button title="CSV" className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><FileDown size={16} /></button>
                    <button title="PDF" className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><FileText size={16} /></button>
                    <button title="Print" className="p-1.5 hover:bg-gray-100 rounded text-gray-500"><Printer size={16} /></button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-[13px] text-left">
                    <thead>
                        <tr className="border-b border-gray-100 text-gray-700 font-bold bg-gray-50/30">
                            <th className="px-4 py-3 cursor-pointer hover:bg-gray-50">Appointment No <span className="text-[10px]">▼</span></th>
                            <th className="px-4 py-3 cursor-pointer hover:bg-gray-50">Appointment Date <span className="text-[10px]">▼</span></th>
                            <th className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-center">Priority <span className="text-[10px]">▼</span></th>
                            <th className="px-4 py-3 cursor-pointer hover:bg-gray-50">Specialist <span className="text-[10px]">▼</span></th>
                            <th className="px-4 py-3 cursor-pointer hover:bg-gray-50">Doctor <span className="text-[10px]">▼</span></th>
                            <th className="px-4 py-3 cursor-pointer hover:bg-gray-50 text-center">Status <span className="text-[10px]">▼</span></th>
                            <th className="px-4 py-3 cursor-pointer hover:bg-gray-50">Message <span className="text-[10px]">▼</span></th>
                            <th className="px-4 py-3 cursor-pointer hover:bg-gray-50">Alternate Address <span className="text-[10px]">▼</span></th>
                            <th className="px-4 py-3 text-right">Action <span className="text-[10px]">▼</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tableData.map((row) => (
                            <tr key={row.appointment_no} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 text-gray-600 font-medium">{row.appointment_no}</td>
                                <td className="px-4 py-3 text-gray-600">{row.date}</td>
                                <td className="px-4 py-3 text-gray-600 text-center">{row.priority}</td>
                                <td className="px-4 py-3 text-gray-600 max-w-[150px] truncate">{row.specialist}</td>
                                <td className="px-4 py-3 text-gray-600 font-medium">{row.doctor}</td>
                                <td className="px-4 py-3 text-center">
                                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold text-white shadow-sm ${row.status === 'Approved' ? 'bg-[#72B01D]' : row.status === 'Pending' ? 'bg-[#F29C11]' : 'bg-gray-400'
                                        }`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-gray-500 italic text-[11px]">{row.message}</td>
                                <td className="px-4 py-3 text-gray-600 font-medium">{row.alternate_address}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-1 hover:bg-gray-100 rounded text-gray-500" title="Print"><Printer size={16} /></button>
                                        <button
                                            onClick={() => onDetail(row)}
                                            className="p-1 hover:bg-gray-100 rounded text-gray-500"
                                            title="Details"
                                        >
                                            <Menu size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t border-gray-100 flex justify-between items-center text-[12px] text-gray-500">
                <p>Records: 1 to {tableData.length} of 23</p>
                <div className="flex gap-1">
                    <button className="px-2 py-1 hover:bg-gray-100 rounded">{'<'}</button>
                    <button className="px-2 py-1 bg-[#6046B5] text-white rounded">1</button>
                    <button className="px-2 py-1 hover:bg-gray-100 rounded">2</button>
                    <button className="px-2 py-1 hover:bg-gray-100 rounded">3</button>
                    <button className="px-2 py-1 hover:bg-gray-100 rounded">{'>'}</button>
                </div>
            </div>
        </div>
    );
}
