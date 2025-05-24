import React, {useState, useEffect, useRef, useCallback} from 'react';
import {DndProvider, useDrag, useDrop} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {
  FiPlus,
  FiSearch,
  FiSave,
  FiTrash,
  FiFilter,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiX,
  FiClock,
  FiCalendar,
  FiInbox,
  FiAlertCircle,
} from 'react-icons/fi';
import {CrudField} from './CrudManager';
import {TableRow} from './TableComponent';
import SelectComponent, {SelectOption} from './SelectComponent';
import MultiSelectComponent from './MultiSelectComponent';
import UserAvatar from './UserAvatar';
import {Button} from './ui/Button';
import {Card} from './ui/Card';
import {Input} from './ui/Input';
import {Typography} from './ui/Typography';

// Types
interface TaskListTableProps {
  columns: CrudField[];
  data: TableRow[];
  onEdit?: (
    updatedData: TableRow[]
  ) => Promise<void | boolean> | void | boolean;
  onDelete?: (id: number | string) => void;
  onCreate?: (itemToAdd?: TableRow) => void | boolean | Promise<void>;
  groupedBy?: string;
}

interface TaskItemProps {
  task: TableRow;
  columns: CrudField[];
  index: number;
  isSelected: boolean;
  isExpanded: boolean;
  onSelect: (id: number | string) => void;
  onExpand: (id: number | string) => void;
  onEdit: (id: number | string, key: string, value: any) => void;
  moveTask: (dragIndex: number, hoverIndex: number) => void;
}

interface ColumnHeaderProps {
  column: CrudField;
  onSort: (key: string) => void;
  sortConfig: {key: string; direction: 'asc' | 'desc'} | null;
  onFilter: (key: string) => void;
  activeFilterColumn: string | null;
}

interface SavedView {
  id: string;
  name: string;
  columns: string[];
  groupBy: string | null;
  filters: Record<string, any>;
}

// Constants
const ITEM_TYPE = 'TASK';

// Column Header Component
const ColumnHeader: React.FC<ColumnHeaderProps> = ({
  column,
  onSort,
  sortConfig,
  onFilter,
  activeFilterColumn,
}) => {
  const isSorted = sortConfig?.key === column.key;
  const sortDirection = isSorted ? sortConfig.direction : null;

  return (
    <div
      className='flex items-center justify-between px-3 py-2 bg-zinc-50 border-b border-zinc-200 cursor-pointer hover:bg-zinc-100 transition-all duration-200 hover:shadow-sm group'
      onClick={() => onSort(column.key)}
    >
      <div className='flex items-center gap-2'>
        <Typography
          variant='small'
          className='font-medium text-zinc-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-full group-hover:text-blue-600 transition-colors duration-200'
          title={column.label} // Add tooltip on hover
        >
          {column.label}
        </Typography>
        {isSorted ? (
          <span
            className={`text-blue-500 transition-all duration-300 transform ${sortDirection === 'asc' ? 'rotate-0' : 'rotate-180'} scale-110`}
          >
            ↑
          </span>
        ) : (
          <span className='text-zinc-300 opacity-0 group-hover:opacity-50 transition-opacity duration-200'>
            ↑
          </span>
        )}
      </div>
      {column.filterable !== false && (
        <button
          className='text-zinc-400 hover:text-blue-500 transition-all duration-200 hover:scale-110 transform p-1 rounded-full hover:bg-blue-50'
          onClick={(e) => {
            e.stopPropagation();
            onFilter(column.key);
          }}
        >
          <FiFilter
            size={14}
            className={activeFilterColumn === column.key ? 'text-blue-500' : ''}
          />
        </button>
      )}
    </div>
  );
};

// Task Item Component
const TaskItem: React.FC<TaskItemProps> = ({
  task,
  columns,
  index,
  isSelected,
  isExpanded,
  onSelect,
  onExpand,
  onEdit,
  moveTask,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [editingField, setEditingField] = useState<string | null>(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        editingField &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setEditingField(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingField]);

  const [{isDragging}, drag] = useDrag({
    type: ITEM_TYPE,
    item: {index},
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover(item: {index: number}, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveTask(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  drag(drop(ref));

  // Get status and priority for color coding
  const status = task.status as string;
  const priority = task.priority as string;

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'done':
        return 'bg-green-100 text-green-800';
      case 'in progress':
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'blocked':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'to do':
      case 'todo':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Determine priority color
  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Determine type color
  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'feature':
        return 'bg-purple-100 text-purple-800';
      case 'task':
        return 'bg-blue-100 text-blue-800';
      case 'issue':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={ref}
      className={`flex border-b border-zinc-100 ${isDragging ? 'opacity-50 bg-blue-50 shadow-md scale-[1.02]' : 'opacity-100'} ${isSelected ? 'bg-blue-50' : 'bg-white'} hover:bg-zinc-50 transition-all duration-200 hover:shadow-sm`}
      style={{cursor: 'grab'}}
    >
      <div className='flex items-center px-2 py-2'>
        <div className='relative mr-2 flex items-center'>
          <input
            type='checkbox'
            checked={isSelected}
            onChange={() => onSelect(task.id)}
            className='h-4 w-4 rounded border-zinc-300 text-blue-600 transition-all duration-200 focus:ring-blue-500 hover:border-blue-400 cursor-pointer'
          />
          {isSelected && (
            <div className='absolute inset-0 bg-blue-100 rounded-full scale-150 animate-[pulse_2s_ease-in-out_infinite] opacity-30 pointer-events-none'></div>
          )}
        </div>
        <button
          onClick={() => onExpand(task.id)}
          className='text-zinc-400 hover:text-blue-500 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50 transform hover:scale-110'
        >
          {isExpanded ? (
            <FiChevronDown
              size={16}
              className='transition-transform duration-300 transform rotate-0'
            />
          ) : (
            <FiChevronRight
              size={16}
              className='transition-transform duration-300 transform rotate-0 hover:rotate-45'
            />
          )}
        </button>
      </div>

      {columns.map((column) => (
        <div
          key={column.key}
          className='flex-1 min-w-[120px] max-w-[300px] px-3 py-2 flex items-center overflow-hidden'
        >
          {column.editable &&
          column.type === 'select' &&
          editingField === column.key ? (
            <div className='w-full' ref={dropdownRef}>
              <SelectComponent
                column={column}
                filters={{[column.key]: task[column.key]}}
                handleFilterChange={(key, value) => {
                  onEdit(task.id, key, value);
                  setEditingField(null); // Close edit mode after selection
                }}
                defaultLabel={`Select ${column.label}`}
              />
            </div>
          ) : column.key === 'status' ? (
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)} ${column.editable ? 'cursor-pointer hover:bg-opacity-80 hover:shadow-md hover:scale-105' : ''} transition-all duration-200 transform`}
              onClick={() => column.editable && setEditingField(column.key)}
            >
              {task[column.key]}
            </div>
          ) : column.key === 'type' ? (
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(task[column.key] as string)} ${column.editable ? 'cursor-pointer hover:bg-opacity-80 hover:shadow-md hover:scale-105' : ''} transition-all duration-200 transform`}
              onClick={() => column.editable && setEditingField(column.key)}
            >
              {task[column.key]}
            </div>
          ) : column.key === 'priority' ? (
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)} ${column.editable ? 'cursor-pointer hover:bg-opacity-80 hover:shadow-md hover:scale-105' : ''} transition-all duration-200 transform`}
              onClick={() => column.editable && setEditingField(column.key)}
            >
              {task[column.key]}
            </div>
          ) : column.key === 'project_id' ? (
            <div
              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-zinc-100 text-zinc-800 ${column.editable ? 'cursor-pointer hover:bg-zinc-200 hover:shadow-md hover:scale-105' : ''} transition-all duration-200 transform`}
              onClick={() => column.editable && setEditingField(column.key)}
            >
              {column.options?.find(
                (opt) =>
                  (typeof opt === 'string' ? opt : opt.value) ===
                  task[column.key]
              )
                ? typeof column.options.find(
                    (opt) =>
                      (typeof opt === 'string' ? opt : opt.value) ===
                      task[column.key]
                  ) === 'string'
                  ? task[column.key]
                  : (
                      column.options.find(
                        (opt) =>
                          (opt as SelectOption).value === task[column.key]
                      ) as SelectOption
                    )?.label || task[column.key]
                : task[column.key]}
            </div>
          ) : column.key === 'assigned_to' ? (
            <div
              className={`flex items-center px-2 py-1 rounded ${column.editable ? 'cursor-pointer hover:bg-zinc-50 hover:shadow-md hover:scale-[1.02]' : ''} transition-all duration-200 transform`}
              onClick={() => column.editable && setEditingField(column.key)}
            >
              <div className='transition-transform duration-200 hover:scale-110'>
                <UserAvatar
                  image={task.assigned_to_image}
                  name={task[column.key]}
                />
              </div>
              <span className='ml-2 text-zinc-800 transition-colors duration-200 group-hover:text-blue-600'>
                {task[column.key]}
              </span>
            </div>
          ) : column.type === 'datetime-local' ? (
            <div className='w-full'>
              <div
                className='flex items-center cursor-pointer hover:bg-zinc-50 hover:shadow-md px-2 py-1 rounded transition-all duration-200 group hover:scale-[1.01] transform'
                onClick={() => column.editable && setEditingField(column.key)}
              >
                <FiCalendar className='text-zinc-500 mr-2 group-hover:text-blue-500 transition-colors duration-200' />
                <Typography
                  variant='p'
                  className='text-zinc-800 group-hover:text-zinc-900 transition-colors duration-200'
                >
                  {task[column.key]
                    ? column.key === 'start_time'
                      ? new Date(task[column.key]).toLocaleDateString()
                      : new Date(task[column.key]).toLocaleString()
                    : 'Not set'}
                </Typography>
              </div>
              {column.editable && editingField === column.key && (
                <div
                  className='absolute z-50 animate-fadeIn transform origin-top-left transition-all duration-200'
                  ref={dropdownRef}
                >
                  <div className='bg-white border border-zinc-200 shadow-lg p-3 rounded-md animate-[fadeIn_0.2s_ease-in-out]'>
                    <Input
                      type='datetime-local'
                      value={task[column.key] || ''}
                      onChange={(e) => {
                        onEdit(task.id, column.key, e.target.value);
                      }}
                      className='w-64 h-8 text-sm bg-white border border-zinc-200'
                      autoFocus
                    />
                    <div className='flex justify-end mt-2 space-x-2'>
                      <button
                        className='px-2 py-1 text-xs bg-zinc-100 text-zinc-700 rounded hover:bg-zinc-200 transition-colors'
                        onClick={() => setEditingField(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className='px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                        onClick={() => setEditingField(null)}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : column.key === 'expected_time' ? (
            <div className='w-full'>
              <div
                className='flex items-center cursor-pointer hover:bg-zinc-50 hover:shadow-md px-2 py-1 rounded transition-all duration-200 group hover:scale-[1.01] transform'
                onClick={() => column.editable && setEditingField(column.key)}
              >
                <FiCalendar className='text-zinc-500 mr-2 group-hover:text-blue-500 transition-colors duration-200' />
                <Typography
                  variant='p'
                  className='text-zinc-800 group-hover:text-zinc-900 transition-colors duration-200'
                >
                  {task[column.key] && task.start_time
                    ? (() => {
                        const startDate = new Date(task.start_time);
                        const expectedDate = new Date(startDate);
                        expectedDate.setDate(
                          startDate.getDate() + Number(task[column.key])
                        );
                        return expectedDate.toLocaleDateString();
                      })()
                    : task[column.key]
                      ? `${task[column.key]} days`
                      : 'Not set'}
                </Typography>
              </div>
              {column.editable && editingField === column.key && (
                <div
                  className='absolute z-50 animate-fadeIn transform origin-top-left transition-all duration-200'
                  ref={dropdownRef}
                >
                  <div className='bg-white border border-zinc-200 shadow-lg p-3 rounded-md animate-[fadeIn_0.2s_ease-in-out]'>
                    <div className='flex flex-col space-y-2'>
                      <label className='text-xs text-zinc-600 font-medium animate-[fadeIn_0.3s_ease-in-out]'>
                        Select expected completion date:
                      </label>
                      <Input
                        type='date'
                        value={
                          task.start_time
                            ? (() => {
                                const startDate = new Date(task.start_time);
                                const expectedDate = new Date(startDate);
                                expectedDate.setDate(
                                  startDate.getDate() +
                                    Number(task[column.key] || 0)
                                );
                                return expectedDate.toISOString().split('T')[0];
                              })()
                            : ''
                        }
                        onChange={(e) => {
                          if (task.start_time) {
                            const startDate = new Date(task.start_time);
                            const selectedDate = new Date(e.target.value);
                            // Calculate days difference
                            const diffTime =
                              selectedDate.getTime() - startDate.getTime();
                            const diffDays = Math.ceil(
                              diffTime / (1000 * 60 * 60 * 24)
                            );
                            onEdit(task.id, column.key, diffDays);
                          }
                        }}
                        className='w-64 h-8 text-sm transition-all duration-200 hover:border-blue-300 focus:border-blue-500'
                        autoFocus
                      />
                      <div className='text-xs text-zinc-500 mt-1 animate-[fadeIn_0.4s_ease-in-out]'>
                        {task.start_time
                          ? `Days from start: ${task[column.key] || 0}`
                          : 'Set a start date first to use date selection'}
                      </div>
                      {!task.start_time && (
                        <Input
                          type='number'
                          value={task[column.key] || ''}
                          onChange={(e) => {
                            onEdit(task.id, column.key, e.target.value);
                          }}
                          className='w-64 h-8 text-sm mt-2 transition-all duration-200 hover:border-blue-300 focus:border-blue-500 animate-[fadeIn_0.5s_ease-in-out]'
                          placeholder='Enter days manually'
                        />
                      )}
                      <div className='flex justify-end mt-3 space-x-2 animate-[fadeIn_0.6s_ease-in-out]'>
                        <button
                          className='px-2 py-1 text-xs bg-zinc-100 text-zinc-700 rounded hover:bg-zinc-200 transition-colors'
                          onClick={() => setEditingField(null)}
                        >
                          Cancel
                        </button>
                        <button
                          className='px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
                          onClick={() => setEditingField(null)}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : column.editable ? (
            <div className='w-full'>
              <Input
                value={task[column.key] || ''}
                onChange={(e) => onEdit(task.id, column.key, e.target.value)}
                className='w-full h-8 text-sm border-transparent hover:border-zinc-300 focus:border-blue-500 transition-colors duration-150'
              />
            </div>
          ) : (
            <div className='w-full px-2 py-1'>
              <Typography variant='p' className='text-zinc-800 truncate'>
                {task[column.key]}
              </Typography>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Main TaskListTable Component
const TaskListTable: React.FC<TaskListTableProps> = ({
  columns,
  data,
  onEdit,
  onDelete,
  onCreate,
  groupedBy = 'status',
}) => {
  // State
  const [tasks, setTasks] = useState<TableRow[]>(data);
  const [selectedTasks, setSelectedTasks] = useState<(number | string)[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<(number | string)[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(
    null
  );
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.map((col) => col.key)
  );
  const [savedViews, setSavedViews] = useState<SavedView[]>([
    {
      id: 'default',
      name: 'Default View',
      columns: columns.map((col) => col.key),
      groupBy: 'status',
      filters: {},
    },
  ]);
  const [activeView, setActiveView] = useState<string>('default');
  // Initialize timeline view based on whether tasks have start_time values
  const [isTimelineView, setIsTimelineView] = useState<boolean>(() => {
    // Default to false, but we'll check if we should show timeline by default in useEffect
    return false;
  });
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] =
    useState<boolean>(false);
  const [editedTasks, setEditedTasks] = useState<
    Record<string | number, Record<string, any>>
  >({});

  // Refs for column settings dropdown
  const columnSettingsButtonRef = useRef<HTMLButtonElement>(null);
  const columnSettingsDropdownRef = useRef<HTMLDivElement>(null);
  // State to track if timeline view is available
  const [timelineAvailable, setTimelineAvailable] = useState<boolean>(false);

  // State for timeline navigation
  const [timelineStartDate, setTimelineStartDate] = useState<Date>(new Date());
  const [timelineViewMode, setTimelineViewMode] = useState<
    'current' | 'next' | 'last'
  >('current');

  // Update tasks when data changes
  useEffect(() => {
    setTasks(data);

    // Check if any tasks have start_time values
    const hasTasksWithDates = data.some((task) => {
      if (!task.start_time) return false;

      // Check if it's a valid date
      if (
        typeof task.start_time === 'string' ||
        typeof task.start_time === 'number'
      ) {
        const date = new Date(task.start_time);
        return !isNaN(date.getTime());
      }

      return false;
    });

    // Update timeline availability state
    setTimelineAvailable(hasTasksWithDates);
  }, [data]);

  // Handle clicks outside the column settings dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isColumnSettingsOpen &&
        columnSettingsDropdownRef.current &&
        !columnSettingsDropdownRef.current.contains(event.target as Node) &&
        columnSettingsButtonRef.current &&
        !columnSettingsButtonRef.current.contains(event.target as Node)
      ) {
        setIsColumnSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isColumnSettingsOpen]);

  // Handle task selection
  const handleSelectTask = (id: number | string) => {
    setSelectedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  // Handle task expansion
  const handleExpandTask = (id: number | string) => {
    setExpandedTasks((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  // Handle column sorting
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return {key, direction: prev.direction === 'asc' ? 'desc' : 'asc'};
      }
      return {key, direction: 'asc'};
    });
  };

  // Handle column filtering
  const handleFilter = (key: string) => {
    setActiveFilterColumn((prev) => (prev === key ? null : key));
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle task editing
  const handleEditTask = (id: number | string, key: string, value: any) => {
    setEditedTasks((prev) => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [key]: value,
      },
    }));

    // Update the task in the local state for immediate feedback
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? {...task, [key]: value} : task))
    );
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    if (!onEdit) return;

    const updatedTasks = Object.entries(editedTasks).map(([id, changes]) => ({
      id: id,
      ...changes,
    }));

    await onEdit(updatedTasks as TableRow[]);
    setEditedTasks({});
  };

  // Handle task reordering
  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setTasks((prev) => {
      const newTasks = [...prev];
      const draggedTask = newTasks[dragIndex];
      newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, draggedTask);
      return newTasks;
    });
  }, []);

  // Handle column visibility toggle
  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns((prev) =>
      prev.includes(key) ? prev.filter((col) => col !== key) : [...prev, key]
    );
  };

  // Handle saving view
  const saveCurrentView = (name: string) => {
    const newView: SavedView = {
      id: Date.now().toString(),
      name,
      columns: visibleColumns,
      groupBy: groupedBy,
      filters,
    };

    setSavedViews((prev) => [...prev, newView]);
    setActiveView(newView.id);
  };

  // Handle loading view
  const loadView = (viewId: string) => {
    const view = savedViews.find((v) => v.id === viewId);
    if (!view) return;

    setVisibleColumns(view.columns);
    setFilters(view.filters);
    setActiveView(viewId);
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter((task) => {
      // Search filter
      const matchesSearch = Object.values(task).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      );

      // Column filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        return String(task[key]) === String(value);
      });

      return matchesSearch && matchesFilters;
    })
    .sort((a, b) => {
      if (!sortConfig) return 0;

      const {key, direction} = sortConfig;

      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Group tasks if groupedBy is provided
  const groupedTasks: Record<string, TableRow[]> = groupedBy
    ? filteredTasks.reduce(
        (acc, task) => {
          const group = String(task[groupedBy] || 'Uncategorized');
          acc[group] = acc[group] || [];
          acc[group].push(task);
          return acc;
        },
        {} as Record<string, TableRow[]>
      )
    : {'All Tasks': filteredTasks};

  // Handle batch actions
  const handleBatchDelete = () => {
    if (!onDelete) return;
    selectedTasks.forEach((id) => onDelete(id));
    setSelectedTasks([]);
  };

  const handleBatchEdit = (key: string, value: any) => {
    selectedTasks.forEach((id) => handleEditTask(id, key, value));
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map((task) => task.id));
    }
  };

  // Helper function to get the start of the week for a given date
  const getStartOfWeek = (date: Date): Date => {
    const result = new Date(date);
    const day = result.getDay();
    const diff = result.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
    result.setDate(diff);
    result.setHours(0, 0, 0, 0);
    return result;
  };

  // Helper function to navigate between weeks
  const navigateTimeline = (direction: 'prev' | 'next') => {
    setTimelineStartDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === 'next') {
        newDate.setDate(newDate.getDate() + 7);
      } else {
        newDate.setDate(newDate.getDate() - 7);
      }
      return newDate;
    });
  };
  // Render timeline view
  // Render timeline view
  const renderTimelineView = () => {
    // Calculate the date range for the timeline
    // Be lenient with what we consider a valid start_time
    const tasksWithDates = filteredTasks.filter((task) => {
      if (!task.start_time) return false;

      // Check if it's a valid date
      if (
        typeof task.start_time === 'string' ||
        typeof task.start_time === 'number'
      ) {
        const date = new Date(task.start_time);
        if (!isNaN(date.getTime())) {
          return true;
        }

        // If it's a string that failed to parse, check if it looks like a date
        if (typeof task.start_time === 'string') {
          // Check if it looks like a date string (contains numbers and separators)
          return /\d/.test(task.start_time) && /[/\-.]/.test(task.start_time);
        }
      }

      return false;
    });

    // Log a message if no tasks have valid start_time
    if (tasksWithDates.length === 0) {
      console.log(
        'No tasks with valid start_time found. Please set start dates for your tasks.'
      );
    }

    if (tasksWithDates.length === 0) {
      return (
        <div className='mt-4 border border-zinc-200 rounded-md p-4'>
          <div className='flex items-center justify-between mb-4'>
            <Typography variant='h6' className='font-medium'>
              Timeline View
            </Typography>
            <Button
              variant='outline'
              onClick={() => setIsTimelineView(false)}
              className='text-xs'
            >
              <FiX className='mr-1' /> Close Timeline
            </Button>
          </div>
          <div className='p-8 text-center'>
            <Typography variant='p' className='text-zinc-500'>
              No tasks with start dates available. Please set start dates for
              your tasks to view them in the timeline.
            </Typography>
          </div>
        </div>
      );
    }

    // Calculate the visible date range based on the current view mode

    // Set the start and end dates based on the view mode
    let visibleStartDate: Date;
    let visibleEndDate: Date;

    // Use the timelineStartDate as the reference point
    const referenceDate = new Date(timelineStartDate);
    const referenceWeekStart = getStartOfWeek(referenceDate);

    switch (timelineViewMode) {
      case 'last':
        // Last week
        visibleStartDate = new Date(referenceWeekStart);
        visibleStartDate.setDate(visibleStartDate.getDate() - 7);
        visibleEndDate = new Date(visibleStartDate);
        visibleEndDate.setDate(visibleStartDate.getDate() + 7);
        break;
      case 'next':
        // Next week
        visibleStartDate = new Date(referenceWeekStart);
        visibleStartDate.setDate(visibleStartDate.getDate() + 7);
        visibleEndDate = new Date(visibleStartDate);
        visibleEndDate.setDate(visibleStartDate.getDate() + 7);
        break;
      case 'current':
      default:
        // Current week
        visibleStartDate = new Date(referenceWeekStart);
        visibleEndDate = new Date(visibleStartDate);
        visibleEndDate.setDate(visibleStartDate.getDate() + 7);
        break;
    }

    // Add buffer days to the range
    visibleStartDate.setDate(visibleStartDate.getDate() - 1); // One day before
    visibleEndDate.setDate(visibleEndDate.getDate() + 1); // One day after

    // Filter tasks to only show those within the visible date range
    const visibleTasks = tasksWithDates.filter((task) => {
      const taskDate = new Date(task.start_time);
      return taskDate >= visibleStartDate && taskDate <= visibleEndDate;
    });

    // Calculate the total number of days in the range
    const totalDays = Math.ceil(
      (visibleEndDate.getTime() - visibleStartDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    // Generate date markers for the timeline
    const dateMarkers = [];
    const markerCount = Math.min(7, totalDays); // Show at most 7 markers
    const dayStep = Math.max(1, Math.floor(totalDays / (markerCount - 1)));

    for (let i = 0; i < markerCount; i++) {
      const markerDate = new Date(visibleStartDate);
      markerDate.setDate(visibleStartDate.getDate() + i * dayStep);
      dateMarkers.push(markerDate);
    }

    // If the last marker isn't close to the visible end date, add the end date as the final marker
    const lastMarkerDate = dateMarkers[dateMarkers.length - 1];
    if (
      Math.abs(lastMarkerDate.getTime() - visibleEndDate.getTime()) >
      24 * 60 * 60 * 1000
    ) {
      dateMarkers.push(visibleEndDate);
    }

    // Function to calculate position percentage based on date
    const getPositionPercentage = (date: Date) => {
      const timeRange = visibleEndDate.getTime() - visibleStartDate.getTime();
      const timeFromStart = date.getTime() - visibleStartDate.getTime();
      return (timeFromStart / timeRange) * 100;
    };

    // Function to get task status color
    const getTaskStatusColor = (status: string) => {
      switch (status?.toLowerCase()) {
        case 'completed':
        case 'done':
        case 'closed':
          return 'bg-green-200 border-green-400';
        case 'in progress':
        case 'in-progress':
        case 'review':
          return 'bg-blue-200 border-blue-400';
        case 'blocked':
          return 'bg-red-200 border-red-400';
        case 'pending':
        case 'to do':
        case 'todo':
        case 'open':
          return 'bg-yellow-200 border-yellow-400';
        default:
          return 'bg-gray-200 border-gray-400';
      }
    };

    // Format date range for display
    const formatDateRange = () => {
      const startFormatted = visibleStartDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      const endFormatted = visibleEndDate.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
      return `${startFormatted} - ${endFormatted}`;
    };

    // Get week label based on timelineViewMode
    const getWeekLabel = () => {
      const today = new Date();
      const currentWeekStart = getStartOfWeek(today);

      // Compare the visible start date with the current week start
      const diffTime = visibleStartDate.getTime() - currentWeekStart.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < -3) return 'Previous Week';
      if (diffDays > 3) return 'Next Week';
      return 'Current Week';
    };

    return (
      <div className='mt-4 border border-zinc-200 rounded-md p-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center space-x-2'>
            <Typography variant='h6' className='font-medium'>
              Timeline View
            </Typography>
            <span className='text-zinc-400 text-sm'>
              ({getWeekLabel()}: {formatDateRange()})
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              onClick={() => navigateTimeline('prev')}
              className='text-xs px-2 py-1'
            >
              ← Previous Week
            </Button>
            <Button
              variant='outline'
              onClick={() => {
                setTimelineStartDate(new Date());
                setTimelineViewMode('current');
              }}
              className='text-xs px-2 py-1'
            >
              Today
            </Button>
            <Button
              variant='outline'
              onClick={() => navigateTimeline('next')}
              className='text-xs px-2 py-1'
            >
              Next Week →
            </Button>
            <Button
              variant='outline'
              onClick={() => setIsTimelineView(false)}
              className='text-xs ml-2'
            >
              <FiX className='mr-1' /> Close
            </Button>
          </div>
        </div>

        {/* Timeline header with date markers */}
        <div className='mb-2 pl-[25%] pr-4'>
          <div className='flex justify-between'>
            {dateMarkers.map((date, index) => (
              <div
                key={index}
                className='text-xs text-zinc-500 flex flex-col items-center'
              >
                <div>
                  {date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                <div className='h-2 w-0.5 bg-zinc-300 mt-1'></div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-col space-y-2'>
          {visibleTasks
            .map((task) => {
              // Validate start_time format and parse date
              let startDate;
              // Try to parse the start_time as a date
              startDate = new Date(task.start_time);

              // If invalid, try different formats
              if (
                isNaN(startDate.getTime()) &&
                typeof task.start_time === 'string'
              ) {
                // Try DD/MM/YYYY format
                const dateParts = task.start_time.split(/[/\-.]/);
                if (dateParts.length === 3) {
                  // Try different date part orders (MM/DD/YYYY, DD/MM/YYYY, YYYY/MM/DD)
                  const possibleDates = [
                    new Date(
                      parseInt(dateParts[2]),
                      parseInt(dateParts[0]) - 1,
                      parseInt(dateParts[1])
                    ), // MM/DD/YYYY
                    new Date(
                      parseInt(dateParts[2]),
                      parseInt(dateParts[1]) - 1,
                      parseInt(dateParts[0])
                    ), // DD/MM/YYYY
                    new Date(
                      parseInt(dateParts[0]),
                      parseInt(dateParts[1]) - 1,
                      parseInt(dateParts[2])
                    ), // YYYY/MM/DD
                  ];

                  // Use the first valid date
                  for (const possibleDate of possibleDates) {
                    if (!isNaN(possibleDate.getTime())) {
                      startDate = possibleDate;
                      break;
                    }
                  }
                }
              }

              // If still invalid, skip this task
              if (isNaN(startDate.getTime())) {
                return null;
              }

              const endDate = new Date(startDate);

              // If expected_time exists, calculate end date
              if (task.expected_time) {
                try {
                  // Handle different types of expected_time values
                  let expectedDays;

                  if (typeof task.expected_time === 'number') {
                    expectedDays = task.expected_time;
                  } else if (typeof task.expected_time === 'string') {
                    // Try to parse as number
                    expectedDays = parseFloat(task.expected_time);

                    // If it's not a valid number, check if it's a date string
                    if (isNaN(expectedDays)) {
                      try {
                        const expectedDate = new Date(task.expected_time);
                        if (!isNaN(expectedDate.getTime())) {
                          // Calculate days between start and expected date
                          const diffTime =
                            expectedDate.getTime() - startDate.getTime();
                          expectedDays = Math.ceil(
                            diffTime / (1000 * 60 * 60 * 24)
                          );
                        }
                      } catch {
                        // If parsing fails, we'll fall back to other methods
                      }
                    }
                  }

                  if (
                    expectedDays &&
                    !isNaN(expectedDays) &&
                    expectedDays > 0
                  ) {
                    endDate.setDate(startDate.getDate() + expectedDays);
                  } else {
                    endDate.setDate(startDate.getDate() + 1); // Default to 1 day
                  }
                } catch {
                  // If there's an error, default to 1 day
                  endDate.setDate(startDate.getDate() + 1);
                }
              } else {
                // Default to 1 day if no expected_time
                endDate.setDate(startDate.getDate() + 1);
              }

              // Calculate position and width percentages
              const leftPosition = getPositionPercentage(startDate);
              const rightPosition = getPositionPercentage(endDate);
              const width = rightPosition - leftPosition;

              // Skip tasks that would be too narrow to display properly
              if (width < 0.5) {
                return null;
              }

              return (
                <div
                  key={task.id}
                  className='flex items-center p-2 border-b border-zinc-100 hover:bg-zinc-50 transition-colors duration-200'
                >
                  <div className='w-1/4 pr-4'>
                    <Typography
                      variant='p'
                      className='font-medium truncate'
                      title={task.title}
                    >
                      {task.title}
                    </Typography>
                    <div className='text-xs text-zinc-500'>
                      {startDate.toLocaleDateString()}{' '}
                      {task.expected_time ? `(${task.expected_time} days)` : ''}
                    </div>
                  </div>
                  <div className='w-3/4 relative h-10 bg-zinc-100 rounded'>
                    <div
                      className={`absolute h-full ${getTaskStatusColor(task.status as string)} rounded border shadow-sm hover:shadow-md transition-shadow duration-200`}
                      style={{
                        left: `${leftPosition}%`,
                        width: `${Math.max(width, 2)}%`,
                      }}
                      title={`${task.title} (${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()})`}
                    >
                      <div className='px-2 py-1 text-xs truncate'>
                        {task.title}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
            .filter(Boolean)}
        </div>

        {visibleTasks.length === 0 && (
          <div className='p-8 text-center'>
            <Typography variant='p' className='text-zinc-500'>
              No tasks with start dates in the current date range. Try
              navigating to a different week or adding tasks with start dates in
              this period.
            </Typography>
          </div>
        )}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className='overflow-hidden'>
        {/* Toolbar */}
        <div className='flex items-center justify-between p-3 border-b border-zinc-200 bg-white'>
          <div className='flex items-center space-x-2'>
            <div className='relative'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400' />
              <Input
                type='text'
                placeholder='Search tasks...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-9 h-9 w-64'
              />
            </div>

            <select
              value={activeView}
              onChange={(e) => loadView(e.target.value)}
              className='h-9 border border-zinc-200 rounded px-3 text-sm'
            >
              {savedViews.map((view) => (
                <option key={view.id} value={view.id}>
                  {view.name}
                </option>
              ))}
            </select>

            <Button
              variant='outline'
              onClick={() => saveCurrentView(`View ${savedViews.length + 1}`)}
              className='h-9'
            >
              <FiSave className='mr-1' /> Save View
            </Button>
          </div>

          <div className='flex items-center space-x-2'>
            <Button
              variant={'outline'}
              onClick={() => setIsTimelineView(!isTimelineView)}
              className={`h-9 relative ${timelineAvailable && !isTimelineView ? 'animate-pulse' : ''}`}
            >
              {isTimelineView ? (
                <FiCalendar className='mr-1' />
              ) : (
                <FiClock className='mr-1' />
              )}
              {isTimelineView ? 'Table View' : 'Timeline View'}
              {timelineAvailable && !isTimelineView && (
                <span className='absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full transform -translate-y-1/2 translate-x-1/2'></span>
              )}
            </Button>

            <div className='relative'>
              <Button
                ref={columnSettingsButtonRef}
                variant='outline'
                onClick={() => {
                  setIsColumnSettingsOpen(!isColumnSettingsOpen);
                }}
                className='h-9'
              >
                <FiSettings className='mr-1' /> Columns
              </Button>

              {/* Column visibility dropdown */}
              {isColumnSettingsOpen && (
                <div
                  ref={columnSettingsDropdownRef}
                  className='absolute right-0 top-full mt-1 bg-white border border-zinc-200 shadow-lg rounded-md p-2 z-50 w-64'
                >
                  <Typography
                    variant='small'
                    className='font-medium mb-2 pb-2 border-b border-zinc-100'
                  >
                    Toggle Columns
                  </Typography>
                  {columns.map((column) => (
                    <div
                      key={column.key}
                      className='flex items-center justify-between py-1'
                    >
                      <Typography variant='p' className='text-zinc-700'>
                        {column.label}
                      </Typography>
                      <input
                        type='checkbox'
                        checked={visibleColumns.includes(column.key)}
                        onChange={() => toggleColumnVisibility(column.key)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedTasks.length > 0 && (
              <div className='flex items-center space-x-2 ml-4 p-2 bg-blue-50 rounded'>
                <Typography variant='p' className='text-blue-700'>
                  {selectedTasks.length} selected
                </Typography>

                {/* Batch Edit Dropdown */}
                <div className='relative'>
                  <Button variant='outline' className='h-8 text-xs'>
                    Batch Edit
                  </Button>
                  <div className='absolute left-0 top-full mt-1 bg-white border border-zinc-200 shadow-lg rounded-md p-2 z-50 w-64'>
                    <Typography
                      variant='small'
                      className='font-medium mb-2 pb-2 border-b border-zinc-100'
                    >
                      Edit Selected Tasks
                    </Typography>
                    {columns
                      .filter((col) => col.editable)
                      .map((column) => (
                        <div key={column.key} className='py-1'>
                          <Typography
                            variant='p'
                            className='text-zinc-700 mb-1'
                          >
                            {column.label}
                          </Typography>
                          {column.type === 'select' ? (
                            <select
                              className='w-full border border-zinc-200 rounded px-2 py-1 text-sm'
                              onChange={(e) =>
                                handleBatchEdit(column.key, e.target.value)
                              }
                            >
                              <option value=''>Select...</option>
                              {column.options?.map((option) => (
                                <option
                                  key={
                                    typeof option === 'string'
                                      ? option
                                      : option.value
                                  }
                                  value={
                                    typeof option === 'string'
                                      ? option
                                      : option.value
                                  }
                                >
                                  {typeof option === 'string'
                                    ? option
                                    : option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              type={column.type || 'text'}
                              className='w-full'
                              placeholder={`Set ${column.label}`}
                              onChange={(e) =>
                                handleBatchEdit(column.key, e.target.value)
                              }
                            />
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                <Button
                  variant='destructive'
                  onClick={handleBatchDelete}
                  className='h-8 text-xs'
                >
                  <FiTrash className='mr-1' /> Delete
                </Button>
              </div>
            )}

            {Object.keys(editedTasks).length > 0 && (
              <Button
                variant='primary'
                onClick={handleSaveChanges}
                className='h-9'
              >
                <FiSave className='mr-1' /> Save Changes
              </Button>
            )}

            {onCreate && (
              <Button
                variant='primary'
                onClick={() => onCreate()}
                className='h-9'
              >
                <FiPlus className='mr-1' /> Add Task
              </Button>
            )}
          </div>
        </div>

        {/* Timeline View */}
        {isTimelineView && renderTimelineView()}

        {/* Table View */}
        {!isTimelineView && (
          <div className='overflow-auto'>
            {/* Table Header */}
            <div className='flex border-b border-zinc-200 bg-white sticky top-0 z-10 shadow-sm'>
              <div className='w-12 px-2 py-2 bg-zinc-50 border-b border-zinc-200 flex items-center justify-center'>
                <div className='relative flex items-center'>
                  <input
                    type='checkbox'
                    checked={
                      selectedTasks.length === filteredTasks.length &&
                      filteredTasks.length > 0
                    }
                    onChange={handleSelectAll}
                    className='h-4 w-4 rounded border-zinc-300 text-blue-600 transition-all duration-200 focus:ring-blue-500 hover:border-blue-400 cursor-pointer'
                  />
                  {selectedTasks.length > 0 && (
                    <div className='absolute inset-0 bg-blue-100 rounded-full scale-150 animate-[pulse_2s_ease-in-out_infinite] opacity-30 pointer-events-none'></div>
                  )}
                  {selectedTasks.length > 0 &&
                    selectedTasks.length < filteredTasks.length && (
                      <div className='absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] pointer-events-none'></div>
                    )}
                </div>
              </div>

              {columns
                .filter((col) => visibleColumns.includes(col.key))
                .map((column) => (
                  <div
                    key={column.key}
                    className='flex-1 min-w-[120px] max-w-[300px] overflow-hidden'
                  >
                    <ColumnHeader
                      column={column}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      onFilter={handleFilter}
                      activeFilterColumn={activeFilterColumn}
                    />
                  </div>
                ))}
            </div>

            {/* Filter Row (visible when a filter is active) */}
            {activeFilterColumn && (
              <div className='flex border-b border-zinc-200 bg-white p-2'>
                <div className='flex items-center space-x-2'>
                  <Typography variant='p' className='font-medium'>
                    Filter:{' '}
                    {
                      columns.find((col) => col.key === activeFilterColumn)
                        ?.label
                    }
                  </Typography>

                  {(() => {
                    const column = columns.find(
                      (col) => col.key === activeFilterColumn
                    );
                    if (!column) return null;

                    if (column.type === 'select') {
                      return (
                        <SelectComponent
                          column={column}
                          filters={filters}
                          handleFilterChange={(key, value) =>
                            handleFilterChange(key, value)
                          }
                        />
                      );
                    }

                    if (column.type === 'multiselect') {
                      return (
                        <MultiSelectComponent
                          column={column}
                          filters={filters as any}
                          handleFilterChange={(key, value) =>
                            handleFilterChange(key, value)
                          }
                        />
                      );
                    }

                    return (
                      <Input
                        type='text'
                        value={filters[activeFilterColumn] || ''}
                        onChange={(e) =>
                          handleFilterChange(activeFilterColumn, e.target.value)
                        }
                        className='w-64'
                      />
                    );
                  })()}

                  <Button
                    variant='outline'
                    onClick={() => {
                      setFilters((prev) => {
                        const newFilters = {...prev};
                        delete newFilters[activeFilterColumn];
                        return newFilters;
                      });
                      setActiveFilterColumn(null);
                    }}
                    className='h-8 text-xs'
                  >
                    <FiX className='mr-1' /> Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Task Groups */}
            {Object.entries(groupedTasks).map(([group, groupTasks]) => (
              <div key={group} className='border-b border-zinc-200'>
                <div className='flex items-center justify-between px-3 py-2 bg-zinc-100 hover:bg-zinc-200 transition-colors duration-150'>
                  <Typography
                    variant='small'
                    className='font-medium text-zinc-700 flex items-center'
                  >
                    <span className='inline-block w-2 h-2 rounded-full bg-blue-500 mr-2'></span>
                    {group}{' '}
                    <span className='ml-1 text-zinc-500 text-xs'>
                      ({groupTasks.length})
                    </span>
                  </Typography>
                </div>

                {/* Tasks */}
                {groupTasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <TaskItem
                      task={task}
                      columns={columns.filter((col) =>
                        visibleColumns.includes(col.key)
                      )}
                      index={index}
                      isSelected={selectedTasks.includes(task.id)}
                      isExpanded={expandedTasks.includes(task.id)}
                      onSelect={handleSelectTask}
                      onExpand={handleExpandTask}
                      onEdit={handleEditTask}
                      moveTask={moveTask}
                    />

                    {/* Expanded Task Details */}
                    {expandedTasks.includes(task.id) && (
                      <div className='bg-zinc-50 p-4 border-b border-zinc-100 animate-fadeIn shadow-inner origin-top transition-all duration-300 ease-in-out'>
                        <div className='mb-3 pb-2 border-b border-zinc-200'>
                          <Typography
                            variant='h6'
                            className='font-medium mb-1 text-zinc-800 animate-[fadeIn_0.3s_ease-in-out]'
                          >
                            {task.title}
                          </Typography>
                          <Typography
                            variant='p'
                            className='text-zinc-600 animate-[fadeIn_0.4s_ease-in-out]'
                          >
                            {task.description || 'No description provided.'}
                          </Typography>
                        </div>
                        <div className='grid grid-cols-2 gap-x-6 gap-y-2'>
                          {columns
                            .filter((col) => !visibleColumns.includes(col.key))
                            .map((column) => (
                              <div
                                key={column.key}
                                className='flex items-start py-1 border-b border-zinc-100'
                              >
                                <Typography
                                  variant='p'
                                  className='font-medium text-zinc-700 w-1/3'
                                >
                                  {column.label}:
                                </Typography>
                                <Typography
                                  variant='p'
                                  className='text-zinc-800 w-2/3'
                                >
                                  {task[column.key] || '-'}
                                </Typography>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {/* Empty State */}
                {groupTasks.length === 0 && (
                  <div className='p-6 text-center'>
                    <div className='inline-flex items-center justify-center w-20 h-20 rounded-full bg-zinc-100 mb-3 animate-[pulse_3s_ease-in-out_infinite] overflow-hidden relative group'>
                      <div className='absolute inset-0 bg-gradient-to-r from-blue-50 to-zinc-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      <FiInbox
                        size={32}
                        className='text-zinc-400 group-hover:text-blue-500 transition-colors duration-300 transform group-hover:scale-110 z-10'
                      />
                    </div>
                    <Typography
                      variant='h6'
                      className='text-zinc-600 mb-2 animate-[fadeIn_0.5s_ease-in-out]'
                    >
                      No tasks in this group yet
                    </Typography>
                    <Typography
                      variant='p'
                      className='text-zinc-400 max-w-xs mx-auto animate-[fadeIn_0.7s_ease-in-out]'
                    >
                      Create a new task or drag an existing task here to get
                      started.
                    </Typography>
                    {onCreate && (
                      <Button
                        variant='outline'
                        className='mt-4 animate-[fadeIn_0.9s_ease-in-out]'
                        onClick={() => onCreate()}
                      >
                        <FiPlus className='mr-1' /> Add a new task
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Empty State */}
            {filteredTasks.length === 0 && (
              <div className='p-12 text-center'>
                <div className='relative inline-block mb-4'>
                  <div className='inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-zinc-50 to-blue-50 mb-3 relative overflow-hidden'>
                    <div className='absolute inset-0 bg-white/50 rounded-full animate-[pulse_3s_ease-in-out_infinite]'></div>
                    <FiSearch
                      size={40}
                      className='text-blue-400 transform -rotate-12 relative z-10'
                    />
                  </div>
                  <div className='absolute top-0 right-0 animate-[bounce_2s_ease-in-out_infinite]'>
                    <div className='flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 shadow-sm'>
                      <FiAlertCircle size={20} className='text-amber-500' />
                    </div>
                  </div>
                </div>
                <Typography
                  variant='h6'
                  className='text-zinc-700 mb-3 animate-[fadeIn_0.5s_ease-in-out]'
                >
                  No matching tasks found
                </Typography>
                <Typography
                  variant='p'
                  className='text-zinc-500 max-w-md mx-auto mb-2 animate-[fadeIn_0.7s_ease-in-out]'
                >
                  We couldn't find any tasks that match your current filters.
                </Typography>
                <Typography
                  variant='small'
                  className='text-zinc-400 block max-w-md mx-auto mb-4 animate-[fadeIn_0.9s_ease-in-out]'
                >
                  Try adjusting your search criteria or clearing filters to see
                  more results.
                </Typography>
                <div className='flex items-center justify-center gap-3 animate-[fadeIn_1.1s_ease-in-out]'>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setSearchQuery('');
                      setFilters({});
                      setActiveFilterColumn(null);
                    }}
                    className='group transition-all duration-300'
                  >
                    <FiX className='mr-1.5 group-hover:text-red-500 transition-colors duration-300' />{' '}
                    Clear all filters
                  </Button>
                  {onCreate && (
                    <Button
                      variant='primary'
                      onClick={() => onCreate()}
                      className='group transition-all duration-300'
                    >
                      <FiPlus className='mr-1.5 group-hover:scale-125 transition-transform duration-300' />{' '}
                      Create new task
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Card>
    </DndProvider>
  );
};

export default TaskListTable;
