import { useMemo, useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { useNavigate } from "react-router-dom";
import AddAmbulanceModel from "../../components/Ambulance/AddAmbulanceModal";
import {
  Plus,
  Search,
  FileText,
  FileSpreadsheet,
  Printer,
  Copy
} from "lucide-react";

export default function AmbulanceList() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
    const navigate = useNavigate();
  const data = [
    {
      number: "MP20DDHK2562",
      model: "BS4FGD",
      year: 2019,
      driver: "David Wood",
      license: "MLKK0099820",
      contact: "9806545404",
      note: "",
      type: "Owned",
    },
    {
      number: "MP20DFG56",
      model: "BS440",
      year: 2018,
      driver: "David Wood",
      license: "MKLKL-569079",
      contact: "7446165065",
      note: "",
      type: "Contractual",
    },
    {
      number: "MP20PL3265",
      model: "MKL265",
      year: 2018,
      driver: "Ankit",
      license: "LPK2205465",
      contact: "968854556",
      note: "",
      type: "Owned",
    },
    {
      number: "MP20QW2343",
      model: "HJG1650",
      year: 2016,
      driver: "Oliver",
      license: "MLK-98JGH2013",
      contact: "984865101",
      note: "",
      type: "Owned",
    },
  ];

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <AdminLayout>
      {/* PAGE BACKGROUND */}
      <div className="min-h-screen  p-1">

        {/* WHITE CONTAINER (SAME AS IMAGE) */}
        <div className="bg-white rounded  shadow-sm">

          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <h2 className="font-semibold text-gray-800">Ambulance List</h2>

            <button onClick={() => setOpen(true)} className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-4 py-2 rounded text-sm flex items-center gap-1">
              <Plus size={14} /> Add Ambulance
            </button>
          </div>

          {/* SEARCH + ACTIONS */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-3 border-b">
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-64"
            />

            <div className="flex items-center gap-3 text-gray-600">
              <span className="text-sm">100</span>
              <Copy size={16} className="cursor-pointer" />
              <FileText size={16} className="cursor-pointer" />
              <FileSpreadsheet size={16} className="cursor-pointer" />
              <Printer size={16} className="cursor-pointer" />
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-700">
                  <th className="px-3 py-2">Vehicle Number</th>
                  <th className="px-3 py-2">Vehicle Model</th>
                  <th className="px-3 py-2">Year Made</th>
                  <th className="px-3 py-2">Driver Name</th>
                  <th className="px-3 py-2">Driver License</th>
                  <th className="px-3 py-2">Driver Contact</th>
                  <th className="px-3 py-2">Note</th>
                  <th className="px-3 py-2">Vehicle Type</th>
                </tr>
              </thead>

              <tbody>
                {filteredData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-3 py-2 text-blue-600 cursor-pointer">
                      {row.number}
                    </td>
                    <td className="px-3 py-2">{row.model}</td>
                    <td className="px-3 py-2">{row.year}</td>
                    <td className="px-3 py-2">{row.driver}</td>
                    <td className="px-3 py-2">{row.license}</td>
                    <td className="px-3 py-2">{row.contact}</td>
                    <td className="px-3 py-2">{row.note}</td>
                    <td className="px-3 py-2">{row.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600">
            <span>
              Records: 1 to {filteredData.length} of {data.length}
            </span>

            <div className="flex items-center gap-2">
              <button className="border px-2 rounded">‹</button>
              <button className="border px-2 rounded bg-gray-100">1</button>
              <button className="border px-2 rounded">›</button>
            </div>
          </div>
        </div>
      </div>
      <AddAmbulanceModel
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={(data) => console.log(data)}
      />
    </AdminLayout> 
  );
}
