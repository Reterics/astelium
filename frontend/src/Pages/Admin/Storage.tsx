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
        {key: 'sku', label: 'SKU', type: 'text'},
        {key: 'name', label: 'Name', type: 'text', editable: true},
        {
          key: 'description',
          label: 'Description',
          type: 'text',
          editable: true,
        },
        {key: 'threshold', label: 'Threshold', type: 'number', visible: false},
        {
          key: 'storage_amount',
          label: 'Storage Amount',
          type: 'number',
          editable: true,
        },
        {key: 'value', label: 'Value (HUF)', type: 'number', editable: true},
        {
          key: 'warehouses',
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
