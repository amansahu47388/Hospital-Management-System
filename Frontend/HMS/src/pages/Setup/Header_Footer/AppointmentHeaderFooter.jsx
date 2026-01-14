import { useState } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import PrintHeaderFooterMenu from "../../../components/Setup/Header_Footer/PrintHeaderFooterMenu";
import FooterContentEditor from "../../../components/Setup/Header_Footer/FooterContentEditor";

export default function AppointmentHeaderFooter() {
  const [headerPreview, setHeaderPreview] = useState(null);
  const [footerContent, setFooterContent] = useState(""); // Dynamic content state

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeaderPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    // Here you can send footerContent to backend or handle save logic
    console.log("Footer Content Saved:", footerContent);
    alert("Footer content saved successfully!");
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-2 bg-gray-100">

        {/* PAGE TITLE */}
        <div className="bg-white rounded-md p-3 mb-4">
          <h2 className="text-lg font-semibold">
            Appointment Header Footer
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4">

          {/* LEFT SIDEBAR */}
          <div className="w-full md:w-64">
            <PrintHeaderFooterMenu />
          </div>

          {/* MAIN CONTENT */}
          <div className="flex-1 bg-white rounded-md p-4">

            {/* HEADER IMAGE SECTION */}
            <h3 className="font-semibold mb-2">
              Header Image (2230px X 300px)
            </h3>

            <div className="border rounded-md p-3 mb-4">
              {headerPreview && (
                <img
                  src={headerPreview}
                  alt="Header Preview"
                  className="w-full max-h-52 object-contain mb-3 border"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="text-sm"
              />
            </div>

            {/* FOOTER CONTENT EDITOR COMPONENT */}
            <FooterContentEditor
              footerContent={footerContent}
              setFooterContent={setFooterContent}
              handleSave={handleSave}
            />

          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
