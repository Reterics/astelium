import CrudManager from '../../components/CrudManager';


const ContractTemplates = () => {
  return (
    <CrudManager
      title="Contract Templates"
      apiEndpoint="contract-templates"
      fields={[
        { name: "name", label: "Template Name", type: "text", editable: true },
        { name: "templateContent", label: "Template Content", type: "textarea", editable: true },
      ]}
    />
  );
};

export default ContractTemplates;
