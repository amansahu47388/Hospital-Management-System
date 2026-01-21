import { useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  IndentDecrease,
  IndentIncrease,
  Quote,
  RotateCcw,
  Save,
  Link,
  X
} from "lucide-react";

export default function FooterContentEditor({ footerContent, setFooterContent, handleSave }) {
  const editorRef = useRef(null);
  const [selectedFormat, setSelectedFormat] = useState("normal");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  const execCommand = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    // Update state after command
    if (editorRef.current) {
      setFooterContent(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setFooterContent(editorRef.current.innerHTML);
    }
  };

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
    switch (format) {
      case 'normal':
        execCommand('formatBlock', 'p');
        break;
      case 'h1':
        execCommand('formatBlock', 'h1');
        break;
      case 'h2':
        execCommand('formatBlock', 'h2');
        break;
      case 'h3':
        execCommand('formatBlock', 'h3');
        break;
      case 'h4':
        execCommand('formatBlock', 'h4');
        break;
      case 'h5':
        execCommand('formatBlock', 'h5');
        break;
      case 'h6':
        execCommand('formatBlock', 'h6');
        break;
      default:
        break;
    }
  };

  const handleInsertLink = () => {
    if (linkUrl) {
      const url = linkUrl.startsWith('http') ? linkUrl : `https://${linkUrl}`;

      if (linkText) {
        // Insert link with custom text
        const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
        execCommand('insertHTML', linkHtml);
      } else {
        // Use selected text or URL as link text
        execCommand('createLink', url);
      }

      // Reset and close modal
      setLinkUrl("");
      setLinkText("");
      setShowLinkModal(false);
    }
  };

  return (
    <>
      {/* FOOTER CONTENT EDITOR */}
      <h3 className="font-semibold mb-3 text-gray-800">Footer Content</h3>

      {/* ENHANCED TOOLBAR - Matching Design Image */}
      <div className="flex flex-wrap items-center gap-2 mb-3 p-2 bg-white border border-gray-300 rounded">
        {/* Text Format Dropdown */}
        <select
          value={selectedFormat}
          onChange={(e) => handleFormatChange(e.target.value)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[140px]"
        >
          <option value="normal">Normal text</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
          <option value="h5">Heading 5</option>
          <option value="h6">Heading 6</option>
        </select>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Bold */}
        <button
          onClick={() => execCommand("bold")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Bold"
        >
          <Bold size={18} className="text-gray-700" />
        </button>

        {/* Italic */}
        <button
          onClick={() => execCommand("italic")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Italic"
        >
          <Italic size={18} className="text-gray-700" />
        </button>

        {/* Underline */}
        <button
          onClick={() => execCommand("underline")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Underline"
        >
          <Underline size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Small Text */}
        <button
          onClick={() => execCommand("fontSize", "2")}
          className="px-2 py-1 text-xs border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors font-medium"
          title="Small"
        >
          Small
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Quote */}
        <button
          onClick={() => execCommand("formatBlock", "blockquote")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Quote"
        >
          <Quote size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Bullet List */}
        <button
          onClick={() => execCommand("insertUnorderedList")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Bullet List"
        >
          <List size={18} className="text-gray-700" />
        </button>

        {/* Numbered List */}
        <button
          onClick={() => execCommand("insertOrderedList")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Indent Decrease */}
        <button
          onClick={() => execCommand("outdent")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Decrease Indent"
        >
          <IndentDecrease size={18} className="text-gray-700" />
        </button>

        {/* Indent Increase */}
        <button
          onClick={() => execCommand("indent")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Increase Indent"
        >
          <IndentIncrease size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Align Left */}
        <button
          onClick={() => execCommand("justifyLeft")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Align Left"
        >
          <AlignLeft size={18} className="text-gray-700" />
        </button>

        {/* Align Center */}
        <button
          onClick={() => execCommand("justifyCenter")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Align Center"
        >
          <AlignCenter size={18} className="text-gray-700" />
        </button>

        {/* Align Right */}
        <button
          onClick={() => execCommand("justifyRight")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Align Right"
        >
          <AlignRight size={18} className="text-gray-700" />
        </button>

        {/* Align Justify */}
        <button
          onClick={() => execCommand("justifyFull")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Justify"
        >
          <AlignJustify size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Clear Formatting */}
        <button
          onClick={() => execCommand("removeFormat")}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Clear Formatting"
        >
          <RotateCcw size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Insert Link */}
        <button
          onClick={() => setShowLinkModal(true)}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Insert Link"
        >
          <Link size={18} className="text-gray-700" />
        </button>
      </div>

      {/* EDITOR AREA */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleEditorInput}
        className="
          border border-gray-300 rounded p-4 min-h-[250px] bg-white
          focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500
          text-gray-800 leading-relaxed
        "
        style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}
        dangerouslySetInnerHTML={{ __html: footerContent }}
      ></div>

      {/* INSERT LINK MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Insert Link</h3>
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl("");
                  setLinkText("");
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL *
                </label>
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Link Text (optional)
                </label>
                <input
                  type="text"
                  placeholder="Click here"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use selected text or URL as link text
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowLinkModal(false);
                  setLinkUrl("");
                  setLinkText("");
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertLink}
                disabled={!linkUrl}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-gradient-to-b from-[#6046B5] to-[#8A63D2] rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVE BUTTON */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded text-white text-sm font-medium
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            transition-colors duration-200 shadow-sm
          "
        >
          <Save size={16} />
          Save
        </button>
      </div>
    </>
  );
}