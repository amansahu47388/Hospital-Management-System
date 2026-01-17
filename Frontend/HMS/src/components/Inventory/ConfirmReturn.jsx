import { X } from "lucide-react";

export default function ConfirmReturn({
  open,
  onClose,
  item,
  onConfirm,
}) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-3">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">

        {/* HEADER */}
        <div
          className="flex justify-between items-center px-5 py-4
          bg-gradient-to-b from-[#6046B5] to-[#8A63D2] text-white"
        >
          <h3 className="font-semibold">Confirm Return</h3>
          <X className="cursor-pointer" onClick={onClose} />
        </div>

        {/* BODY */}
        <div className="p-5 text-sm space-y-3 text-gray-700">
          <p className="font-medium">
            Are you sure you want to return this item?
          </p>

          <div className="flex justify-between">
            <span>Item</span>
            <span className="font-medium">{item.item}</span>
          </div>

          <div className="flex justify-between">
            <span>Category</span>
            <span>{item.category}</span>
          </div>

          <div className="flex justify-between">
            <span>Quantity</span>
            <span>{item.quantity}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            Return
          </button>
        </div>
      </div>
    </div>
  );
}
