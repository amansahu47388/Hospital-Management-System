import PatientLayout from "../../../layout/PatientLayout";
import IPDHeaderNavbar from "../../../components/Patient_module/IPD/IPD_header";

export default function Vitals() {
  const vitals = [
    {
      date: "12/12/2025",
      height: "-",
      weight: "80 (08:00 PM)",
      pulse: "-",
      temp: "-",
      bp: "-",
    },
    {
      date: "12/03/2025",
      height: "150 (12:52 PM)",
      weight: "-",
      pulse: "-",
      temp: "-",
      bp: "-",
    },
    {
      date: "11/10/2025",
      height: "-",
      weight: "-",
      pulse: "-",
      temp: "96 (03:30 PM)",
      bp: "-",
    },
    {
      date: "11/08/2025",
      height: "-",
      weight: "-",
      pulse: "-",
      temp: "94 (05:42 PM)",
      bp: "-",
    },
    {
      date: "10/10/2025",
      height: "-",
      weight: "-",
      pulse: "-",
      temp: "95.3 (05:40 PM)",
      bp: "-",
    },
    {
      date: "09/08/2025",
      height: "-",
      weight: "-",
      pulse: "75 (09:00 PM)",
      temp: "-",
      bp: "-",
    },
    {
      date: "09/06/2025",
      height: "-",
      weight: "-",
      pulse: "-",
      temp: "-",
      bp: "90 (12:00 PM)",
    },
    {
      date: "08/10/2025",
      height: "-",
      weight: "-",
      pulse: "-",
      temp: "-",
      bp: "90/80 (12:30 PM)",
    },
    {
      date: "08/08/2025",
      height: "-",
      weight: "-",
      pulse: "-",
      temp: "95.3 (04:30 PM)",
      bp: "-",
    },
    {
      date: "07/15/2025",
      height: "-",
      weight: "-",
      pulse: "-",
      temp: "95.2 (12:30 PM)",
      bp: "-",
    },
  ];

  return (
    <PatientLayout>
      {/* IPD TOP NAVBAR */}
      <IPDHeaderNavbar />

      {/* PAGE WRAPPER */}
      <div className="min-h-screen p-4 md:p-6 ">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">

          {/* PAGE HEADER */}
          <div className="px-5 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">
              Vitals
            </h2>
          </div>

          {/* TABLE VIEW – DESKTOP */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th>Height<br /><span className="text-xs">(1–200 cm)</span></th>
                  <th>Weight<br /><span className="text-xs">(0–150 kg)</span></th>
                  <th>Pulse<br /><span className="text-xs">(70–100)</span></th>
                  <th>Temperature<br /><span className="text-xs">(95.8–99.3 °F)</span></th>
                  <th>BP<br /><span className="text-xs">(90/60–140/90)</span></th>
                </tr>
              </thead>
              <tbody>
                {vitals.map((v, i) => (
                  <tr
                    key={i}
                    className="border-t hover:bg-indigo-50/40 transition"
                  >
                    <td className="p-3 font-medium">{v.date}</td>
                    <td>{v.height}</td>
                    <td>{v.weight}</td>
                    <td>{v.pulse}</td>
                    <td>{v.temp}</td>
                    <td>{v.bp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* CARD VIEW – MOBILE */}
          <div className="md:hidden p-4 space-y-4">
            {vitals.map((v, i) => (
              <div
                key={i}
                className="border-l-4 border-indigo-600 bg-white rounded-xl p-4 shadow-sm"
              >
                <p className="font-semibold text-sm text-gray-800 mb-2">
                  Date: {v.date}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <p><b>Height:</b> {v.height}</p>
                  <p><b>Weight:</b> {v.weight}</p>
                  <p><b>Pulse:</b> {v.pulse}</p>
                  <p><b>Temp:</b> {v.temp}</p>
                  <p><b>BP:</b> {v.bp}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </PatientLayout>
  );
}
