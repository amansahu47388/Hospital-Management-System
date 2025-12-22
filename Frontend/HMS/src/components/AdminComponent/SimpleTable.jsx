import React from "react";

 function SimpleTable({ columns, rows }) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-card overflow-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted ">
            {columns.map((c) => (
              <th key={c.key} className="py-2 px-2">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t last:border-b">
              {columns.map((c) => (
                <td className="py-3 px-2" key={c.key}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default SimpleTable;