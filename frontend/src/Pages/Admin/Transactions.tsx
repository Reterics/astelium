import CrudManager from '../../components/CrudManager';

const Transactions = () => {
  return (
    <CrudManager
      title='Transactions'
      apiEndpoint='transactions'
      fields={[
        {key: 'type', label: 'Type (Income/Outgoing)', type: 'text'},
        {key: 'amount', label: 'Amount', type: 'number'},
        {key: 'date', label: 'Date', type: 'date'},
        {key: 'description', label: 'Description', type: 'text'},
        {key: 'related_project_id', label: 'Project ID', type: 'number'},
        {key: 'related_client_id', label: 'Client ID', type: 'number'},
      ]}
    />
  );
};

export default Transactions;
