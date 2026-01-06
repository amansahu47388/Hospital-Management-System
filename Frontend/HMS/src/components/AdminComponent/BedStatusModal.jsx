import { X } from "lucide-react";

export default function BedStatusModal({ open, onClose }) {
  if (!open) return null;

  const floors = [
    {
      name: "4th Floor",
      ward: "Non AC",
      beds: [
        { id: "FF-114", free: true },
        { id: "FF-145", free: true },
        { id: "FF-146", free: true },
        { id: "FF-147", free: true },
        { id: "Nuwan Thus", free: false },
        { id: "FF-149", free: true },
      ],
    },
    {
      name: "3rd Floor",
      ward: "Private Ward",
      beds: [
        { id: "Ryan D.", free: false },
        { id: "Katie Strutt", free: false },
        { id: "Jonathan Hi", free: false },
        { id: "TF-107", free: true },
      ],
    },
    {
      name: "2nd Floor",
      ward: "ICU / NICU",
      beds: [
        { id: "Georgia War", free: false },
        { id: "Rubin Herma", free: false },
        { id: "SF-140", free: true },
      ],
    },
    {
      name: "1st Floor",
      ward: "AC (Normal)",
      beds: [
        { id: "Maria Taylor", free: false },
        { id: "FF-127", free: true },
        { id: "FF-128", free: true },
        { id: "FF-129", free: true },
      ],
    },
    {
      name: "Ground Floor",
      ward: "VIP Ward",
      beds: [
        { id: "VIP-01", free: true },
        { id: "VIP-02", free: false },
        { id: "VIP-03", free: true },
      ],
    },
  ];

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
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">

          {floors.map((floor, i) => (
            <div key={i} className="bg-white rounded-xl shadow p-4">
              {/* FLOOR HEADER */}
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-sm md:text-base">
                  {floor.name}
                </span>
                <span className="text-xs bg-gray-200 px-3 py-1 rounded-full">
                  {floor.ward}
                </span>
              </div>

              {/* BEDS */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {floor.beds.map((bed, idx) => (
                  <div
                    key={idx}
                    className={`
                      h-20 rounded-lg flex flex-col
                      items-center justify-center
                      text-xs font-medium
                      cursor-pointer
                      transition
                      ${
                        bed.free
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-pink-500 text-white hover:bg-pink-600"
                      }
                    `}
                  >
                    🛏️
                    <span className="truncate px-1">{bed.id}</span>
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
