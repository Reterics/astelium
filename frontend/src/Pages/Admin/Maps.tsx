import CrudManager from '../../components/CrudManager';
import {useApi} from '../../hooks/useApi.ts';
import {FiEdit3} from 'react-icons/fi';
import {useNavigate} from 'react-router-dom';

const Maps = () => {
  const {data: projectsRaw, isLoading: projectsAreLoading} = useApi('projects');
  const {data: clientsRaw, isLoading: clientsAreLoading} = useApi('clients');
  const {data: tasksRaw, isLoading: tasksAreLoading} = useApi('tasks');
  const navigate = useNavigate();

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
      title='Map'
      apiEndpoint='maps'
      fields={[
        {key: 'name', label: 'Name', type: 'text', editable: true},
        {
          key: 'description',
          label: 'Description',
          type: 'text',
          editable: true,
        },
        {key: 'image', label: 'Image', type: 'text', editable: true},
        {
          key: 'private',
          label: 'Private',
          type: 'select',
          editable: true,
          options: [
            {label: 'Yes', value: 'true'},
            {label: 'No', value: 'false'},
          ],
        },
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
          type: 'select',
          editable: true,
          options: clients,
        },
      ]}
      actions={[
        {
          icon: <FiEdit3 />,
          isActive: () => true,
          onClick: async (row) => {
            const id = row.id as number | undefined;

            if (id) {
              navigate('/map?id=' + id);
            }
          },
        },
      ]}
    />
  );
};

export default Maps;
