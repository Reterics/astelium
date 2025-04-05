import {CrudField} from '../../components/CrudManager';
import {useApi} from '../../hooks/useApi.ts';
import {getTranslatedList} from '../../i18n/utils.ts';
import {OPTIONS} from '../../constants.ts';
import {useTranslation} from 'react-i18next';
import GroupedTableComponent from '../../components/GroupedTableComponent.tsx';
import SelectComponent from '../../components/SelectComponent.tsx';
import {useState} from 'react';
import UserAvatar from '../../components/UserAvatar.tsx';
import {FiPlus, FiSearch} from 'react-icons/fi';
import FormModal from '../../components/FormModal.tsx';
import TaskModal from '../../components/TaskModal.tsx';
import {Task} from '../../components/KanbanBoard.tsx';

const Tasks = () => {
  const {data: projectsRaw, isLoading: projectsAreLoading} = useApi('projects');
  const {data: usersRaw, isLoading: usersAreLoading} = useApi('users');
  const {
    data: tasksRaw,
    isLoading: tasksAreLoading,
    updateMutation,
    createMutation,
  } = useApi('tasks');

  const {t} = useTranslation();
  const translationPrefix = 'task.';

  const [modalData, setModalData] = useState<
    (Record<string, any> & {id?: number}) | false
  >(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [groupedBy, setGroupedBy] = useState<string>('status');

  if (projectsAreLoading || usersAreLoading || tasksAreLoading)
    return <p>Loading...</p>;

  const projects = projectsRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const users = usersRaw.map((d) => ({
    value: d.id,
    label: (
      <div className='h-6 space-x-2 flex flex-row w-full'>
        <UserAvatar image={d.image} name={d.name} />
        <div>{d.name}</div>
      </div>
    ),
  }));

  if (!tasksRaw) return <p>Please create a project for using Tasks</p>;

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

    setModalData(false);
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
    {
      key: 'address',
      label: 'Address',
      type: 'text',
      editable: true,
    },
    {
      key: 'gps',
      label: 'GPS (lat,lng)',
      type: 'text',
      editable: false,
      visible: false,
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
          <label className='ps-2 text-sm font-medium text-zinc-700'>
            Group:
          </label>
          <SelectComponent
            column={{
              key: 'group',
              label: 'Grouped by',
              type: 'select',
              options: [
                {
                  value: 'status',
                  label: t('status'),
                },
                {
                  value: 'priority',
                  label: t('priority'),
                },
                {
                  value: 'type',
                  label: t('type'),
                },
              ],
            }}
            filters={{
              group: groupedBy,
            }}
            handleFilterChange={(_column, value) => {
              setGroupedBy(value);
            }}
          />
        </div>

        <button
          onClick={() => setModalData({})}
          className='flex items-center bg-zinc-800 text-white px-2 py-1 rounded-xs hover:bg-zinc-700'
        >
          <FiPlus className='mr-1' /> Add
        </button>
      </div>
      <GroupedTableComponent
        columns={fields}
        data={tasksRaw}
        groupedBy={groupedBy}
      />

      {modalData && (
        <FormModal
          title={(modalData.id ? 'Edit ' : 'Create ') + 'Task'}
          onClose={() => setModalData(false)}
          fields={fields}
          data={modalData}
          onSave={(form) => {
            return saveData(form as Record<string, any>);
          }}
        />
      )}

      {selectedTask && (
        <TaskModal
          users={users}
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={updateTask}
        />
      )}
    </div>
  );
};

export default Tasks;
