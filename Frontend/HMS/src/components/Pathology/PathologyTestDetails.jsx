import React, { useState } from "react";
import {X} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PathologyTestDetails({ open, onClose, test }) {
    const navigate = useNavigate();

    

  if (!open || !test) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      {/* PANEL */}
      <div className="bg-white w-[98%] md:w-[90%] lg:w-[80%] rounded-lg shadow-lg overflow-y-auto max-h-[90vh] mx-auto">
        
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 sticky top-0 bg-gradient-to-r from-[#6046B5] to-[#8A63D2] text-white">
          <h2 className="text-lg font-semibold">Pathology Test Details</h2>
          <div className="flex gap-3">
            <X onClick={onClose} className="cursor-pointer hover:opacity-80" size={18} />
          </div>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto text-sm">

           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
             <Field label="Test Name" value={test.test_name} />
             <Field label="Short Name" value={test.short_name} />

             <Field label="Test Type" value={test.test_type} />
             <Field label="Report Days" value={test.report_days}/>

             <Field label="Category Name" value={test.category_name} />
             <Field label="sub Category" value={test.sub_category|| "—"} />

             <Field label="Charge Category" value={test.charge_category} />
             <Field label="Charge Name" value={test.charge_name || "—"} />

             <Field label="Method" value={test.method} />
             <Field label="Tax(%)" value={test.tax} />

             <Field label="Standard Charge($)" value={test.standard_charge} />
             <Field label="Total Amount($)" value={test.total_amount || "—"} />
           </div>

           <div className="mt-6">
            <h3 className="font-bold text-gray-700 mb-2">
                Test Parameters
            </h3>
            <table className="min-w-full text-sm ">
                <thead className="bg-gray-100 ">
                <tr>
                    <th className="px-3 py-2 text-left ">Parameter Name</th>
                    <th className="px-3 py-2 text-left">Reference Range</th>
                    <th className="px-3 py-2 text-left">Unit</th>
                </tr>
                </thead>

                <tbody>
                {test.parameters && test.parameters.length > 0 ? (
                    test.parameters.map((p, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                        <td className="px-3 py-2 ">{p.parameter_name}</td>
                        <td className="px-3 py-2 ">{p.reference_range}</td>
                        <td className="px-3 py-2 ">{p.unit}</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                    <td colSpan="3" className="text-center py-4 text-gray-500">
                        No parameters available
                    </td>
                    </tr>
                )}
                </tbody>
            </table>
            </div>
        </div>
      </div>
    </div>
  );
}

/* SMALL FIELD COMPONENT */
const Field = ({ label, value }) => (
  <div className="flex">
    <span className="w-50 font-bold text-gray-600">{label}</span>
    <span className="text-gray-800">{value || "—"}</span>
  </div>
);
