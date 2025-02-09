import CrudManager from '../../components/CrudManager';

const Clients = () => {
  return (
    <CrudManager
      title='Clients'
      apiEndpoint='/api/clients'
      fields={[
        {name: 'name', label: 'Client Name', type: 'text', editable: true},
        {name: 'email', label: 'Email', type: 'email', editable: true},
        {name: 'phone', label: 'Phone', type: 'text', editable: true},
        {name: 'company', label: 'Company', type: 'text', editable: true},
      ]}
    />
  );
};

export default Clients;
