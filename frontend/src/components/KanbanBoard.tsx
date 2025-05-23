import {useEffect, useRef, useState} from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';
import {
  FiArrowDownCircle,
  FiAlertTriangle,
  FiZap,
  FiStar,
  FiCheckCircle,
  FiAlertCircle,
  FiUser,
  FiEdit,
  FiCheck,
  FiX,
} from 'react-icons/fi';
import {getFetchOptions} from '../utils/utils.ts';
import {useQueryClient} from '@tanstack/react-query';
import {
  BaseEventPayload,
  ElementDragType,
} from '@atlaskit/pragmatic-drag-and-drop/types';

export const statuses = [
  {id: 'open', title: 'Open', color: 'bg-blue-100', icon: <FiAlertCircle className="text-blue-500" />},
  {id: 'in-progress', title: 'In Progress', color: 'bg-yellow-100', icon: <FiZap className="text-yellow-500" />},
  {id: 'review', title: 'Review', color: 'bg-purple-100', icon: <FiStar className="text-purple-500" />},
  {id: 'completed', title: 'Completed', color: 'bg-green-100', icon: <FiCheckCircle className="text-green-500" />},
  {id: 'closed', title: 'Closed', color: 'bg-gray-100', icon: <FiAlertTriangle className="text-gray-500" />},
];

const pastelColors = [
  'bg-blue-500',
  'bg-green-500',
  'bg-purple-500',
  'bg-red-500',
];

const getProjectColor = (name: string) => {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return pastelColors[sum % pastelColors.length]; // Assigns a pastel color
};

const priorityIcons = {
  low: <FiArrowDownCircle className='text-green-500 text-base' />,
  medium: <FiAlertTriangle className='text-yellow-500 text-base' />,
  high: <FiZap className='text-red-500 text-base' />,
};

const typeIcons = {
  feature: <FiStar className='text-yellow-500 text-base me-1' />,
  task: <FiCheckCircle className='text-green-500 text-base me-1' />,
  issue: <FiAlertCircle className='text-red-500 text-base me-1' />,
};

export interface Task {
  id: number;
  title: string;
  status: string;
  description: string;
  type: 'feature' | 'task' | 'issue';
  project_id?: number;
  project: {name: string};
  priority?: 'low' | 'medium' | 'high';
  order_index?: number;
  assigned_to?: string;
  start_time?: string;
  expected_time?: string;
  story_points?: string;
  address?: string;
  lat?: number;
  lng?: number;
}

const KanbanBoard = ({
  tasks,
  setTask,
  onTaskClick,
}: {
  tasks: Task[];
  setTask: (task: Task) => void;
  onTaskClick: (task: Task) => void;
}) => {
  const instanceId = useRef(Symbol('kanban-instance'));
  const columnRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const taskRefs = useRef<{[key: number]: HTMLDivElement | null}>({});
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const queryClient = useQueryClient();

  const updateTaskOrder = async (
    taskId: number,
    beforeTaskId: number | null
  ) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}/move-before`, {
        ...getFetchOptions(),
        method: 'POST',
        body: JSON.stringify({before_task_id: beforeTaskId}),
      });
      if (response.ok) {
        await queryClient.invalidateQueries({queryKey: ['tasks']});
        console.log(`Task ${taskId} moved before ${beforeTaskId}`);
      }
    } catch (error) {
      console.error('Error updating task order:', error);
    }
  };

  const startEditing = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the task modal
    setEditingTaskId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = async (task: Task, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the task modal

    if (editingTitle.trim() === '') return; // Don't save empty titles

    const updatedTask = { ...task, title: editingTitle };
    setTask(updatedTask);
    setEditingTaskId(null);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        ...getFetchOptions(),
        method: 'PUT',
        body: JSON.stringify({ title: editingTitle }),
      });

      if (!response.ok) {
        console.error('Failed to update task title');
      }
    } catch (error) {
      console.error('Error updating task title:', error);
    }
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the task modal
    setEditingTaskId(null);
    setEditingTitle('');
  };

  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    const onDrop:
      | ((args: BaseEventPayload<ElementDragType>) => void)
      | undefined = ({source, location}) => {
      if (!location.current.dropTargets.length) return;
      const sourceId = source.data.taskId;
      let targetColumn = location.current.dropTargets[0].data.columnId;
      const targetTaskId = location.current.dropTargets[0].data.taskId;

      invariant(typeof sourceId === 'number');

      // Remove any animation classes from all tasks
      document.querySelectorAll('[data-task-id]').forEach(task => {
        task.classList.remove('scale-105', 'opacity-50', 'shadow-lg', 'z-10');
      });

      const task = tasks.find((task) => task.id === sourceId);
      if (!task) {
        return;
      }

      if (targetTaskId) {
        const targetTask = tasks.find(({id}) => id === targetTaskId);
        if (targetTask && targetTask.status !== task.status) {
          targetColumn = targetTask.status;
        }
      }

      if (typeof targetColumn === 'string') {
        if (task) {
          task.status = targetColumn;
          setTask(task);

          // Add success animation to the task element
          const taskElement = document.querySelector(`[data-task-id="${sourceId}"]`);
          if (taskElement) {
            taskElement.classList.add('scale-105');
            setTimeout(() => {
              taskElement.classList.remove('scale-105');
            }, 300);
          }
        }

        setTimeout(() => {
          document
            .querySelectorAll('[data-column-id]')
            .forEach((column) =>
              column.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50')
            );
        }, 200);
      }

      if (sourceId !== targetTaskId && targetTaskId) {
        void updateTaskOrder(Number(sourceId), Number(targetTaskId));
      }

      setHighlightedIndex(null);
    };

    Object.entries(taskRefs.current).forEach(([taskId, element]) => {
      if (!element) return;

      const cleanup = dropTargetForElements({
        element,
        getData: () => ({taskId: Number(taskId)}),
        onDropTargetChange({location, source}) {
          // Reset all task highlights
          document.querySelectorAll('[data-task-id]').forEach(task => {
            if (task !== source?.element) {
              task.classList.remove('scale-105', 'shadow-md', 'border-blue-400');
            }
          });

          if (location.current.dropTargets.length > 0) {
            const targetTaskId = location.current.dropTargets[0].data.taskId;
            setHighlightedIndex(Number(targetTaskId));

            // Add highlight effect to the target task
            const targetElement = document.querySelector(`[data-task-id="${targetTaskId}"]`);
            if (targetElement && targetElement !== source?.element) {
              targetElement.classList.add('scale-105', 'shadow-md', 'border-blue-400');
            }

            // Add effect to the dragged task
            if (source?.element) {
              source.element.classList.add('opacity-80', 'shadow-lg', 'z-10', 'rotate-1');
            }
          } else {
            setHighlightedIndex(null);
          }
        },
        onDrop,
      });

      cleanupFns.push(cleanup);
    });

    Object.entries(columnRefs.current).forEach(([statusId, element]) => {
      if (!element) return;

      const cleanup = dropTargetForElements({
        element,
        getData: () => ({columnId: statusId}),
        canDrop({source}) {
          return source.data.instanceId === instanceId.current;
        },
        onDrop,
        onDropTargetChange({location, source}) {
          // Reset all column highlights
          document.querySelectorAll('[data-column-id]').forEach((column) => {
            column.classList.remove('ring-2', 'ring-blue-500', 'bg-blue-50');
          });

          if (location.current.dropTargets.length > 0) {
            const targetElement = location.current.dropTargets[0].element;
            if (targetElement.hasAttribute('data-column-id')) {
              // Add highlight effect to the target column
              targetElement.classList.add('ring-2', 'ring-blue-500', 'bg-blue-50');

              // Add a subtle animation to show the column is ready to receive the task
              targetElement.animate(
                [
                  { transform: 'translateY(0)' },
                  { transform: 'translateY(-2px)' },
                  { transform: 'translateY(0)' }
                ],
                {
                  duration: 300,
                  easing: 'ease-in-out'
                }
              );
            }

            // Add effect to the dragged task
            if (source?.element) {
              source.element.classList.add('opacity-80', 'shadow-lg', 'z-10', 'rotate-1');
            }
          }
        },
      });

      cleanupFns.push(cleanup);
    });

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setTask]);

  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    Object.entries(taskRefs.current).forEach(([taskId, element]) => {
      if (!element) return;

      const cleanup = draggable({
        element,
        getInitialData: () => ({
          instanceId: instanceId.current,
          taskId: Number(taskId),
        }),
      });
      cleanupFns.push(cleanup);
    });

    return () => cleanupFns.forEach((fn) => fn());
  }, [tasks]);

  return (
    <div className='flex gap-4 overflow-x-auto p-4'>
      {statuses.map((status) => (
        <div
          key={status.id}
          className='w-1/5 min-w-[250px] border border-zinc-200 bg-white rounded-md shadow-sm flex flex-col transition-all duration-200 hover:shadow-md'
        >
          <h2
            className={`px-3 py-2 border-b ${status.color} flex items-center gap-2 text-left text-sm font-semibold text-zinc-700`}
          >
            {status.icon}
            {status.title}
            <span className="ml-auto bg-white text-xs py-0.5 px-2 rounded-full text-zinc-600 font-normal">
              {tasks.filter(task => task.status === status.id).length}
            </span>
          </h2>

          <div
            className='bg-zinc-50 p-2 min-h-[500px] flex flex-col gap-2'
            data-column-id={status.id}
            ref={(el) => {
              columnRefs.current[status.id] = el;
              return;
            }}
          >
            {tasks
              .filter((task) => task.status === status.id)
              .map((task) => (
                <div
                  key={task.id}
                  className='relative bg-white text-zinc-800 border border-zinc-200 p-3 rounded-md shadow-sm flex flex-col gap-2 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200'
                  data-task-id={task.id}
                  ref={(el) => {
                    taskRefs.current[task.id] = el;
                    return;
                  }}
                  onClick={() => onTaskClick(task)}
                >
                  {highlightedIndex === task.id && (
                    <div className='absolute top-0 left-0 right-0 h-1 bg-blue-500 rounded-t-md'></div>
                  )}

                  <div className='flex items-start justify-between'>
                    {editingTaskId === task.id ? (
                      <div className='flex-1 flex items-center gap-1'>
                        <input
                          type='text'
                          value={editingTitle}
                          onChange={(e) => setEditingTitle(e.target.value)}
                          className='flex-1 text-sm border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => saveEdit(task, e)}
                          className='text-green-500 hover:text-green-700 transition-colors p-1'
                        >
                          <FiCheck />
                        </button>
                        <button
                          onClick={cancelEdit}
                          className='text-red-500 hover:text-red-700 transition-colors p-1'
                        >
                          <FiX />
                        </button>
                      </div>
                    ) : (
                      <>
                        <h4 className='text-sm font-semibold line-clamp-2'>{task.title}</h4>
                        <div className='flex items-center gap-1'>
                          {task.priority && (
                            <div className='flex-shrink-0'>
                              {priorityIcons[task.priority]}
                            </div>
                          )}
                          <button
                            onClick={(e) => startEditing(task, e)}
                            className='text-zinc-400 hover:text-zinc-700 transition-colors p-1'
                          >
                            <FiEdit size={14} />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className='flex items-center gap-2 flex-wrap'>
                    {task.project && (
                      <div
                        className='text-white text-xs px-2 py-0.5 rounded-full font-medium'
                        style={{
                          backgroundColor: task.project.name ? getProjectColor(task.project.name).replace('bg-', '') : '#6366f1',
                        }}
                      >
                        {task.project.name}
                      </div>
                    )}

                    <div className='flex items-center gap-1 text-xs bg-zinc-100 px-2 py-0.5 rounded-full'>
                      {typeIcons[task.type]}
                      {`${task.type.charAt(0).toUpperCase()}-${task.id}`}
                    </div>

                    {task.assigned_to && (
                      <div className='ml-auto text-xs text-zinc-500 flex items-center gap-1'>
                        <FiUser className='text-zinc-400' />
                        {task.assigned_to}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
