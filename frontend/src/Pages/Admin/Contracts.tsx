import CrudManager from '../../components/CrudManager';
import { useApi } from "../../hooks/useApi.ts";

const Contracts = () => {
  const { data: contractTemplates, isLoading: isLoadingTemplates } = useApi('contract-templates');

  if (isLoadingTemplates) return <p>Loading...</p>;

  const templateOptions = contractTemplates.map((t: { id: any; name: any }) => ({
    value: t.id,
    label: t.name,
  }));

  return (
    <CrudManager
      title="Contracts"
      apiEndpoint="contracts"
      fields={[
        { name: "name", label: "Contract Name", type: "text", editable: true },
        { name: "created", label: "Created Date", type: "date", editable: true },
        { name: "template_id", label: "Template", type: "select", options: templateOptions },
        { name: "data", label: "Contract Data", type: "textarea", editable: true },
      ]}
    />
  );
};

export default Contracts;
