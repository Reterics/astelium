import CrudManager from '../../components/CrudManager';

const Clients = () => {
  return (
    <CrudManager
      title='Clients'
      apiEndpoint='clients'
      fields={[
        {key: 'name', label: 'Client Name', type: 'text', editable: true},
        {key: 'email', label: 'Email', type: 'text', editable: true},
        {key: 'phone', label: 'Phone', type: 'text', editable: true},
        {key: 'company', label: 'Company', type: 'text', editable: true},
      ]}
    />
  );
};

export default Clients;
