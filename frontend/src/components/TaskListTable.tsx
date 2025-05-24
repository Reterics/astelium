import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FiPlus, FiSearch, FiSave, FiTrash, FiFilter, FiSettings, FiChevronDown, FiChevronRight, FiX, FiClock, FiCalendar, FiInbox, FiAlertCircle } from 'react-icons/fi';
import { CrudField } from './CrudManager';
import { TableRow } from './TableComponent';
import SelectComponent from './SelectComponent';
import MultiSelectComponent from './MultiSelectComponent';
import UserAvatar from './UserAvatar';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Input } from './ui/Input';
import { Typography } from './ui/Typography';

// Types
interface TaskListTableProps {
  columns: CrudField[];
  data: TableRow[];
  onEdit?: (updatedData: TableRow[]) => Promise<void | boolean> | void | boolean;
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
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
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
const ColumnHeader: React.FC<ColumnHeaderProps> = ({ column, onSort, sortConfig, onFilter, activeFilterColumn }) => {
  const isSorted = sortConfig?.key === column.key;
  const sortDirection = isSorted ? sortConfig.direction : null;

  return (
    <div
      className="flex items-center justify-between px-3 py-2 bg-zinc-50 border-b border-zinc-200 cursor-pointer hover:bg-zinc-100 transition-all duration-200 hover:shadow-sm group"
      onClick={() => onSort(column.key)}
    >
      <div className="flex items-center gap-2">
        <Typography
          variant="small"
          className="font-medium text-zinc-700 whitespace-nowrap overflow-hidden text-ellipsis group-hover:text-blue-600 transition-colors duration-200"
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
          <span className="text-zinc-300 opacity-0 group-hover:opacity-50 transition-opacity duration-200">
            ↑
          </span>
        )}
      </div>
      {column.filterable !== false && (
        <button
          className="text-zinc-400 hover:text-blue-500 transition-all duration-200 hover:scale-110 transform p-1 rounded-full hover:bg-blue-50"
          onClick={(e) => {
            e.stopPropagation();
            onFilter(column.key);
          }}
        >
          <FiFilter size={14} className={activeFilterColumn === column.key ? "text-blue-500" : ""} />
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
  moveTask
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [editingField, setEditingField] = useState<string | null>(null);

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (editingField && dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setEditingField(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [editingField]);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover(item: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
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

  return (
    <div
      ref={ref}
      className={`flex border-b border-zinc-100 ${isDragging ? 'opacity-50 bg-blue-50 shadow-md scale-[1.02]' : 'opacity-100'} ${isSelected ? 'bg-blue-50' : 'bg-white'} hover:bg-zinc-50 transition-all duration-200 hover:shadow-sm`}
      style={{ cursor: 'grab' }}
    >
      <div className="flex items-center px-2 py-2">
        <div className="relative mr-2 flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(task.id)}
            className="h-4 w-4 rounded border-zinc-300 text-blue-600 transition-all duration-200 focus:ring-blue-500 hover:border-blue-400 cursor-pointer"
          />
          {isSelected && (
            <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 animate-[pulse_2s_ease-in-out_infinite] opacity-30 pointer-events-none"></div>
          )}
        </div>
        <button
          onClick={() => onExpand(task.id)}
          className="text-zinc-400 hover:text-blue-500 transition-colors duration-200 p-1 rounded-full hover:bg-blue-50 transform hover:scale-110"
        >
          {isExpanded ?
            <FiChevronDown size={16} className="transition-transform duration-300 transform rotate-0" /> :
            <FiChevronRight size={16} className="transition-transform duration-300 transform rotate-0 hover:rotate-45" />
          }
        </button>
      </div>

      {columns.map((column) => (
        <div key={column.key} className="flex-1 min-w-[120px] px-3 py-2 flex items-center">
          {column.editable && column.type === 'select' && editingField === column.key ? (
            <div className="w-full" ref={dropdownRef}>
              <SelectComponent
                column={column}
                filters={{ [column.key]: task[column.key] }}
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
          ) : column.key === 'priority' ? (
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(priority)} ${column.editable ? 'cursor-pointer hover:bg-opacity-80 hover:shadow-md hover:scale-105' : ''} transition-all duration-200 transform`}
              onClick={() => column.editable && setEditingField(column.key)}
            >
              {task[column.key]}
            </div>
          ) : column.key === 'assigned_to' ? (
            <div
              className={`flex items-center px-2 py-1 rounded ${column.editable ? 'cursor-pointer hover:bg-zinc-50 hover:shadow-md hover:scale-[1.02]' : ''} transition-all duration-200 transform`}
              onClick={() => column.editable && setEditingField(column.key)}
            >
              <div className="transition-transform duration-200 hover:scale-110">
                <UserAvatar image={task.assigned_to_image} name={task[column.key]} />
              </div>
              <span className="ml-2 text-zinc-800 transition-colors duration-200 group-hover:text-blue-600">{task[column.key]}</span>
            </div>
          ) : column.type === 'datetime-local' ? (
            <div className="w-full">
              <div
                className="flex items-center cursor-pointer hover:bg-zinc-50 hover:shadow-md px-2 py-1 rounded transition-all duration-200 group hover:scale-[1.01] transform"
                onClick={() => column.editable && setEditingField(column.key)}
              >
                <FiCalendar className="text-zinc-500 mr-2 group-hover:text-blue-500 transition-colors duration-200" />
                <Typography variant="p" className="text-zinc-800 group-hover:text-zinc-900 transition-colors duration-200">
                  {task[column.key] ?
                    column.key === 'start_time' ?
                      new Date(task[column.key]).toLocaleDateString() :
                      new Date(task[column.key]).toLocaleString()
                    : 'Not set'}
                </Typography>
              </div>
              {column.editable && editingField === column.key && (
                <div className="absolute z-10 animate-fadeIn transform origin-top-left transition-all duration-200" ref={dropdownRef}>
                  <Input
                    type="datetime-local"
                    value={task[column.key] || ''}
                    onChange={(e) => {
                      onEdit(task.id, column.key, e.target.value);
                      setEditingField(null);
                    }}
                    className="w-64 h-8 text-sm bg-white border border-zinc-200 shadow-lg"
                    autoFocus
                  />
                </div>
              )}
            </div>
          ) : column.key === 'expected_time' ? (
            <div className="w-full">
              <div
                className="flex items-center cursor-pointer hover:bg-zinc-50 hover:shadow-md px-2 py-1 rounded transition-all duration-200 group hover:scale-[1.01] transform"
                onClick={() => column.editable && setEditingField(column.key)}
              >
                <FiCalendar className="text-zinc-500 mr-2 group-hover:text-blue-500 transition-colors duration-200" />
                <Typography variant="p" className="text-zinc-800 group-hover:text-zinc-900 transition-colors duration-200">
                  {task[column.key] && task.start_time ?
                    (() => {
                      const startDate = new Date(task.start_time);
                      const expectedDate = new Date(startDate);
                      expectedDate.setDate(startDate.getDate() + Number(task[column.key]));
                      return expectedDate.toLocaleDateString();
                    })() :
                    task[column.key] ? `${task[column.key]} days` : 'Not set'}
                </Typography>
              </div>
              {column.editable && editingField === column.key && (
                <div className="absolute z-10 animate-fadeIn transform origin-top-left transition-all duration-200" ref={dropdownRef}>
                  <div className="bg-white border border-zinc-200 shadow-lg p-3 rounded-md animate-[fadeIn_0.2s_ease-in-out]">
                    <div className="flex flex-col space-y-2">
                      <label className="text-xs text-zinc-600 font-medium animate-[fadeIn_0.3s_ease-in-out]">Select expected completion date:</label>
                      <Input
                        type="date"
                        value={task.start_time ? (() => {
                          const startDate = new Date(task.start_time);
                          const expectedDate = new Date(startDate);
                          expectedDate.setDate(startDate.getDate() + Number(task[column.key] || 0));
                          return expectedDate.toISOString().split('T')[0];
                        })() : ''}
                        onChange={(e) => {
                          if (task.start_time) {
                            const startDate = new Date(task.start_time);
                            const selectedDate = new Date(e.target.value);
                            // Calculate days difference
                            const diffTime = selectedDate.getTime() - startDate.getTime();
                            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                            onEdit(task.id, column.key, diffDays);
                          }
                          setEditingField(null);
                        }}
                        className="w-64 h-8 text-sm transition-all duration-200 hover:border-blue-300 focus:border-blue-500"
                        autoFocus
                      />
                      <div className="text-xs text-zinc-500 mt-1 animate-[fadeIn_0.4s_ease-in-out]">
                        {task.start_time ?
                          `Days from start: ${task[column.key] || 0}` :
                          "Set a start date first to use date selection"}
                      </div>
                      {!task.start_time && (
                        <Input
                          type="number"
                          value={task[column.key] || ''}
                          onChange={(e) => {
                            onEdit(task.id, column.key, e.target.value);
                            setEditingField(null);
                          }}
                          className="w-64 h-8 text-sm mt-2 transition-all duration-200 hover:border-blue-300 focus:border-blue-500 animate-[fadeIn_0.5s_ease-in-out]"
                          placeholder="Enter days manually"
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : column.editable ? (
            <div className="w-full">
              <Input
                value={task[column.key] || ''}
                onChange={(e) => onEdit(task.id, column.key, e.target.value)}
                className="w-full h-8 text-sm border-transparent hover:border-zinc-300 focus:border-blue-500 transition-colors duration-150"
              />
            </div>
          ) : (
            <div className="w-full px-2 py-1">
              <Typography variant="p" className="text-zinc-800 truncate">
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
  groupedBy = 'status'
}) => {
  // State
  const [tasks, setTasks] = useState<TableRow[]>(data);
  const [selectedTasks, setSelectedTasks] = useState<(number | string)[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<(number | string)[]>([]);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>(columns.map(col => col.key));
  const [savedViews, setSavedViews] = useState<SavedView[]>([
    { id: 'default', name: 'Default View', columns: columns.map(col => col.key), groupBy: 'status', filters: {} }
  ]);
  const [activeView, setActiveView] = useState<string>('default');
  const [isTimelineView, setIsTimelineView] = useState<boolean>(false);
  const [isColumnSettingsOpen, setIsColumnSettingsOpen] = useState<boolean>(false);
  const [editedTasks, setEditedTasks] = useState<Record<string | number, Record<string, any>>>({});

  // Refs for column settings dropdown
  const columnSettingsButtonRef = useRef<HTMLButtonElement>(null);
  const columnSettingsDropdownRef = useRef<HTMLDivElement>(null);

  // Update tasks when data changes
  useEffect(() => {
    setTasks(data);
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
    setSelectedTasks(prev =>
      prev.includes(id)
        ? prev.filter(taskId => taskId !== id)
        : [...prev, id]
    );
  };

  // Handle task expansion
  const handleExpandTask = (id: number | string) => {
    setExpandedTasks(prev =>
      prev.includes(id)
        ? prev.filter(taskId => taskId !== id)
        : [...prev, id]
    );
  };

  // Handle column sorting
  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Handle column filtering
  const handleFilter = (key: string) => {
    setActiveFilterColumn(prev => prev === key ? null : key);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Handle task editing
  const handleEditTask = (id: number | string, key: string, value: any) => {
    setEditedTasks(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [key]: value
      }
    }));

    // Update the task in the local state for immediate feedback
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, [key]: value }
          : task
      )
    );
  };

  // Handle saving changes
  const handleSaveChanges = async () => {
    if (!onEdit) return;

    const updatedTasks = Object.entries(editedTasks).map(([id, changes]) => ({
      id: id,
      ...changes
    }));

    await onEdit(updatedTasks as TableRow[]);
    setEditedTasks({});
  };

  // Handle task reordering
  const moveTask = useCallback((dragIndex: number, hoverIndex: number) => {
    setTasks(prev => {
      const newTasks = [...prev];
      const draggedTask = newTasks[dragIndex];
      newTasks.splice(dragIndex, 1);
      newTasks.splice(hoverIndex, 0, draggedTask);
      return newTasks;
    });
  }, []);

  // Handle column visibility toggle
  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns(prev =>
      prev.includes(key)
        ? prev.filter(col => col !== key)
        : [...prev, key]
    );
  };

  // Handle saving view
  const saveCurrentView = (name: string) => {
    const newView: SavedView = {
      id: Date.now().toString(),
      name,
      columns: visibleColumns,
      groupBy: groupedBy,
      filters
    };

    setSavedViews(prev => [...prev, newView]);
    setActiveView(newView.id);
  };

  // Handle loading view
  const loadView = (viewId: string) => {
    const view = savedViews.find(v => v.id === viewId);
    if (!view) return;

    setVisibleColumns(view.columns);
    setFilters(view.filters);
    setActiveView(viewId);
  };

  // Filter and sort tasks
  const filteredTasks = tasks
    .filter(task => {
      // Search filter
      const matchesSearch = Object.values(task).some(
        value => String(value).toLowerCase().includes(searchQuery.toLowerCase())
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

      const { key, direction } = sortConfig;

      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  // Group tasks if groupedBy is provided
  const groupedTasks: Record<string, TableRow[]> = groupedBy
    ? filteredTasks.reduce((acc, task) => {
        const group = String(task[groupedBy] || 'Uncategorized');
        acc[group] = acc[group] || [];
        acc[group].push(task);
        return acc;
      }, {} as Record<string, TableRow[]>)
    : { 'All Tasks': filteredTasks };

  // Handle batch actions
  const handleBatchDelete = () => {
    if (!onDelete) return;
    selectedTasks.forEach(id => onDelete(id));
    setSelectedTasks([]);
  };

  const handleBatchEdit = (key: string, value: any) => {
    selectedTasks.forEach(id => handleEditTask(id, key, value));
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedTasks.length === filteredTasks.length) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(filteredTasks.map(task => task.id));
    }
  };

  // Render timeline view
  const renderTimelineView = () => {
    return (
      <div className="mt-4 border border-zinc-200 rounded-md p-4">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h6" className="font-medium">Timeline View</Typography>
          <Button
            variant="outline"
            onClick={() => setIsTimelineView(false)}
            className="text-xs"
          >
            <FiX className="mr-1" /> Close Timeline
          </Button>
        </div>
        <div className="flex flex-col space-y-2">
          {filteredTasks.map(task => (
            <div key={task.id} className="flex items-center p-2 border-b border-zinc-100">
              <div className="w-1/4">
                <Typography variant="p" className="font-medium">{task.title}</Typography>
              </div>
              <div className="w-3/4 relative h-8 bg-zinc-100 rounded">
                {task.start_time && task.expected_time && (
                  <div
                    className="absolute h-full bg-blue-200 rounded"
                    style={{
                      left: '10%', // This would be calculated based on dates
                      width: '30%'  // This would be calculated based on duration
                    }}
                  >
                    <div className="px-2 py-1 text-xs">{task.title}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Card className="overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-3 border-b border-zinc-200 bg-white">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 w-64"
              />
            </div>

            <select
              value={activeView}
              onChange={(e) => loadView(e.target.value)}
              className="h-9 border border-zinc-200 rounded px-3 text-sm"
            >
              {savedViews.map(view => (
                <option key={view.id} value={view.id}>{view.name}</option>
              ))}
            </select>

            <Button
              variant="outline"
              onClick={() => saveCurrentView(`View ${savedViews.length + 1}`)}
              className="h-9"
            >
              <FiSave className="mr-1" /> Save View
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsTimelineView(!isTimelineView)}
              className="h-9"
            >
              {isTimelineView ? <FiCalendar className="mr-1" /> : <FiClock className="mr-1" />}
              {isTimelineView ? 'Table View' : 'Timeline View'}
            </Button>

            <div className="relative">
              <Button
                ref={columnSettingsButtonRef}
                variant="outline"
                onClick={() => {
                  setIsColumnSettingsOpen(!isColumnSettingsOpen);
                }}
                className="h-9"
              >
                <FiSettings className="mr-1" /> Columns
              </Button>

              {/* Column visibility dropdown */}
              {isColumnSettingsOpen && (
                <div
                  ref={columnSettingsDropdownRef}
                  className="absolute right-0 top-full mt-1 bg-white border border-zinc-200 shadow-lg rounded-md p-2 z-20 w-64"
                >
                  <Typography variant="small" className="font-medium mb-2 pb-2 border-b border-zinc-100">
                    Toggle Columns
                  </Typography>
                  {columns.map(column => (
                    <div key={column.key} className="flex items-center justify-between py-1">
                      <Typography variant="p" className="text-zinc-700">
                        {column.label}
                      </Typography>
                      <input
                        type="checkbox"
                        checked={visibleColumns.includes(column.key)}
                        onChange={() => toggleColumnVisibility(column.key)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedTasks.length > 0 && (
              <div className="flex items-center space-x-2 ml-4 p-2 bg-blue-50 rounded">
                <Typography variant="p" className="text-blue-700">
                  {selectedTasks.length} selected
                </Typography>

                {/* Batch Edit Dropdown */}
                <div className="relative">
                  <Button
                    variant="outline"
                    className="h-8 text-xs"
                  >
                    Batch Edit
                  </Button>
                  <div className="absolute left-0 top-full mt-1 bg-white border border-zinc-200 shadow-lg rounded-md p-2 z-20 w-64">
                    <Typography variant="small" className="font-medium mb-2 pb-2 border-b border-zinc-100">
                      Edit Selected Tasks
                    </Typography>
                    {columns
                      .filter(col => col.editable)
                      .map(column => (
                        <div key={column.key} className="py-1">
                          <Typography variant="p" className="text-zinc-700 mb-1">
                            {column.label}
                          </Typography>
                          {column.type === 'select' ? (
                            <select
                              className="w-full border border-zinc-200 rounded px-2 py-1 text-sm"
                              onChange={(e) => handleBatchEdit(column.key, e.target.value)}
                            >
                              <option value="">Select...</option>
                              {column.options?.map(option => (
                                <option
                                  key={typeof option === 'string' ? option : option.value}
                                  value={typeof option === 'string' ? option : option.value}
                                >
                                  {typeof option === 'string' ? option : option.label}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <Input
                              type={column.type || 'text'}
                              className="w-full"
                              placeholder={`Set ${column.label}`}
                              onChange={(e) => handleBatchEdit(column.key, e.target.value)}
                            />
                          )}
                        </div>
                      ))
                    }
                  </div>
                </div>

                <Button
                  variant="destructive"
                  onClick={handleBatchDelete}
                  className="h-8 text-xs"
                >
                  <FiTrash className="mr-1" /> Delete
                </Button>
              </div>
            )}

            {Object.keys(editedTasks).length > 0 && (
              <Button
                variant="primary"
                onClick={handleSaveChanges}
                className="h-9"
              >
                <FiSave className="mr-1" /> Save Changes
              </Button>
            )}

            {onCreate && (
              <Button
                variant="primary"
                onClick={() => onCreate()}
                className="h-9"
              >
                <FiPlus className="mr-1" /> Add Task
              </Button>
            )}
          </div>
        </div>

        {/* Timeline View */}
        {isTimelineView && renderTimelineView()}

        {/* Table View */}
        {!isTimelineView && (
          <div className="overflow-auto">
            {/* Table Header */}
            <div className="flex border-b border-zinc-200 bg-white sticky top-0 z-10 shadow-sm">
              <div className="w-12 px-2 py-2 bg-zinc-50 border-b border-zinc-200 flex items-center justify-center">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedTasks.length === filteredTasks.length && filteredTasks.length > 0}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-zinc-300 text-blue-600 transition-all duration-200 focus:ring-blue-500 hover:border-blue-400 cursor-pointer"
                  />
                  {selectedTasks.length > 0 && (
                    <div className="absolute inset-0 bg-blue-100 rounded-full scale-150 animate-[pulse_2s_ease-in-out_infinite] opacity-30 pointer-events-none"></div>
                  )}
                  {selectedTasks.length > 0 && selectedTasks.length < filteredTasks.length && (
                    <div className="absolute top-0 right-0 h-2 w-2 bg-yellow-400 rounded-full animate-[pulse_1.5s_ease-in-out_infinite] pointer-events-none"></div>
                  )}
                </div>
              </div>

              {columns
                .filter(col => visibleColumns.includes(col.key))
                .map(column => (
                  <div key={column.key} className="flex-1 min-w-[120px]">
                    <ColumnHeader
                      column={column}
                      onSort={handleSort}
                      sortConfig={sortConfig}
                      onFilter={handleFilter}
                      activeFilterColumn={activeFilterColumn}
                    />
                  </div>
                ))
              }
            </div>

            {/* Filter Row (visible when a filter is active) */}
            {activeFilterColumn && (
              <div className="flex border-b border-zinc-200 bg-white p-2">
                <div className="flex items-center space-x-2">
                  <Typography variant="p" className="font-medium">
                    Filter: {columns.find(col => col.key === activeFilterColumn)?.label}
                  </Typography>

                  {(() => {
                    const column = columns.find(col => col.key === activeFilterColumn);
                    if (!column) return null;

                    if (column.type === 'select') {
                      return (
                        <SelectComponent
                          column={column}
                          filters={filters}
                          handleFilterChange={(key, value) => handleFilterChange(key, value)}
                        />
                      );
                    }

                    if (column.type === 'multiselect') {
                      return (
                        <MultiSelectComponent
                          column={column}
                          filters={filters as any}
                          handleFilterChange={(key, value) => handleFilterChange(key, value)}
                        />
                      );
                    }

                    return (
                      <Input
                        type="text"
                        value={filters[activeFilterColumn] || ''}
                        onChange={(e) => handleFilterChange(activeFilterColumn, e.target.value)}
                        className="w-64"
                      />
                    );
                  })()}

                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters(prev => {
                        const newFilters = {...prev};
                        delete newFilters[activeFilterColumn];
                        return newFilters;
                      });
                      setActiveFilterColumn(null);
                    }}
                    className="h-8 text-xs"
                  >
                    <FiX className="mr-1" /> Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Task Groups */}
            {Object.entries(groupedTasks).map(([group, groupTasks]) => (
              <div key={group} className="border-b border-zinc-200">
                <div className="flex items-center justify-between px-3 py-2 bg-zinc-100 hover:bg-zinc-200 transition-colors duration-150">
                  <Typography variant="small" className="font-medium text-zinc-700 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                    {group} <span className="ml-1 text-zinc-500 text-xs">({groupTasks.length})</span>
                  </Typography>
                </div>

                {/* Tasks */}
                {groupTasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    <TaskItem
                      task={task}
                      columns={columns.filter(col => visibleColumns.includes(col.key))}
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
                      <div className="bg-zinc-50 p-4 border-b border-zinc-100 animate-fadeIn shadow-inner origin-top transition-all duration-300 ease-in-out">
                        <div className="mb-3 pb-2 border-b border-zinc-200">
                          <Typography variant="h6" className="font-medium mb-1 text-zinc-800 animate-[fadeIn_0.3s_ease-in-out]">
                            {task.title}
                          </Typography>
                          <Typography variant="p" className="text-zinc-600 animate-[fadeIn_0.4s_ease-in-out]">
                            {task.description || 'No description provided.'}
                          </Typography>
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          {columns
                            .filter(col => !visibleColumns.includes(col.key))
                            .map(column => (
                              <div key={column.key} className="flex items-start py-1 border-b border-zinc-100">
                                <Typography variant="p" className="font-medium text-zinc-700 w-1/3">
                                  {column.label}:
                                </Typography>
                                <Typography variant="p" className="text-zinc-800 w-2/3">
                                  {task[column.key] || '-'}
                                </Typography>
                              </div>
                            ))
                          }
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                ))}

                {/* Empty State */}
                {groupTasks.length === 0 && (
                  <div className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-100 mb-2">
                      <FiInbox size={24} className="text-zinc-400" />
                    </div>
                    <Typography variant="p" className="text-zinc-500 block">
                      No tasks in this group yet.
                    </Typography>
                    <Typography variant="p" className="text-zinc-400 text-sm mt-1">
                      Create a new task or change task status to see it here.
                    </Typography>
                  </div>
                )}
              </div>
            ))}

            {/* Empty State */}
            {filteredTasks.length === 0 && (
              <div className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-100 mb-3">
                  <FiAlertCircle size={32} className="text-zinc-400" />
                </div>
                <Typography variant="h6" className="text-zinc-600 mb-2">
                  No tasks found
                </Typography>
                <Typography variant="p" className="text-zinc-400 max-w-md mx-auto">
                  Try adjusting your search criteria or clearing filters to see more results.
                </Typography>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchQuery('');
                    setFilters({});
                    setActiveFilterColumn(null);
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        )}
      </Card>
    </DndProvider>
  );
};

export default TaskListTable;
