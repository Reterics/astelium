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
  renderCell?: (
    col: CrudField,
    value: any,
    row: TableRow,
    rowIndex: number,
    context: {
      isEditing: boolean;
      onChange: (val: any) => void;
    }
  ) => React.ReactNode | undefined;
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
  renderCell, // <-- new
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
    <div className='bg-zinc-50 border border-zinc-200'>
      {(!noSearch || (onCreate && !itemToAdd)) && (
        <div className='flex items-center mb-1 space-x-2 px-2 pt-2'>
          <div className='flex items-center space-x-1 flex-1'>
            <FiSearch className='text-zinc-600 w-4 h-4' />
            <input
              ref={searchRef}
              onKeyDown={handleKeyPress}
              type='text'
              placeholder='Search...'
              className='px-1 py-0.5 border border-zinc-300 bg-white text-zinc-900 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none'
              style={{borderRadius: 0, minWidth: 120}}
            />
          </div>
          {columns.map((col) =>
            col.type === 'multiselect' ? (
              <MultiSelectComponent
                key={col.key}
                defaultLabel={col.label || `All`}
                column={col}
                filters={filters as {[key: string]: string[]}}
                handleFilterChange={handleFilterChange}
              />
            ) : col.type === 'select' ? (
              <SelectComponent
                key={col.key}
                defaultLabel={col.label || `All`}
                column={col}
                filters={filters as {[key: string]: string}}
                handleFilterChange={handleFilterChange}
              />
            ) : null
          )}
          {Object.keys(changes).length > 0 && (
            <button
              className='flex items-center bg-zinc-800 text-white px-2 py-1 text-xs hover:bg-zinc-700 border-none'
              onClick={handleBulkUpdate}
              style={{borderRadius: 0}}
            >
              <FiSave className='mr-1' /> Save
            </button>
          )}
          {onCreate && !itemToAdd && (
            <button
              onClick={() => onCreate()}
              className='flex items-center bg-zinc-800 text-white px-3 py-1 text-xs hover:bg-zinc-700 border-none'
              style={{borderRadius: 0}}
            >
              <FiPlus className='mr-1' /> Add
            </button>
          )}
        </div>
      )}
      <div className='overflow-auto border-t border-zinc-200'>
        <table className='w-full border-collapse text-xs'>
          <thead>
            <tr className='bg-zinc-100 text-zinc-700'>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className='border-b border-zinc-200 px-2 py-1 font-semibold text-xs cursor-pointer whitespace-nowrap'
                  onClick={() =>
                    col.sortable && allowSort && handleSort(col.key)
                  }
                  style={{fontWeight: 500}}
                >
                  {col.label} {col.sortable && allowSort ? '⇅' : ''}
                </th>
              ))}
              <th className='border-b border-zinc-200 px-2 py-1 w-0'></th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row, rowIndex) => (
              <tr
                key={rowIndex + 'table'}
                className={`${
                  editedRows[rowIndex] ? 'bg-yellow-50' : ''
                } border-b border-zinc-100`}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className='px-2 py-1 max-w-[160px] overflow-hidden whitespace-nowrap text-ellipsis'
                  >
                    {(() => {
                      const isEditing = !!col.editable;
                      const value =
                        changes[rowIndex]?.[col.key] ?? row[col.key];
                      const onChange = (val: any) => {
                        if (isEditing) handleEdit(row.rowIndex, col.key, val);
                        col.props?.onChange?.(val, row);
                      };
                      const custom = renderCell?.(col, value, row, rowIndex, {
                        isEditing,
                        onChange,
                      });
                      if (custom !== undefined) return custom;

                      if (isEditing) {
                        if (col.type === 'select') {
                          return (
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
                                col.props?.onChange?.(value, row);
                              }}
                            />
                          );
                        }
                        if (col.type === 'multiselect') {
                          return (
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
                                col.props?.onChange?.(value, row);
                              }}
                            />
                          );
                        }
                        return (
                          <input
                            title={changes[rowIndex]?.[col.key] ?? row[col.key]}
                            type={col.type || 'text'}
                            value={changes[rowIndex]?.[col.key] ?? row[col.key]}
                            onChange={(e) => {
                              handleEdit(row.rowIndex, col.key, e.target.value);
                              col.props?.onChange?.(e, row);
                            }}
                            className='w-full bg-transparent px-1 py-0.5 border-b border-zinc-200 focus:border-blue-500 focus:outline-none text-xs'
                            style={{borderRadius: 0}}
                          />
                        );
                      }
                      if (col.type === 'image') {
                        return (
                          <UserAvatar image={row[col.key]} name={row.name} />
                        );
                      }
                      return row[col.key];
                    })()}
                  </td>
                ))}
                <td className='px-2 py-1'>
                  <div className='flex gap-1'>
                    {Array.isArray(actions) &&
                      actions.map(
                        ({onClick, icon, isActive}: TableAction) =>
                          (isActive === undefined ||
                            isActive(row, rowIndex)) && (
                            <button
                              onClick={() => onClick(row, rowIndex)}
                              className='bg-zinc-100 text-zinc-500 hover:bg-zinc-200 px-1 py-1 border-none'
                              style={{borderRadius: 0}}
                            >
                              {icon}
                            </button>
                          )
                      )}
                    {isResetEnabled && changes[rowIndex] && (
                      <button
                        onClick={() => handleReset(rowIndex)}
                        className='bg-zinc-100 text-blue-500 hover:bg-zinc-200 px-1 py-1 border-none'
                        style={{borderRadius: 0}}
                      >
                        <FiRefreshCw className='w-4 h-4' />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        className='bg-zinc-100 text-red-500 hover:bg-zinc-200 px-1 py-1 border-none'
                        onClick={() => onDelete && onDelete(row.id)}
                        style={{borderRadius: 0}}
                      >
                        <FiTrash className='w-4 h-4' />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {itemToAdd && onCreate && (
              <tr key={'addRow'}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className='px-2 py-1 border-b border-zinc-100'
                  >
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
                        className='w-full bg-transparent px-1 py-0.5 border border-zinc-200 focus:border-blue-500 focus:outline-none text-xs'
                        style={{borderRadius: 0}}
                      />
                    )}
                  </td>
                ))}
                <td className='px-2 py-1 flex items-end w-fit space-x-1 h-fit border-b border-zinc-100'>
                  <button
                    className='flex items-center bg-zinc-800 text-white px-2 py-1 text-xs hover:bg-zinc-700'
                    onClick={() => {
                      if (onCreate && onCreate(itemToAdd)) {
                        setItemToAdd!({});
                      }
                    }}
                    style={{borderRadius: 0}}
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
