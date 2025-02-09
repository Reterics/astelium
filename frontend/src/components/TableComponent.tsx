import React, {useEffect, useState} from 'react';
import {FiTrash, FiRefreshCw, FiSearch, FiPlus, FiSave} from 'react-icons/fi';
import MultiSelectComponent from './MultiSelectComponent';
import SelectComponent, {SelectOptions} from './SelectComponent.tsx';
import Pagination from './Pagination.tsx';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  editable?: boolean;
  type?: 'text' | 'number' | 'select' | 'multiselect';
  options?: SelectOptions;
}

export interface TableRow {
  [key: string]: any;
}

interface TableProps {
  columns: TableColumn[];
  data: TableRow[];
  onEdit?: (updatedData: TableRow[]) => Promise<void> | void;
  onDelete?: (id: number | string) => void;
  onCreate?: () => void;
}

const TableComponent: React.FC<TableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  onCreate,
}) => {
  const [tableData, setTableData] = useState(data);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [editedRows, setEditedRows] = useState<{[key: number]: boolean}>({});
  const [changes, setChanges] = useState<{[key: number]: TableRow}>({});
  const [allowSort, setAllowSort] = useState<boolean>(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<{[key: string]: string | string[]}>(
    {}
  );

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleFilterChange = (key: string, value: string | string[]) => {
    setFilters((prev) => ({...prev, [key]: value}));
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const filteredData = tableData
    .filter(
      (row) =>
        columns.every((col) => {
          if (!filters[col.key]) return true;
          if (col.type === 'multiselect') {
            return (
              Array.isArray(row[col.key]) &&
              row[col.key].some((item: string) =>
                filters[col.key].includes(item)
              )
            );
          }
          return row[col.key] === filters[col.key];
        }) &&
        columns.some((col) =>
          row[col.key]
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
    )
    .slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key && prev?.direction === 'asc') {
        return {key, direction: 'desc'};
      }
      return {key, direction: 'asc'};
    });
    setTableData((prev) => {
      return [...prev].sort((a, b) => {
        if (a[key] < b[key]) return sortConfig?.direction === 'asc' ? -1 : 1;
        if (a[key] > b[key]) return sortConfig?.direction === 'asc' ? 1 : -1;
        return 0;
      });
    });
  };

  const handleEdit = (index: number, key: string, value: any) => {
    const changed = Array.isArray(data[index][key])
      ? data[index][key].sort().join(',') !== value.sort().join(',')
      : data[index][key] !== value;
    setChanges((prev) => {
      const updatedChanges = {...prev};
      if (!changed) {
        delete updatedChanges[index];
      } else {
        updatedChanges[index] = {...updatedChanges[index], [key]: value};
      }
      return updatedChanges;
    });
    setEditedRows((prev) => ({...prev, [index]: changed}));
    if (!changed) {
      setAllowSort(!Object.keys(editedRows).length);
    }
  };

  const handleReset = (index: number) => {
    setChanges((prev) => {
      const updatedChanges = {...prev};
      delete updatedChanges[index];
      return updatedChanges;
    });
    setEditedRows((prev) => {
      const updatedRows = {...prev};
      delete updatedRows[index];
      return updatedRows;
    });
  };

  const handleBulkUpdate = async () => {
    const updatedData = tableData.map((row, index) => ({
      ...row,
      ...(changes[index] || {}),
    }));

    if (onEdit) {
      const updates = Object.keys(changes)
        .map((index) => ({
          id: tableData[Number(index)].id,
          ...changes[Number(index)],
        }))
        .filter((d) => d.id) as TableRow[];
      await onEdit(updates);
    }
    setTableData(updatedData);
    setChanges({});
    setEditedRows({});
    setAllowSort(true);
  };

  return (
    <div className='p-4 pb-1 shadow-md bg-zinc-50 rounded-lg'>
      <div className='flex items-center mb-2 space-x-2'>
        <div className='flex items-center space-x-2 flex-1'>
          <FiSearch className='text-zinc-600' />
          <input
            type='text'
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='p-1 border border-zinc-300 rounded-xs'
          />
        </div>
        {columns.map((col) =>
          col.type === 'multiselect' ? (
            <MultiSelectComponent
              defaultLabel={`All`}
              column={col}
              filters={filters as {[key: string]: string[]}}
              handleFilterChange={handleFilterChange}
            />
          ) : col.type === 'select' ? (
            <SelectComponent
              defaultLabel={`All`}
              column={col}
              filters={filters as {[key: string]: string}}
              handleFilterChange={handleFilterChange}
            />
          ) : null
        )}
        {Object.keys(changes).length > 0 && (
          <button
            className='flex items-center bg-zinc-800 text-white px-2 py-1 rounded-xs hover:bg-zinc-700'
            onClick={handleBulkUpdate}
          >
            <FiSave className='mr-1' /> Save
          </button>
        )}
        <button
          onClick={() => onCreate && onCreate()}
          className='flex items-center bg-zinc-800 text-white px-2 py-1 rounded-xs hover:bg-zinc-700'
        >
          <FiPlus className='mr-1' /> Add
        </button>
      </div>
      <table className='w-full border-collapse border border-zinc-300'>
        <thead>
          <tr className='bg-zinc-200'>
            {columns.map((col) => (
              <th
                key={col.key}
                className='border border-zinc-300 p-2 cursor-pointer'
                onClick={() => col.sortable && allowSort && handleSort(col.key)}
              >
                {col.label} {col.sortable && allowSort ? '⇅' : ''}
              </th>
            ))}
            <th className='border border-zinc-300 p-2 w-0'> </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={editedRows[rowIndex] ? 'bg-yellow-100' : ''}
            >
              {columns.map((col) => (
                <td key={col.key} className='border border-zinc-300 p-2'>
                  {col.editable ? (
                    col.type === 'select' ? (
                      <SelectComponent
                        defaultLabel={`Select option`}
                        column={col}
                        filters={
                          changes[rowIndex]?.[col.key]
                            ? changes[rowIndex]
                            : (row as {[key: string]: string})
                        }
                        handleFilterChange={(column, value) =>
                          handleEdit(rowIndex, column, value)
                        }
                      />
                    ) : col.type === 'multiselect' ? (
                      <MultiSelectComponent
                        defaultLabel={`Select option`}
                        column={col}
                        filters={
                          changes[rowIndex]?.[col.key]
                            ? changes[rowIndex]
                            : (row as {[key: string]: string[]})
                        }
                        handleFilterChange={(column, value) =>
                          handleEdit(rowIndex, column, value)
                        }
                      />
                    ) : (
                      <input
                        type={col.type || 'text'}
                        value={changes[rowIndex]?.[col.key] ?? row[col.key]}
                        onChange={(e) =>
                          handleEdit(rowIndex, col.key, e.target.value)
                        }
                        className='w-full bg-transparent border-b border-zinc-300 focus:outline-none'
                      />
                    )
                  ) : (
                    row[col.key]
                  )}
                </td>
              ))}
              <td className='p-4 flex items-end w-fit space-x-2 h-fit border-b border-zinc-300'>
                <button
                  className='text-blue-500 cursor-pointer'
                  onClick={() => handleReset(rowIndex)}
                >
                  <FiRefreshCw />
                </button>
                <button
                  className='text-red-500 cursor-pointer'
                  onClick={() => onDelete && onDelete(row.id)}
                >
                  <FiTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default TableComponent;
