import CrudManager from '../../components/CrudManager';

const ContractTemplates = () => {
  return (
    <CrudManager
      title='Contract Templates'
      apiEndpoint='contract-templates'
      fields={[
        {key: 'name', label: 'Template Name', type: 'text', editable: true},
        {
          key: 'templateContent',
          label: 'Template Content',
          type: 'text',
          editable: true,
        },
      ]}
    />
  );
};

export default ContractTemplates;
