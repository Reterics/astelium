import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {debounce} from 'throttle-debounce';
import {FiTrash, FiRefreshCw, FiSearch, FiPlus, FiSave} from 'react-icons/fi';
import MultiSelectComponent from './MultiSelectComponent';
import SelectComponent from './SelectComponent.tsx';
import Pagination from './Pagination.tsx';
import {CrudField} from './CrudManager.tsx';
import UserAvatar from './UserAvatar.tsx';

export interface TableRow {
  [key: string]: any;
}

export interface FilteredTableRow extends TableRow {
  rowIndex: number;
}

export interface TableAction {
  onClick: (row: TableRow, rowIndex: number) => void;
  icon: ReactNode;
  isActive: (row: TableRow, rowIndex: number) => boolean;
}

interface TableProps {
  columns: CrudField[];
  data: TableRow[];
  onEdit?: (
    updatedData: TableRow[]
  ) => Promise<void | boolean> | void | boolean;
  onDelete?: (id: number | string) => void;
  onCreate?: (itemToAdd?: TableRow) => void | boolean | Promise<void>;
  noSearch?: boolean;
  itemToAdd?: TableRow;
  setItemToAdd?: React.Dispatch<React.SetStateAction<TableRow>>;
  pagination?: boolean;
  actions?: TableAction[];
}

const TableComponent: React.FC<TableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  onCreate,
  noSearch,
  itemToAdd,
  setItemToAdd,
  pagination,
  actions,
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
    let result = !!onEdit;

    if (onEdit) {
      const updates = Object.keys(changes)
        .map((index) => ({
          id: tableData[Number(index)].id,
          ...changes[Number(index)],
        }))
        .filter((d) => d.id) as TableRow[];
      result = !((await onEdit(updates)) === false);
    }
    if (!result) {
      setTableData(updatedData);
    }
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

  const handleAddItemFilterChange = (col: CrudField, value: unknown) => {
    if (col.props?.onChange) {
      const updatedItem = col.props?.onChange(value, {
        ...itemToAdd,
        [col.key]: value,
      });
      if (updatedItem) {
        return setItemToAdd!({
          ...updatedItem,
          [col.key]: value,
        });
      } else if (updatedItem === false) {
        return;
      }
    }
    if (setItemToAdd) {
      setItemToAdd({...itemToAdd, [col.key]: value});
    }
  };

  const isResetEnabled = !!columns.filter((col) => col.editable).length;

  return (
    <div className='bg-zinc-50 rounded'>
      {(!noSearch || (onCreate && !itemToAdd)) && (
        <div className='flex items-center mb-2 space-x-2'>
          <div className='flex items-center space-x-2 flex-1'>
            <FiSearch className='text-zinc-600' />
            <input
              ref={searchRef}
              onKeyDown={handleKeyPress}
              type='text'
              placeholder='Search...'
              className='p-1 border border-zinc-300 rounded-xs bg-white text-zinc-900'
            />
          </div>
          {columns.map((col) =>
            col.type === 'multiselect' ? (
              <MultiSelectComponent
                defaultLabel={col.label || `All`}
                column={col}
                filters={filters as {[key: string]: string[]}}
                handleFilterChange={handleFilterChange}
              />
            ) : col.type === 'select' ? (
              <SelectComponent
                defaultLabel={col.label || `All`}
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
          {onCreate && !itemToAdd && (
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
                key={rowIndex + 'table'}
                className={
                  (editedRows[rowIndex] ? 'bg-yellow-100' : '') +
                  'border-b border-zinc-300'
                }
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className='p-2 max-w-[150px] sm:max-w-[200px] md:max-w-[250px]'
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
                    ) : col.type === 'image' ? (
                      <UserAvatar image={row[col.key]} name={row.name} />
                    ) : (
                      row[col.key]
                    )}
                  </td>
                ))}
                <td className='place-items-end'>
                  <div className='flex space-x-1'>
                    {Array.isArray(actions) &&
                      actions.map(
                        ({onClick, icon, isActive}: TableAction) =>
                          (isActive === undefined ||
                            isActive(row, rowIndex)) && (
                            <button
                              onClick={() => onClick(row, rowIndex)}
                              className='flex items-center bg-zinc-100 text-zinc-500 cursor-pointer px-2.5 py-3 rounded-xs hover:bg-zinc-700'
                            >
                              {icon}
                            </button>
                          )
                      )}
                    {isResetEnabled && changes[rowIndex] && (
                      <button
                        onClick={() => handleReset(rowIndex)}
                        className='flex items-center bg-zinc-100 text-blue-500 cursor-pointer px-2.5 py-3 rounded-xs hover:bg-zinc-700'
                      >
                        <FiRefreshCw className='w-6 h-6' />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className='flex items-center bg-zinc-100 text-red-500 cursor-pointer px-2.5 py-3 rounded-xs hover:bg-zinc-700'
                        onClick={() => onDelete && onDelete(row.id)}
                      >
                        <FiTrash className='w-6 h-6' />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {itemToAdd && onCreate && (
              <tr key={'addRow'}>
                {columns.map((col) => (
                  <td key={col.key} className='p-2 border-b border-zinc-300'>
                    {col.type === 'select' ? (
                      <SelectComponent
                        defaultLabel={`Select option`}
                        column={col}
                        filters={itemToAdd}
                        handleFilterChange={(_column, value) =>
                          handleAddItemFilterChange(col, value)
                        }
                      />
                    ) : col.type === 'multiselect' ? (
                      <MultiSelectComponent
                        defaultLabel={`Select option`}
                        column={col}
                        filters={itemToAdd}
                        handleFilterChange={(_column, value) =>
                          handleAddItemFilterChange(col, value)
                        }
                      />
                    ) : (
                      <input
                        type={col.type || 'text'}
                        value={itemToAdd[col.key] || ''}
                        onChange={(e) =>
                          handleAddItemFilterChange(col, e.target.value)
                        }
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
                        setItemToAdd!({});
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
