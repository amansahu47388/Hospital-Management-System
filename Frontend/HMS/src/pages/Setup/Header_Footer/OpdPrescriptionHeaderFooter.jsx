import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";

// already existing components (DO NOT recreate)
import PrintHeaderFooterMenu from "../../../components/Setup/Header_Footer/PrintHeaderFooterMenu";
import FooterContentEditor from "../../../components/Setup/Header_Footer/FooterContentEditor";

export default function OpdPrescriptionHeaderFooter() {
  const [headerImage, setHeaderImage] = useState("/uploads/printing/1.jpg");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeaderImage(URL.createObjectURL(file));
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1 ">

        {/* MAIN CARD */}
        <div className="bg-white rounded-md p-4">

          {/* PAGE TITLE */}
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            OPD Prescription Header Footer
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">

            {/* LEFT SIDEBAR */}
            <div className="w-full lg:w-64">
              <PrintHeaderFooterMenu />
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 space-y-6">

              {/* HEADER IMAGE INPUT (APPOINTMENT STYLE) */}
              <div className="border rounded-md">

                <div className="px-4 py-2 border-b bg-gray-50">
                  <p className="text-sm font-medium">
                    Header Image (2230px X 300px)
                  </p>
                </div>

                <div className="p-4 space-y-3">

                  {/* FILE INPUT */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-sm file:font-semibold
                      file:bg-gradient-to-b file:from-[#6046B5] file:to-[#8A63D2]
                      file:text-white
                      hover:file:opacity-90"
                  />

                  {/* IMAGE PREVIEW */}
                  <div className="border rounded-md h-[180px] flex items-center justify-center bg-white">
                    <img
                      src={headerImage}
                      alt="Header Preview"
                      className="max-h-full object-contain"
                    />
                  </div>

                </div>
              </div>

              {/* FOOTER CONTENT EDITOR */}
              <div>
               
                <FooterContentEditor
                  defaultValue="This invoice is printed electronically, so no signature is required"
                />
              </div>

              {/* SAVE BUTTON */}
              <div className="flex justify-end">
                <button
                  className="flex items-center gap-2
                  bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
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
