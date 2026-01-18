import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";

// already existing components
import PrintHeaderFooterMenu from "../../../components/Setup/Header_Footer/PrintHeaderFooterMenu";
import FooterContentEditor from "../../../components/Setup/Header_Footer/FooterContentEditor";

export default function IpdAntenatalFindingHeaderFooter() {
  const [preview, setPreview] = useState(null);

  return (
    <AdminLayout>
      <div className="min-h-screen p-1 ">

        {/* MAIN CARD */}
        <div className="bg-white rounded-md p-4">

          {/* PAGE TITLE */}
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            IPD Antenatal Finding Header Footer
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">

            {/* LEFT SIDEBAR */}
            <div className="w-full lg:w-64">
              <PrintHeaderFooterMenu />
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 space-y-6">

              {/* HEADER IMAGE INPUT (OPD STYLE) */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Header Image (2230px X 300px)
                </label>

                <div className="border rounded-md h-[200px] flex items-center justify-center relative bg-gray-50">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Header Preview"
                      className="h-full object-contain"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <p>☁️</p>
                      <p>Drop a file here or click</p>
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setPreview(
                        e.target.files?.[0]
                          ? URL.createObjectURL(e.target.files[0])
                          : null
                      )
                    }
                  />
                </div>

                <p className="text-xs text-blue-600 mt-1">
                  uploads/printing/19.jpg
                </p>
              </div>

              {/* FOOTER CONTENT */}
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
