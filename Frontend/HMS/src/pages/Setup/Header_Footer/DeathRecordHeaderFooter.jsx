import { useState, useEffect } from "react";
import AdminLayout from "../../../layout/AdminLayout";
import { getHeaders, createHeader, updateHeader } from "../../../api/setupApi";
import { useNotify } from "../../../context/NotificationContext";

// already existing components
import PrintHeaderFooterMenu from "../../../components/Setup/Header_Footer/PrintHeaderFooterMenu";
import FooterContentEditor from "../../../components/Setup/Header_Footer/FooterContentEditor";

export default function DeathRecordHeaderFooter() {
  const notify = useNotify();
  const [headerId, setHeaderId] = useState(null);
  const [preview, setPreview] = useState("/uploads/printing/10.jpg");
  const [headerFile, setHeaderFile] = useState(null);
  const [footerContent, setFooterContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const response = await getHeaders();
        if (response.data && response.data.length > 0) {
          const data = response.data[0];
          setHeaderId(data.id);
          if (data.death_record_header) {
            setPreview(data.death_record_header);
          }
          if (data.death_record_footer) {
            setFooterContent(data.death_record_footer);
          }
        }
      } catch (error) {
        console.error("Error fetching header data:", error);
      }
    };
    fetchHeaderData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeaderFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (headerFile) {
        formData.append("death_record_header", headerFile);
      }
      formData.append("death_record_footer", footerContent);

      if (headerId) {
        await updateHeader(headerId, formData);
        notify("success", "Death Record Header & Footer updated successfully");
      } else {
        const response = await createHeader(formData);
        setHeaderId(response.data.id);
        notify("success", "Death Record Header & Footer created successfully");
      }
    } catch (error) {
      console.error("Error saving header data:", error);
      notify("error", "Failed to save Death Record Header & Footer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen p-1 ">

        <div className="bg-white rounded-md p-4">

          <h2 className="text-lg font-semibold mb-4 border-b pb-2">
            Death Record Header Footer
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
                {/* PREVIEW */}
                <div className="border border-gray-300 rounded-md overflow-hidden bg-white">
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
                    hover:file:bg-gray-200 "
                />

                {/* FILE PATH */}
                <p className="text-xs text-blue-600">
                  {headerFile ? headerFile.name : (preview.includes('blob') ? 'New upload' : preview)}
                </p>
              </div>

              {/* FOOTER CONTENT */}
              <FooterContentEditor
                footerContent={footerContent}
                setFooterContent={setFooterContent}
                handleSave={handleSave}
                loading={loading}
              />
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
