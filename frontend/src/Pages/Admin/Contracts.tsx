import CrudManager from '../../components/CrudManager';
import {useApi} from '../../hooks/useApi.ts';

const Contracts = () => {
  const {data: contractTemplates, isLoading: isLoadingTemplates} =
    useApi('contract-templates');

  if (isLoadingTemplates) return <p>Loading...</p>;

  const templateOptions = contractTemplates.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <CrudManager
      title='Contracts'
      apiEndpoint='contracts'
      fields={[
        {key: 'name', label: 'Contract Name', type: 'text', editable: true},
        {key: 'created', label: 'Created Date', type: 'date', editable: true},
        {
          key: 'template_id',
          label: 'Template',
          type: 'select',
          options: templateOptions,
        },
        {
          key: 'data',
          label: 'Contract Data',
          type: 'text',
          editable: true,
        },
      ]}
    />
  );
};

export default Contracts;
