import {useApi} from '../../hooks/useApi.ts';
import KanbanBoard, {Task} from '../../components/KanbanBoard.tsx';
import {FiPlus, FiSearch} from 'react-icons/fi';
import FormModal from '../../components/FormModal.tsx';
import {useState} from 'react';
import {CrudField} from '../../components/CrudManager.tsx';

const Board = () => {
  const {data: projectsRaw, isLoading: projectsAreLoading} = useApi('projects');
  const {data: usersRaw, isLoading: usersAreLoading} = useApi('users');
  const {
    data: tasksRaw,
    isLoading: tasksAreLoading,
    updateMutation,
    createMutation,
  } = useApi('tasks');
  const [modalData, setModalData] = useState<
    (Record<string, any> & {id?: number}) | false
  >(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      await createMutation.mutateAsync(body);
    }

    setModalData(false);
    return true;
  };

  const fields: CrudField[] = [
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      editable: true,
      sortable: true,
    },
    {
      key: 'description',
      label: 'Description',
      type: 'text',
      editable: true,
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      editable: true,
      options: ['open', 'in-progress', 'review', 'completed', 'closed'],
    },
    {
      key: 'type',
      label: 'Type',
      type: 'select',
      editable: true,
      options: ['feature', 'task', 'issue'],
    },
    {
      key: 'project_id',
      label: 'Project',
      type: 'select',
      editable: true,
      options: projects,
    },
    {
      key: 'assigned_to',
      label: 'Assigned To',
      type: 'select',
      editable: true,
      options: users,
    },
    {
      key: 'start_time',
      label: 'Start Time',
      type: 'datetime-local',
      editable: true,
    },
    {
      key: 'expected_time',
      label: 'Expected Time (hours)',
      type: 'number',
      editable: true,
    },
    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      editable: true,
      options: ['low', 'medium', 'high'],
    },
    {
      key: 'story_points',
      label: 'Story Points',
      type: 'number',
      editable: true,
    },
  ];

  return (
    <div className='pb-1 shadow-md bg-zinc-50 rounded-lg'>
      <div className='p-4 pb-0 flex items-center space-x-2'>
        <div className='flex items-center space-x-2 flex-1'>
          <FiSearch className='text-zinc-600' />
          <input
            type='text'
            placeholder='Search...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='p-1 border border-zinc-300 rounded-xs'
          />
        </div>

        <button
          onClick={() => setModalData({})}
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
        />
      )}

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
    </div>
  );
};

export default Board;
