import AdminLayout from "../../../layout/AdminLayout";

// EXISTING COMPONENTS
import PrintHeaderFooterMenu from "../../../components/Setup/Header_Footer/PrintHeaderFooterMenu";
import FooterContentEditor from "../../../components/Setup/Header_Footer/FooterContentEditor";

export default function PharmacyBillHeaderFooter() {
  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        <div className="bg-white rounded-md p-4">

          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Pharmacy Bill Header Footer
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">

            <div className="w-full lg:w-64">
              <PrintHeaderFooterMenu />
            </div>

            <div className="flex-1 space-y-6">

              <div>
                <label className="block text-sm font-medium mb-1">
                  Header Image (2230px X 300px)
                </label>

                <label className="border rounded-md h-[160px] flex items-center justify-center cursor-pointer text-gray-500 hover:bg-gray-50">
                  ☁ Drop a file here or click
                  <input type="file" accept="image/*" className="hidden" />
                </label>

                <p className="text-xs text-blue-600 mt-1">
                  uploads/printing/6.jpg
                </p>
              </div>

              <div>
                
                <FooterContentEditor
                  defaultValue="This invoice is printed electronically, so no signature is required"
                />
              </div>

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
