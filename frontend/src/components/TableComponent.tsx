import React, { useState } from "react";
import { FiTrash, FiRefreshCw, FiChevronDown } from "react-icons/fi";

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  editable?: boolean;
  type?: "text" | "number" | "select" | "multiselect";
  options?: string[];
}

export interface TableRow {
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  onEdit?: (updatedData: TableRow[]) => void;
  onDelete?: (id: number | string) => void;
}

const TableComponent: React.FC<TableProps> = ({ columns, data, onEdit, onDelete }) => {
  const [tableData, setTableData] = useState(data);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [editedRows, setEditedRows] = useState<{ [key: number]: boolean }>({});
  const [changes, setChanges] = useState<{ [key: number]: TableRow }>({});
  const [allowSort, setAllowSort] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: number]: boolean }>({});

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key && prev?.direction === "asc") {
        return { key, direction: "desc" };
      }
      return { key, direction: "asc" };
    });
    setTableData((prev) => {
      return [...prev].sort((a, b) => {
        if (a[key] < b[key]) return sortConfig?.direction === "asc" ? -1 : 1;
        if (a[key] > b[key]) return sortConfig?.direction === "asc" ? 1 : -1;
        return 0;
      });
    });
  };

  const handleEdit = (index: number, key: string, value: any) => {
    let changed = data[index][key] !== value;
    setChanges((prev) => {
      const updatedChanges = { ...prev };
      if (!changed) {
        delete updatedChanges[index];
      } else {
        updatedChanges[index] = { ...updatedChanges[index], [key]: value };
      }
      return updatedChanges;
    });
    setEditedRows((prev) => ({ ...prev, [index]: changed }));
    if (!changed) {
      setAllowSort(!Object.keys(editedRows).length);
    }
  };

  const handleReset = (index: number) => {
    setChanges((prev) => {
      const updatedChanges = { ...prev };
      delete updatedChanges[index];
      return updatedChanges;
    });
    setEditedRows((prev) => {
      const updatedRows = { ...prev };
      delete updatedRows[index];
      return updatedRows;
    });
  };

  const handleBulkUpdate = () => {
    const updatedData = tableData.map((row, index) => ({
      ...row,
      ...(changes[index] || {}),
    }));
    setTableData(updatedData);
    setChanges({});
    setEditedRows({});
    setAllowSort(true);
    if (onEdit) onEdit(updatedData);
  };

  return (
    <div className="p-4 shadow-md bg-zinc-50 rounded-lg">
      <table className="w-full border-collapse border border-zinc-300">
        <thead>
        <tr className="bg-zinc-200">
          {columns.map((col) => (
            <th
              key={col.key}
              className="border border-zinc-300 p-2 cursor-pointer"
              onClick={() => col.sortable && allowSort && handleSort(col.key)}
            >
              {col.label} {col.sortable && allowSort ? "⇅" : ""}
            </th>
          ))}
          <th className="border border-zinc-300 p-2 w-0"> </th>
        </tr>
        </thead>
        <tbody>
        {tableData.map((row, rowIndex) => (
          <tr key={rowIndex} className={editedRows[rowIndex] ? "bg-yellow-100" : ""}>
            {columns.map((col) => (
              <td key={col.key} className="border border-zinc-300 p-2">
                {col.editable ? (
                  col.type === "select" ? (
                    <select
                      value={changes[rowIndex]?.[col.key] ?? row[col.key]}
                      onChange={(e) => handleEdit(rowIndex, col.key, e.target.value)}
                      className="w-full bg-transparent border border-zinc-400 focus:outline-none p-1"
                    >
                      {col.options?.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  ) : col.type === "multiselect" ? (
                    <div className="relative">
                      <button
                        className="w-full bg-transparent border border-zinc-400 focus:outline-none p-1 flex justify-between"
                        onClick={() => setDropdownOpen((prev) => ({ ...prev, [rowIndex]: !prev[rowIndex] }))}
                      >
                        {(changes[rowIndex]?.[col.key]?.join(", ") ?? row[col.key]?.join(", ")) || "Select options"}
                        <FiChevronDown className='self-center' />
                      </button>
                      {dropdownOpen[rowIndex] && (
                        <div className="absolute bg-white border border-zinc-400 mt-1 p-2 shadow-lg w-full z-20">
                          {col.options?.map((option) => (
                            <label key={option} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={changes[rowIndex]?.[col.key]?.includes(option) ?? row[col.key]?.includes(option)}
                                onChange={(e) => {
                                  const selected = changes[rowIndex]?.[col.key] ?? row[col.key] ?? [];
                                  handleEdit(
                                    rowIndex,
                                    col.key,
                                    e.target.checked
                                      ? [...selected, option]
                                      : selected.filter((item: string) => item !== option)
                                  );
                                }}
                              />
                              <span>{option}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <input
                      type={col.type || "text"}
                      value={changes[rowIndex]?.[col.key] ?? row[col.key]}
                      onChange={(e) => handleEdit(rowIndex, col.key, e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-400 focus:outline-none"
                    />
                  )
                ) : (
                  row[col.key]
                )}
              </td>
            ))}
            <td className="p-4 flex items-end w-fit space-x-2 h-fit">
              <button
                className="text-blue-500 cursor-pointer"
                onClick={() => handleReset(rowIndex)}
              >
                <FiRefreshCw />
              </button>
              <button
                className="text-red-500 cursor-pointer"
                onClick={() => onDelete && onDelete(row.id)}
              >
                <FiTrash />
              </button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
      {Object.keys(changes).length > 0 && (
        <button
          className="mt-4 p-2 bg-zinc-800 text-white rounded-md hover:bg-zinc-700"
          onClick={handleBulkUpdate}
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default TableComponent;
