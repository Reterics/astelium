import CrudManager from '../../components/CrudManager';


const Domains = () => {
  return (
    <CrudManager
      title="Domains"
      apiEndpoint="domains"
      fields={[
        { name: "url", label: "Domain URL", type: "text", editable: true },
        { name: "description", label: "Description", type: "text", editable: true },
        { name: "admin_url", label: "Admin URL", type: "text", editable: true },
        { name: "credentials", label: "Credentials", type: "password", editable: true },
      ]}
    />
  );
};

export default Domains;
