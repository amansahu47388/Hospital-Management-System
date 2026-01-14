import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";

// already existing components
import PrintHeaderFooterMenu from "../../../components/Setup/Header_Footer/PrintHeaderFooterMenu";
import FooterContentEditor from "../../../components/Setup/Header_Footer/FooterContentEditor";

export default function IpdPrescriptionHeaderFooter() {
  const [preview, setPreview] = useState("/uploads/printing/3.jpg");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-3 bg-gradient-to-b from-[#6046B5] to-[#8A63D2]">

        <div className="bg-white rounded-md p-4">

          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            IPD Prescription Header Footer
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">

            {/* LEFT MENU */}
            <div className="w-full lg:w-64">
              <PrintHeaderFooterMenu />
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 space-y-6">

              {/* HEADER IMAGE INPUT */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Header Image (2230px X 300px)
                </label>

                {/* PREVIEW */}
                <div className="border rounded-md overflow-hidden bg-white">
                  <img
                    src={preview}
                    alt="Header Preview"
                    className="w-full h-[140px] md:h-[180px] object-contain"
                  />
                </div>

                {/* FILE INPUT */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-600
                    file:mr-3 file:py-1.5 file:px-3
                    file:rounded file:border-0
                    file:text-sm file:font-medium
                    file:bg-gray-100 file:text-gray-700
                    hover:file:bg-gray-200"
                />

                {/* FILE PATH */}
                <p className="text-xs text-blue-600">
                  uploads/printing/3.jpg
                </p>
              </div>

              {/* FOOTER CONTENT */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Footer Content
                </label>

                <FooterContentEditor
                  defaultValue="This invoice is printed electronically, so no signature is required"
                />
              </div>

              {/* SAVE */}
              <div className="flex justify-end">
                <button
                  className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
                  text-white px-6 py-2 rounded-md"
                >
                  ✔ Save
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
