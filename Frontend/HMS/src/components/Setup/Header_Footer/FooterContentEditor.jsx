import { useRef, useState, useEffect } from "react";
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

export default function FooterContentEditor({ footerContent, setFooterContent, handleSave, loading }) {
  const editorRef = useRef(null);
  const [selectedFormat, setSelectedFormat] = useState("normal");
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  // Fix: Sync external content (initial load) to editor, but avoid cursor jumps during typing
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== footerContent) {
      editorRef.current.innerHTML = footerContent || "";
    }
  }, [footerContent]);

  // Ensure consistent formatting behavior across browsers
  useEffect(() => {
    if (editorRef.current) {
      document.execCommand('styleWithCSS', false, false);
      document.execCommand('defaultParagraphSeparator', false, 'p');
    }
  }, []);

  const execCommand = (cmd, value = null) => {
    if (!editorRef.current) return;

    editorRef.current.focus();

    // Use a small timeout for certain commands to ensure browser handles selection correctly
    // especially when triggered from dropdowns or async events
    const applyCommand = () => {
      document.execCommand(cmd, false, value);
      handleEditorInput();
    };

    if (cmd === 'formatBlock') {
      applyCommand();
    } else {
      applyCommand();
    }
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      // Direct call to set state without dangerouslySetInnerHTML re-render jump
      setFooterContent(editorRef.current.innerHTML);
    }
  };

  const handleFormatChange = (format) => {
    setSelectedFormat(format);
    if (!editorRef.current) return;

    // Refocus the editor to ensure command applies to correct selection
    editorRef.current.focus();

    let tag = 'p';
    switch (format) {
      case 'h1': tag = 'h1'; break;
      case 'h2': tag = 'h2'; break;
      case 'h3': tag = 'h3'; break;
      case 'h4': tag = 'h4'; break;
      case 'h5': tag = 'h5'; break;
      case 'h6': tag = 'h6'; break;
      default: tag = 'p'; break;
    }

    // Use the most compatible way to apply block formatting
    document.execCommand('formatBlock', false, tag);

    // Sync state
    handleEditorInput();
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
          onMouseDown={(e) => { e.preventDefault(); execCommand("bold"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Bold"
        >
          <Bold size={18} className="text-gray-700" />
        </button>

        {/* Italic */}
        <button
          onMouseDown={(e) => { e.preventDefault(); execCommand("italic"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Italic"
        >
          <Italic size={18} className="text-gray-700" />
        </button>

        {/* Underline */}
        <button
          onMouseDown={(e) => { e.preventDefault(); execCommand("underline"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Underline"
        >
          <Underline size={18} className="text-gray-700" />
        </button>

        {/* Font Size Dropdown */}
        <select
          onChange={(e) => execCommand("fontSize", e.target.value)}
          onMouseDown={(e) => e.stopPropagation()}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 min-w-[110px]"
          title="Font Size"
        >
          <option value="3">Font Size</option>
          <option value="1">Tiny</option>
          <option value="2">Small</option>
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">Extra Large</option>
          <option value="6">Huge</option>
          <option value="7">Giant</option>
        </select>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Quote */}
        <button
          onMouseDown={(e) => { e.preventDefault(); execCommand("formatBlock", "blockquote"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Quote"
        >
          <Quote size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Bullet List */}
        <button
          onMouseDown={(e) => { e.preventDefault(); execCommand("insertUnorderedList"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Bullet List"
        >
          <List size={18} className="text-gray-700" />
        </button>

        {/* Numbered List */}
        <button
          onMouseDown={(e) => { e.preventDefault(); execCommand("insertOrderedList"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Numbered List"
        >
          <ListOrdered size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Indent Decrease */}
        <button
          onMouseDown={(e) => { e.preventDefault(); execCommand("outdent"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Decrease Indent"
        >
          <IndentDecrease size={18} className="text-gray-700" />
        </button>

        {/* Indent Increase */}
        <button
          onMouseDown={(e) => { e.preventDefault(); execCommand("indent"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Increase Indent"
        >
          <IndentIncrease size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Align Left */}
        <button
          onMouseDown={(e) => { e.preventDefault(); execCommand("justifyLeft"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Align Left"
        >
          <AlignLeft size={18} className="text-gray-700" />
        </button>

        {/* Align Center */}
        <button
          onMouseDown={(e) => { e.preventDefault(); execCommand("justifyCenter"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Align Center"
        >
          <AlignCenter size={18} className="text-gray-700" />
        </button>

        {/* Align Right */}
        <button
          onMouseDown={(e) => { e.preventDefault(); execCommand("justifyRight"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Align Right"
        >
          <AlignRight size={18} className="text-gray-700" />
        </button>

        {/* Align Justify */}
        <button
          onMouseDown={(e) => { e.preventDefault(); execCommand("justifyFull"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Justify"
        >
          <AlignJustify size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Clear Formatting */}
        <button
          onMouseDown={(e) => { e.preventDefault(); execCommand("removeFormat"); }}
          className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-100 transition-colors"
          title="Clear Formatting"
        >
          <RotateCcw size={18} className="text-gray-700" />
        </button>

        <div className="w-px h-6 bg-gray-300"></div>

        {/* Insert Link */}
        <button
          onMouseDown={(e) => { e.preventDefault(); setShowLinkModal(true); }}
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
          text-gray-800 leading-relaxed edit-content-area
        "
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          outline: 'none'
        }}
      ></div>

      <style>
        {`
          .edit-content-area p {
            margin-bottom: 1rem !important;
            display: block !important;
          }
          .edit-content-area ul {
            list-style-type: disc !important;
            padding-left: 2rem !important;
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
            display: block !important;
          }
          .edit-content-area ol {
            list-style-type: decimal !important;
            padding-left: 2rem !important;
            margin-top: 0.5rem !important;
            margin-bottom: 0.5rem !important;
            display: block !important;
          }
          .edit-content-area li {
            display: list-item !important;
          }
          .edit-content-area h1 { font-size: 2.25rem; font-weight: 800 !important; display: block !important; margin: 0.5rem 0 !important; line-height: 1.2 !important; }
          .edit-content-area h2 { font-size: 1.875rem; font-weight: 700 !important; display: block !important; margin: 0.5rem 0 !important; line-height: 1.3 !important; }
          .edit-content-area h3 { font-size: 1.5rem; font-weight: 600 !important; display: block !important; margin: 0.5rem 0 !important; line-height: 1.4 !important; }
          .edit-content-area h4 { font-size: 1.25rem; font-weight: 600 !important; display: block !important; margin: 0.5rem 0 !important; }
          .edit-content-area h5 { font-size: 1.125rem; font-weight: 600 !important; display: block !important; margin: 0.5rem 0 !important; }
          .edit-content-area h6 { font-size: 1rem; font-weight: 600 !important; display: block !important; margin: 0.5rem 0 !important; }
          
          /* Font size mappings for document.execCommand('fontSize') */
          .edit-content-area font[size="1"] { font-size: 10px; }
          .edit-content-area font[size="2"] { font-size: 13px; }
          .edit-content-area font[size="3"] { font-size: 16px; }
          .edit-content-area font[size="4"] { font-size: 18px; }
          .edit-content-area font[size="5"] { font-size: 24px; }
          .edit-content-area font[size="6"] { font-size: 32px; }
          .edit-content-area font[size="7"] { font-size: 48px; }
          .edit-content-area blockquote { border-left: 4px solid #e5e7eb !important; padding-left: 1rem !important; color: #4b5563 !important; font-style: italic !important; margin: 1rem 0 !important; }
        `}
      </style>

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
          disabled={loading}
          className="
            flex items-center gap-2 px-5 py-2.5 rounded text-white text-sm font-medium
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2] hover:bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            transition-colors duration-200 shadow-sm disabled:opacity-70
          "
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </span>
          ) : (
            <>
              <Save size={16} />
              Save
            </>
          )}
        </button>
      </div>
    </>
  );
}