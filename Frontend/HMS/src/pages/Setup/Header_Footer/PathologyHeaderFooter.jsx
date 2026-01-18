import AdminLayout from "../../../layout/AdminLayout";
import PrintHeaderFooterMenu from "../../../components/Setup/Header_Footer/PrintHeaderFooterMenu";
import FooterContentEditor from "../../../components/Setup/Header_Footer/FooterContentEditor";

export default function PathologyHeaderFooter() {
  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        <div className="bg-white rounded-md p-4">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Pathology Header Footer
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-64">
              <PrintHeaderFooterMenu />
            </div>

            <div className="flex-1 space-y-6">
              {/* HEADER IMAGE INPUT */}
              <div>
                <label className="text-sm font-medium">
                  Header Image (2230px X 300px)
                </label>

                <label className="mt-2 flex flex-col items-center justify-center border-2 border-dashed rounded-md h-48 cursor-pointer text-gray-500">
                  <input type="file" accept="image/*" className="hidden" />
                  <span>☁ Drop a file here or click</span>
                </label>

                <p className="text-xs text-blue-600 mt-1">
                  uploads/printing/11.jpg
                </p>
              </div>

              {/* FOOTER */}
              <FooterContentEditor
                defaultValue="This invoice is printed electronically, so no signature is required"
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
