import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import PrintHeaderFooterMenu from "../../../components/Setup/Header_Footer/PrintHeaderFooterMenu";
import FooterContentEditor from "../../../components/Setup/Header_Footer/FooterContentEditor";

export default function OpdAntenatalFindingHeaderFooter() {
  const [preview, setPreview] = useState(null);

  return (
    <AdminLayout>
      <div className="min-h-screen p-1 ">
        <div className="bg-white rounded-md p-4">

          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            OPD Antenatal Finding Header Footer
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-64">
              <PrintHeaderFooterMenu />
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <label className="text-sm font-medium">
                  Header Image (2230px X 300px)
                </label>

                <div className="border rounded-md h-[180px] flex items-center justify-center relative mt-1">
                  {preview ? (
                    <img src={preview} className="h-full object-contain" />
                  ) : (
                    <span className="text-gray-400">
                      Drop a file here or click
                    </span>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) =>
                      setPreview(URL.createObjectURL(e.target.files[0]))
                    }
                  />
                </div>
              </div>

              <FooterContentEditor
                defaultValue="This invoice is printed electronically, so no signature is required."
              />

              <div className="flex justify-end">
                <button className="bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white px-6 py-2 rounded-md">
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
