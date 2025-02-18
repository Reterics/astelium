import CrudManager from '../../components/CrudManager';

const Warehouses = () => {
  return (
    <CrudManager
      title='Warehouses'
      apiEndpoint='warehouses'
      fields={[
        {key: 'name', label: 'Warehouse Name', type: 'text', editable: true},
        {key: 'location', label: 'Location', type: 'text', editable: true},
        {
          key: 'description',
          label: 'Description',
          type: 'text',
          editable: true,
        },
      ]}
    />
  );
};

export default Warehouses;
