import CrudManager from '../../components/CrudManager';
import {useApi} from '../../hooks/useApi.ts';

const Notes = () => {
  const {data: projectsRaw, isLoading: projectsAreLoading} = useApi('projects');
  const {data: clientsRaw, isLoading: clientsAreLoading} = useApi('clients');
  const {data: tasksRaw, isLoading: tasksAreLoading} = useApi('tasks');

  if (projectsAreLoading || clientsAreLoading || tasksAreLoading)
    return <p>Loading...</p>;

  const projects = projectsRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const clients = clientsRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const tasks = tasksRaw.map((d) => ({
    value: d.id,
    label: d.title,
  }));

  return (
    <CrudManager
      title='Notes'
      apiEndpoint='notes'
      fields={[
        {key: 'title', label: 'Title', type: 'text'},
        {key: 'content', label: 'Content', type: 'text'},
        {
          key: 'related_project_id',
          label: 'Project ID',
          type: 'select',
          editable: true,
          options: projects,
        },
        {
          key: 'related_task_id',
          label: 'Task ID',
          type: 'select',
          editable: true,
          options: tasks,
        },
        {
          key: 'related_client_id',
          label: 'Client ID',
          type: 'autocomplete',
          editable: true,
          options: clients,
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
          type: 'address',
          editable: false,
          visible: false,
        },
      ]}
    />
  );
};

export default Notes;
