import CrudManager from '../../components/CrudManager';
import {useApi} from '../../hooks/useApi.ts';

const Storage = () => {
  const {data, isLoading} = useApi('warehouses');

  if (isLoading) return <p>Loading...</p>;

  const warehouses = data.map((d) => ({
    value: d.id.toString(),
    label: d.name,
  }));

  if (!warehouses) return <p>Please create a warehouse for using Storages</p>;

  return (
    <CrudManager
      title='Storage'
      apiEndpoint='storage'
      fields={[
        {name: 'sku', label: 'SKU', type: 'text'},
        {name: 'name', label: 'Name', type: 'text', editable: true},
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          editable: true,
        },
        {name: 'threshold', label: 'Threshold', type: 'number', visible: false},
        {
          name: 'storage_amount',
          label: 'Storage Amount',
          type: 'number',
          editable: true,
        },
        {name: 'value', label: 'Value (HUF)', type: 'number', editable: true},
        {
          name: 'warehouses',
          label: 'Store',
          type: 'multiselect',
          options: warehouses,
          editable: true,
        },
      ]}
    />
  );
};

export default Storage;
