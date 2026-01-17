import { useRef } from "react";

export default function FooterContentEditor({ footerContent, setFooterContent, handleSave }) {
  const editorRef = useRef(null);

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

  return (
    <>
      {/* FOOTER CONTENT EDITOR */}
      <h3 className="font-semibold mb-2">Footer Content</h3>

      {/* ENHANCED TOOLBAR */}
      <div className="flex flex-wrap gap-1 mb-2 p-2 bg-gray-50 rounded-md border">
        {/* Text Formatting */}
        <button onClick={() => execCommand("bold")} className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-100">Bold</button>
        <button onClick={() => execCommand("italic")} className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-100">Italic</button>
        <button onClick={() => execCommand("underline")} className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-100">Underline</button>
        <button onClick={() => execCommand("strikeThrough")} className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-100">Strikethrough</button>

        {/* Lists */}
        <button onClick={() => execCommand("insertUnorderedList")} className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-100">Bullet List</button>
        <button onClick={() => execCommand("insertOrderedList")} className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-100">Numbered List</button>

        {/* Alignment */}
        <button onClick={() => execCommand("justifyLeft")} className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-100">Align Left</button>
        <button onClick={() => execCommand("justifyCenter")} className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-100">Align Center</button>
        <button onClick={() => execCommand("justifyRight")} className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-100">Align Right</button>
        <button onClick={() => execCommand("justifyFull")} className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-100">Justify</button>

        {/* Font Size */}
        <select onChange={(e) => execCommand("fontSize", e.target.value)} className="px-2 py-1 text-sm border rounded bg-white">
          <option value="">Font Size</option>
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Extra Large</option>
        </select>

        {/* Font Color */}
        <input type="color" onChange={(e) => execCommand("foreColor", e.target.value)} className="w-8 h-8 border rounded cursor-pointer" title="Text Color" />

        {/* Background Color */}
        <input type="color" onChange={(e) => execCommand("backColor", e.target.value)} className="w-8 h-8 border rounded cursor-pointer" title="Background Color" />

        {/* Undo/Redo */}
        <button onClick={() => execCommand("undo")} className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-100">Undo</button>
        <button onClick={() => execCommand("redo")} className="px-3 py-1 text-sm border rounded bg-white hover:bg-gray-100">Redo</button>
      </div>

      {/* ENHANCED EDITOR */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleEditorInput}
        className="
          border rounded-md p-4 min-h-[300px] bg-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          text-gray-800 leading-relaxed
        "
        style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px' }}
        dangerouslySetInnerHTML={{ __html: footerContent }}
      ></div>

      {/* SAVE BUTTON */}
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="
            px-6 py-2 rounded-md text-white
            bg-gradient-to-b from-[#6046B5] to-[#8A63D2]
            hover:from-[#503a95] hover:to-[#7a53c2]
            transition-colors duration-200
          "
        >
          Save Footer Content
        </button>
      </div>
    </>
  );
}