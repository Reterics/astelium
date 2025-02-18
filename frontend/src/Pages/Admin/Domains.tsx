import CrudManager from '../../components/CrudManager';

const Domains = () => {
  return (
    <CrudManager
      title='Domains'
      apiEndpoint='domains'
      fields={[
        {key: 'url', label: 'Domain URL', type: 'text', editable: true},
        {
          key: 'description',
          label: 'Description',
          type: 'text',
          editable: true,
        },
        {key: 'admin_url', label: 'Admin URL', type: 'text', editable: true},
        {
          key: 'credentials',
          label: 'Credentials',
          type: 'password',
          editable: true,
        },
      ]}
    />
  );
};

export default Domains;
