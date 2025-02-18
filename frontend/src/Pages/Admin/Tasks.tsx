import CrudManager from '../../components/CrudManager';
import {useApi} from '../../hooks/useApi.ts';

const Tasks = () => {
  const {data: projectsRaw, isLoading: projectsAreLoading} = useApi('projects');
  const {data: usersRaw, isLoading: usersAreLoading} = useApi('users');

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

  return (
    <div>
      <CrudManager
        title='Tasks'
        apiEndpoint='tasks'
        fields={[
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
        ]}
      />
    </div>
  );
};

export default Tasks;
