import CrudManager from '../../components/CrudManager';

const Storage = () => {
  return (
    <CrudManager
      title='Storage'
      apiEndpoint='/api/storage'
      fields={[
        {name: 'sku', label: 'SKU', type: 'text'},
        {name: 'name', label: 'Name', type: 'text'},
        {name: 'description', label: 'Description', type: 'text'},
        {name: 'threshold', label: 'Threshold', type: 'number'},
        {name: 'storage_amount', label: 'Storage Amount', type: 'number'},
        {name: 'value', label: 'Value', type: 'number'},
        {name: 'place', label: 'Place', type: 'text'},
      ]}
    />
  );
};

export default Storage;
