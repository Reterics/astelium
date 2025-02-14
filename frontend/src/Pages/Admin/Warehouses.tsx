import CrudManager from '../../components/CrudManager';

const Warehouses = () => {
  return (
    <CrudManager
      title='Warehouses'
      apiEndpoint='warehouses'
      fields={[
        {name: 'name', label: 'Warehouse Name', type: 'text', editable: true},
        {name: 'location', label: 'Location', type: 'text', editable: true},
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          editable: true,
        },
      ]}
    />
  );
};

export default Warehouses;
