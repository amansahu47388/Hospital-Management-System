import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, Bed, User } from "lucide-react";
import { getBeds } from "../../api/ipdApi";

export default function BedStatus({ open, onClose }) {
  const navigate = useNavigate();
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchBeds();
    }
  }, [open]);

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const res = await getBeds();
      console.log("Fetched Beds Data:", res.data); // Debug log
      setBeds(res.data || []);
    } catch (error) {
      console.error("Error fetching beds:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // Grouping logic: Group by Floor first, then by Bed Group (Ward)
  const floorGroups = beds.reduce((acc, bed) => {
    const floor = bed.floor || "General";
    if (!acc[floor]) acc[floor] = [];
    acc[floor].push(bed);
    return acc;
  }, {});

  // Convert to a structured array for rendering
  const processedFloors = Object.keys(floorGroups).map((floorName) => {
    const uniqueGroups = [...new Set(floorGroups[floorName].map(b => b.bed_group))].join(", ");

    return {
      name: floorName,
      ward: uniqueGroups || "General",
      beds: floorGroups[floorName].map(b => ({
        id: b.id,
        bed_name: b.bed_name,
        free: b.status === "available",
        patient_name: b.patient_name,
        ipd_id: b.ipd_id
      }))
    };
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/70">
      {/* FULL SCREEN CONTAINER */}
      <div className="w-full h-full flex flex-col bg-gray-100">

        {/* HEADER (FIXED) */}
        <div
          className="
            flex items-center justify-between
            px-6 py-4
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            text-white
            shadow-md
          "
        >
          <h2 className="text-lg md:text-xl font-semibold">
            Bed Status Overview
          </h2>
          <X
            size={22}
            className="cursor-pointer hover:scale-110 transition"
            onClick={onClose}
          />
        </div>

        {/* BODY (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 relative">

          {loading && (
            <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6046B5]"></div>
            </div>
          )}

          {processedFloors.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <Bed size={48} className="mb-2 opacity-20" />
              <p>No bed data available</p>
            </div>
          )}

          {processedFloors.map((floor, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4">
              {/* FLOOR HEADER */}
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-sm md:text-base text-gray-700">
                  {floor.name}
                </span>
                <span className="text-[10px] md:text-xs bg-purple-50 text-purple-600 border border-purple-100 px-3 py-1 rounded-full font-medium uppercase tracking-wider">
                  {floor.ward}
                </span>
              </div>

              {/* BEDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {floor.beds.map((bed, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      if (!bed.free && bed.ipd_id) {
                        navigate(`/admin/ipd-patients/${bed.ipd_id}/profile`);
                        onClose();
                      }
                    }}
                    className={`
                      h-20 md:h-24 rounded-lg flex flex-col
                      items-center justify-center
                      text-sm md:text-sm font-medium
                      cursor-pointer
                      transition shadow
                      ${bed.free
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-pink-500 text-white hover:bg-pink-600"
                      }
                    `}
                  >
                    <div className="flex flex-col items-center text-center px-1 w-full">
                      <Bed size={22} className="mb-1" />
                      <span className="font-bold border-b border-white/30 mb-1 w-full pb-0.5 truncate uppercase">
                        {bed.bed_name}
                      </span>
                      {!bed.free && (
                        <div className="flex flex-col items-center w-full">
                          <span className="font-semibold flex items-center justify-center gap-1 max-w-full">
                            <User size={16} />
                            <span className="truncate">{bed.patient_name || "Occupied"}</span>
                          </span>
                        </div>
                      )}
                      {bed.free && (
                        <span className="opacity-80">Available</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}
