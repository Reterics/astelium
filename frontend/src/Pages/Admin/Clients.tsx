import CrudManager from "../../components/CrudManager";

const Clients = () => {
    return (
        <CrudManager
            title="Clients"
            apiEndpoint="/api/clients"
            fields={[
                { name: "name", label: "Client Name", type: "text" },
                { name: "email", label: "Email", type: "email" },
                { name: "phone", label: "Phone", type: "text" },
                { name: "company", label: "Company", type: "text" },
            ]}
        />
    );
};

export default Clients;
