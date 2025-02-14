import {useEffect, useRef} from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import invariant from 'tiny-invariant';

const statuses = [
  {id: 'open', title: 'Open', color: 'bg-blue-500'},
  {id: 'in-progress', title: 'In Progress', color: 'bg-yellow-600'},
  {id: 'review', title: 'Review', color: 'bg-purple-500'},
  {id: 'completed', title: 'Completed', color: 'bg-green-500'},
  {id: 'closed', title: 'Closed', color: 'bg-gray-500'},
];

export interface Task {
  id: number;
  title: string;
  status: string;
  description?: string;
}

const KanbanBoard = ({
  tasks,
  setTask,
}: {
  tasks: Record<string, any>[];
  setTask: (tasks: Record<string, any>) => void;
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

          const task = tasks.find((task) => task.id === sourceId) as Record<
            string,
            any
          >;
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
            className={`p-2 rounded-t ${status.color} text-center font-semibold text-zinc-100`}
          >
            {status.title}
          </h2>
          <div
            className='bg-zinc-100 p-2 rounded-b min-h-[400px] space-y-2'
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
                  className='bg-white text-black p-3 rounded shadow border border-gray-300'
                  data-task-id={task.id}
                  data-instance-id={instanceId.current.toString()}
                  ref={(element) => {
                    if (element) taskRefs.current[task.id] = element;
                  }}
                >
                  <h3 className='font-semibold'>{task.title}</h3>
                  <p className='text-sm text-gray-600'>{task.description}</p>
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
