import AdminLayout from "../../../layout/AdminLayout";
import PrintHeaderFooterMenu from "../../../components/Setup/Header_Footer/PrintHeaderFooterMenu";
import FooterContentEditor from "../../../components/Setup/Header_Footer/FooterContentEditor";

export default function PaymentReceiptHeaderFooter() {
  return (
    <AdminLayout>
      <div className="min-h-screen p-1">
        <div className="bg-white rounded-md p-4">

          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Payment Receipt Header Footer
          </h2>

          <div className="flex flex-col lg:flex-row gap-4">

            {/* LEFT MENU */}
            <div className="w-full lg:w-64">
              <PrintHeaderFooterMenu />
            </div>

            {/* RIGHT CONTENT */}
            <div className="flex-1 space-y-6">

              {/* HEADER IMAGE INPUT */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Header Image (2230px X 300px)
                </label>

                <div className="border border-dashed rounded-md h-[180px] flex items-center justify-center">
                  <input type="file" accept="image/*" />
                </div>

                <p className="text-xs text-blue-600 mt-1">
                  uploads/printing/8.jpg
                </p>
              </div>

              {/* FOOTER EDITOR */}
              <div>
                
                <FooterContentEditor
                  defaultValue="This invoice is printed electronically, so no signature is required"
                />
              </div>

              {/* SAVE */}
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
