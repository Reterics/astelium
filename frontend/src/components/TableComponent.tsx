import React, {useCallback, useEffect, useRef, useState} from 'react';
import {debounce} from 'throttle-debounce';
import {FiTrash, FiRefreshCw, FiSearch, FiPlus, FiSave} from 'react-icons/fi';
import MultiSelectComponent from './MultiSelectComponent';
import SelectComponent from './SelectComponent.tsx';
import Pagination from './Pagination.tsx';
import {CrudField} from './CrudManager.tsx';

export interface TableRow {
  [key: string]: any;
}

export interface FilteredTableRow extends TableRow {
  rowIndex: number;
}

interface TableProps {
  columns: CrudField[];
  data: TableRow[];
  onEdit?: (updatedData: TableRow[]) => Promise<void> | void;
  onDelete?: (id: number | string) => void;
  onCreate?: (itemToAdd?: TableRow) => void;
  noSearch?: boolean;
  addPerLine?: boolean;
  pagination?: boolean;
}

const TableComponent: React.FC<TableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  onCreate,
  noSearch,
  addPerLine,
  pagination,
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

  const debounceInterval = 500;
  const searchRef = useRef<HTMLInputElement>(null);

  const [itemToAdd, setItemToAdd] = useState<TableRow>({});
  const handleFilterChange = (key: string, value: string | string[]) => {
    const column = columns.find((col) => col.key === key);
    if (Array.isArray(value)) {
      if (
        !value.length ||
        (column && column.options && column.options.length === value.length)
      ) {
        return setFilters((prev) => {
          delete prev[key];
          return {...prev};
        });
      }
    }
    setFilters((prev) => ({...prev, [key]: value}));
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const filteredData = tableData
    .reduce((rows, row, index) => {
      if (
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
          if (
            col.type === 'select' &&
            !col.editable &&
            col.key.endsWith('_id')
          ) {
            const shortKey = col.key.substring(0, col.key.length - 3);
            if (
              row[shortKey] &&
              String(row[shortKey].id) === String(filters[col.key])
            ) {
              return true;
            }
          }
          return String(row[col.key]) === String(filters[col.key]);
        }) &&
        columns.some((col) =>
          row[col.key]
            ?.toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      ) {
        rows.push({
          ...row,
          rowIndex: index,
        } as FilteredTableRow);
      }
      return rows;
    }, [])
    .slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    ) as FilteredTableRow[];

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

  const debounceFunc = debounce(
    debounceInterval || 500,
    (value: string) => {
      setSearchQuery(searchRef.current ? searchRef.current.value : value);
    },
    {atBegin: false}
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!e.target) {
        return;
      }
      if (e.key === 'Enter') {
        setSearchQuery((e.target as HTMLInputElement).value as string);
      } else {
        debounceFunc((e.target as HTMLInputElement).value as string);
      }
    },
    [debounceFunc]
  );

  const isResetEnabled = !!columns.filter((col) => col.editable).length;

  return (
    <div className='p-4 pb-1 shadow-md bg-zinc-50 rounded-lg'>
      {(!noSearch || (onCreate && !addPerLine)) && (
        <div className='flex items-center mb-2 space-x-2'>
          <div className='flex items-center space-x-2 flex-1'>
            <FiSearch className='text-zinc-600' />
            <input
              ref={searchRef}
              onKeyDown={handleKeyPress}
              type='text'
              placeholder='Search...'
              className='p-1 border border-zinc-300 rounded-sm bg-transparent text-zinc-900'
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
          {onCreate && !addPerLine && (
            <button
              onClick={() => onCreate()}
              className='flex items-center bg-zinc-800 text-white px-3 py-1 rounded-xs hover:bg-zinc-700'
            >
              <FiPlus className='mr-1' /> Add
            </button>
          )}
        </div>
      )}
      <div className='overflow-auto rounded shadow-md mb-2'>
        <table className='w-full border-collapse border border-zinc-300'>
          <thead>
            <tr className='bg-zinc-200 text-left text-sm font-medium text-zinc-900'>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className='border border-zinc-300 p-2 cursor-pointer'
                  onClick={() =>
                    col.sortable && allowSort && handleSort(col.key)
                  }
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
                  <td
                    key={col.key}
                    className='p-2 border-b border-zinc-300 max-w-[150px] sm:max-w-[200px] md:max-w-[250px]'
                  >
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
                          handleFilterChange={(column, value) => {
                            handleEdit(row.rowIndex, column, value);
                            if (col.props?.onChange) {
                              col.props?.onChange(value, row);
                            }
                          }}
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
                          handleFilterChange={(column, value) => {
                            handleEdit(row.rowIndex, column, value);
                            if (col.props?.onChange) {
                              col.props?.onChange(value, row);
                            }
                          }}
                        />
                      ) : (
                        <input
                          title={changes[rowIndex]?.[col.key] ?? row[col.key]}
                          type={col.type || 'text'}
                          value={changes[rowIndex]?.[col.key] ?? row[col.key]}
                          onChange={(e) => {
                            handleEdit(row.rowIndex, col.key, e.target.value);
                            if (col.props?.onChange) {
                              col.props?.onChange(e, row);
                            }
                          }}
                          className='w-full bg-transparent hover:border-b hover:border-zinc-300 focus:outline-none'
                        />
                      )
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
                <td className='p-4 flex items-end w-fit space-x-2 h-fit border-b border-zinc-300'>
                  {isResetEnabled && (
                    <button
                      className='text-blue-500 cursor-pointer'
                      onClick={() => handleReset(rowIndex)}
                    >
                      <FiRefreshCw />
                    </button>
                  )}
                  <button
                    className='text-red-500 cursor-pointer'
                    onClick={() => onDelete && onDelete(row.id)}
                  >
                    <FiTrash />
                  </button>
                </td>
              </tr>
            ))}

            {addPerLine && (
              <tr key={'addRow'}>
                {columns.map((col) => (
                  <td key={col.key} className='p-2 border-b border-zinc-300'>
                    {col.type === 'select' ? (
                      <SelectComponent
                        defaultLabel={`Select option`}
                        column={col}
                        filters={itemToAdd}
                        handleFilterChange={(_column, value) => {
                          if (col.props?.onChange) {
                            const updatedItem = col.props?.onChange(
                              value,
                              itemToAdd
                            );
                            if (updatedItem) {
                              return setItemToAdd({
                                ...itemToAdd,
                                [col.key]: value,
                              });
                            } else if (updatedItem === false) {
                              return;
                            }
                          }
                          setItemToAdd({...itemToAdd, [col.key]: value});
                        }}
                      />
                    ) : col.type === 'multiselect' ? (
                      <MultiSelectComponent
                        defaultLabel={`Select option`}
                        column={col}
                        filters={itemToAdd}
                        handleFilterChange={(_column, value) => {
                          if (col.props?.onChange) {
                            const updatedItem = col.props?.onChange(
                              value,
                              itemToAdd
                            );
                            if (updatedItem) {
                              return setItemToAdd({
                                ...itemToAdd,
                                [col.key]: value,
                              });
                            } else if (updatedItem === false) {
                              return;
                            }
                          }
                          setItemToAdd({...itemToAdd, [col.key]: value});
                        }}
                      />
                    ) : (
                      <input
                        type={col.type || 'text'}
                        value={itemToAdd[col.key] || ''}
                        onChange={(e) => {
                          if (col.props?.onChange) {
                            const updatedItem = col.props?.onChange(
                              e.target.value,
                              itemToAdd
                            );
                            if (updatedItem) {
                              return setItemToAdd({
                                ...itemToAdd,
                                [col.key]: e.target.value,
                              });
                            } else if (updatedItem === false) {
                              return;
                            }
                          }
                          setItemToAdd({
                            ...itemToAdd,
                            [col.key]: e.target.value,
                          });
                        }}
                        className='w-full bg-transparent border border-zinc-300 focus:outline-none p-1'
                      />
                    )}
                  </td>
                ))}
                <td className='p-2 flex items-end w-fit space-x-2 h-fit border-b border-zinc-300'>
                  <button
                    className='flex items-center bg-zinc-800 text-white px-3 py-1 rounded-xs hover:bg-zinc-700'
                    onClick={() => {
                      if (onCreate && onCreate(itemToAdd)) {
                        setItemToAdd({});
                      }
                    }}
                  >
                    <FiPlus className='mr-1' /> Add
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!!totalPages && pagination !== false && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default TableComponent;
