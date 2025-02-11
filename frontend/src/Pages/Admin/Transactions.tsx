import CrudManager from '../../components/CrudManager';

const Transactions = () => {
  return (
    <CrudManager
      title='Transactions'
      apiEndpoint='transactions'
      fields={[
        {name: 'type', label: 'Type (Income/Outgoing)', type: 'text'},
        {name: 'amount', label: 'Amount', type: 'number'},
        {name: 'date', label: 'Date', type: 'date'},
        {name: 'description', label: 'Description', type: 'text'},
        {name: 'related_project_id', label: 'Project ID', type: 'number'},
        {name: 'related_client_id', label: 'Client ID', type: 'number'},
      ]}
    />
  );
};

export default Transactions;
