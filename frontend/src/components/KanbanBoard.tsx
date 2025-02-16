import {useEffect, useRef} from 'react';
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
} from 'react-icons/fi';

const statuses = [
  {id: 'open', title: 'Open', color: 'bg-zinc-200'},
  {id: 'in-progress', title: 'In Progress', color: 'bg-zinc-200'},
  {id: 'review', title: 'Review', color: 'bg-zinc-200'},
  {id: 'completed', title: 'Completed', color: 'bg-zinc-200'},
  {id: 'closed', title: 'Closed', color: 'bg-zinc-200'},
];

const pastelColors = [
  'bg-blue-200',
  'bg-green-200',
  'bg-purple-200',
  'bg-red-200',
  'bg-yellow-200',
];

const getProjectColor = (name: string) => {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return pastelColors[sum % pastelColors.length]; // Assigns a pastel color
};

const priorityIcons = {
  low: <FiArrowDownCircle className='text-green-500 text-base' />, // Green for Low Priority
  medium: <FiAlertTriangle className='text-yellow-500 text-base' />, // Yellow for Medium Priority
  high: <FiZap className='text-red-500 text-base' />, // Red for High Priority
};

const typeIcons = {
  feature: <FiStar className='text-yellow-500 text-base' />, // Yellow for Features
  task: <FiCheckCircle className='text-green-500 text-base' />, // Green for Tasks
  issue: <FiAlertCircle className='text-red-500 text-base' />, // Red for Issues
};

export interface Task {
  id: number;
  title: string;
  status: string;
  type: 'feature' | 'task' | 'issue';
  project_id?: number;
  project: {name: string};
  priority?: 'low' | 'medium' | 'high';
}

const KanbanBoard = ({
  tasks,
  setTask,
}: {
  tasks: Task[];
  setTask: (task: Task) => void;
}) => {
  const instanceId = useRef(Symbol('kanban-instance'));
  const columnRefs = useRef<{[key: string]: HTMLDivElement | null}>({});
  const taskRefs = useRef<{[key: number]: HTMLDivElement | null}>({});

  useEffect(() => {
    const cleanupFns: (() => void)[] = [];

    Object.entries(columnRefs.current).forEach(([statusId, element]) => {
      if (!element) return;

      const cleanup = dropTargetForElements({
        element,
        getData: () => ({columnId: statusId}),
        canDrop({source}) {
          return source.data.instanceId === instanceId.current;
        },
        onDrop({source, location}) {
          if (!location.current.dropTargets.length) return;

          const sourceId = source.data.taskId;
          const targetColumn = location.current.dropTargets[0].data.columnId;
          invariant(typeof sourceId === 'number');
          invariant(typeof targetColumn === 'string');

          const task = tasks.find((task) => task.id === sourceId) as Task;
          task.status = targetColumn;
          setTask(task);
          setTimeout(() => {
            document
              .querySelectorAll('[data-column-id]')
              .forEach((column) =>
                column.classList.remove('ring-2', 'ring-blue-500')
              );
          }, 200);
        },
        onDropTargetChange({location}) {
          document.querySelectorAll('[data-column-id]').forEach((column) => {
            column.classList.remove('ring-2', 'ring-blue-500');
          });

          if (location.current.dropTargets.length > 0) {
            const targetElement = location.current.dropTargets[0].element;
            targetElement.classList.add('ring-2', 'ring-blue-500');
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

    return () => {
      cleanupFns.forEach((fn) => fn());
    };
  }, [tasks]);

  return (
    <div className='flex gap-4 overflow-x-auto p-4'>
      {statuses.map((status) => (
        <div key={status.id} className='w-1/5 min-w-[200px]'>
          <h2
            className={`p-2 rounded-t-sm ${status.color} text-center font-semibold text-zinc-800`}
          >
            {status.title}
          </h2>
          <div
            className='bg-zinc-100 p-1 rounded-b-sm min-h-[400px] space-y-2'
            data-column-id={status.id}
            ref={(element) => {
              if (element) columnRefs.current[status.id] = element;
            }}
          >
            {tasks
              .filter((task) => task.status === status.id)
              .map((task) => (
                <div
                  key={task.id}
                  className='relative bg-white text-black p-2 rounded-sm shadow flex flex-col'
                  data-task-id={task.id}
                  data-instance-id={instanceId.current.toString()}
                  ref={(element) => {
                    if (element) taskRefs.current[task.id] = element;
                  }}
                >
                  <div className='flex items-center space-x-1 mb-1 cursor-pointer text-base'>
                    {typeIcons[task.type]}
                    <h4 className='font-semibold'>{task.title}</h4>
                  </div>

                  {task.project && (
                    <div
                      className={`text-zinc-900 text-xs font-semibold px-1 py-0.5 rounded-md mt-1 w-max ${getProjectColor(task.project.name)}`}
                    >
                      {task.project.name}
                    </div>
                  )}

                  {task.priority && (
                    <div className='absolute bottom-2 right-2'>
                      {priorityIcons[task.priority]}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
