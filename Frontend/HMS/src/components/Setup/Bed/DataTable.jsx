import { Pencil, Trash2 } from "lucide-react";

const DataTable = ({ columns, data, onEdit, onDelete, actions = true }) => {
  return (
    <div className="flex-1 bg-white rounded-md overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={`px-3 py-2 ${col.align === 'center' ? 'text-center' : 'text-left'}`}
              >
                {col.label}
              </th>
            ))}
            {actions && <th className="px-3 py-2 text-center">Action</th>}
          </tr>
        </thead>

        <tbody>
          {data.map((item, index) => (
            <tr key={item.id || index} className="border-b hover:bg-gray-50 group">
              {columns.map((col) => (
                <td
                  key={col.key}
                  className={`px-3 py-2 ${col.align === 'center' ? 'text-center' : ''} ${
                    col.primary ? 'text-blue-600 font-medium' : ''
                  }`}
                >
                  {col.render ? col.render(item[col.key], item) : item[col.key]}
                </td>
              ))}

              {actions && (
                <td className="px-3 py-2 text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800
                      opacity-0 group-hover:opacity-100 transition"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>

                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-800
                      opacity-0 group-hover:opacity-100 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {data.length > 0 && (
        <div className="px-3 py-2 text-xs text-gray-500">
          Records: 1 to {data.length} of {data.length}
        </div>
      )}
    </div>
  );
};

export default DataTable;