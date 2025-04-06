import {useApi} from '../../hooks/useApi.ts';
import KanbanBoard, {Task} from '../../components/KanbanBoard.tsx';
import {FiPlus, FiSearch} from 'react-icons/fi';
import FormModal from '../../components/FormModal.tsx';
import {useState} from 'react';
import {CrudField} from '../../components/CrudManager.tsx';
import {OPTIONS} from '../../constants.ts';
import {getTranslatedList} from '../../i18n/utils.ts';
import {useTranslation} from 'react-i18next';
import TaskModal from '../../components/TaskModal.tsx';
import mountComponent from '../../components/mounter.tsx';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const Board = () => {
  const {data: projectsRaw, isLoading: projectsAreLoading} = useApi('projects');
  const {data: usersRaw, isLoading: usersAreLoading} = useApi('users');
  const {
    data: tasksRaw,
    isLoading: tasksAreLoading,
    updateMutation,
    createMutation,
  } = useApi('tasks');
  const [searchQuery, setSearchQuery] = useState('');
  const {t} = useTranslation();
  const translationPrefix = 'task.';

  if (projectsAreLoading || usersAreLoading) return <p>Loading...</p>;

  const projects = projectsRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const users = usersRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  if (!projects) return <p>Please create a project for using Tasks</p>;

  const updateTask = async (body: Record<string, any>) => {
    if (body.id) {
      await updateMutation.mutateAsync(
        body as Record<string, any> & {id: number}
      );
    } else {
      await createMutation.mutateAsync(body);
    }
  };

  const saveData = async (
    body: Record<string, any> & {id?: number}
  ): Promise<boolean> => {
    if (body.id) {
      await updateMutation.mutateAsync(
        body as Record<string, any> & {id: number}
      );
    } else {
      await createMutation.mutateAsync(
        body as Record<string, any> & {id: number}
      );
    }

    return true;
  };

  const fields: CrudField[] = [
    {
      key: 'title',
      label: t('title'),
      type: 'text',
      editable: true,
      sortable: true,
    },
    {
      key: 'description',
      label: t('description'),
      type: 'text',
      editable: true,
    },
    {
      key: 'status',
      label: t('status'),
      type: 'select',
      editable: true,
      options: getTranslatedList(OPTIONS.task.status, t, translationPrefix),
    },
    {
      key: 'type',
      label: t('type'),
      type: 'select',
      editable: true,
      options: getTranslatedList(OPTIONS.task.type, t, translationPrefix),
    },
    {
      key: 'project_id',
      label: t('project'),
      type: 'select',
      editable: true,
      options: projects,
    },
    {
      key: 'assigned_to',
      label: t('assigned_to'),
      type: 'select',
      editable: true,
      options: users,
    },
    {
      key: 'start_time',
      label: t('start_time'),
      type: 'datetime-local',
      editable: true,
    },
    {
      key: 'expected_time',
      label: t('expected_time'),
      type: 'number',
      editable: true,
    },
    {
      key: 'priority',
      label: t('priority'),
      type: 'select',
      editable: true,
      options: getTranslatedList(OPTIONS.priorities, t, translationPrefix),
    },
    {
      key: 'story_points',
      label: t('story_points'),
      type: 'number',
      editable: true,
    },
  ];

  return (
    <div className='pb-1 shadow-md bg-zinc-50'>
      <div className='p-2 pb-0 flex items-center space-x-2'>
        <div className='flex items-center space-x-2 flex-1'>
          <FiSearch className='text-zinc-600' />
          <input
            type='text'
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='p-1 border border-zinc-300 rounded-xs bg-white text-zinc-900'
          />
        </div>

        <button
          onClick={async () => {
            const form = await mountComponent(FormModal, {
              title: 'Create Task',
              fields: fields.filter((filter) => filter.creatable !== false),
              data: {},
            });
            if (form) {
              await saveData(form as Record<string, any>);
            }
          }}
          className='flex items-center bg-zinc-800 text-white px-2 py-1 rounded-xs hover:bg-zinc-700'
        >
          <FiPlus className='mr-1' /> Add
        </button>
      </div>

      {!tasksAreLoading && (
        <KanbanBoard
          tasks={
            tasksRaw.sort(
              (a, b) => (a.order_index || 0) - (b.order_index || 0)
            ) as Task[]
          }
          setTask={updateTask}
          onTaskClick={async (task: Task) => {
            await mountComponent(
              function ({users, task, onSave, onClose}) {
                return (
                  <QueryClientProvider client={new QueryClient()}>
                    <TaskModal
                      users={users}
                      task={task}
                      onSave={onSave as unknown as (task: Task) => void}
                      onClose={onClose as () => void}
                    />
                  </QueryClientProvider>
                );
              },
              {
                users: users,
                task: task || undefined,
              }
            );
          }}
        />
      )}
    </div>
  );
};

export default Board;
