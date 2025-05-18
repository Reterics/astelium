import CrudManager from '../../components/CrudManager';
import {useApi} from '../../hooks/useApi.ts';

const Transactions = () => {
  const {data: projectsRaw, isLoading: projectsAreLoading} = useApi('projects');
  const {data: clientsRaw, isLoading: clientsAreLoading} = useApi('clients');

  if (projectsAreLoading || clientsAreLoading) return <p>Loading...</p>;

  const projects = projectsRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const clients = clientsRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  return (
    <CrudManager
      title='Transactions'
      apiEndpoint='transactions'
      fields={[
        {key: 'type', label: 'Type (Income/Outgoing)', type: 'text'},
        {key: 'amount', label: 'Amount', type: 'number'},
        {key: 'date', label: 'Date', type: 'date'},
        {key: 'description', label: 'Description', type: 'text'},
        {
          key: 'related_project_id',
          label: 'Project ID',
          type: 'select',
          editable: true,
          options: projects,
        },
        {
          key: 'related_client_id',
          label: 'Client ID',
          type: 'autocomplete',
          editable: true,
          options: clients,
        },
      ]}
    />
  );
};

export default Transactions;
