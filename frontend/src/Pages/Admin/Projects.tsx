import CrudManager from '../../components/CrudManager';
import {useApi} from '../../hooks/useApi.ts';

const Projects = () => {
  const {data, isLoading} = useApi('clients');

  if (isLoading) return <p>Loading...</p>;

  const clients = data.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  if (!clients) return <p>Please create a client for using Projects</p>;

  return (
    <CrudManager
      title='Projects'
      apiEndpoint='projects'
      fields={[
        {key: 'name', label: 'Project Name', type: 'text', editable: true},
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
          options: ['active', 'completed', 'on-hold'],
          editable: true,
        },
        {
          key: 'client_id',
          label: 'Client',
          type: 'select',
          options: clients,
        },
      ]}
    />
  );
};

export default Projects;
