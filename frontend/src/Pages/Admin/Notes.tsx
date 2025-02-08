import CrudManager from "../../components/CrudManager";

const Notes = () => {
    return (
        <CrudManager
            title="Notes"
            apiEndpoint="/api/notes"
            fields={[
                { name: "title", label: "Title", type: "text" },
                { name: "content", label: "Content", type: "text" },
                { name: "related_project_id", label: "Project ID", type: "number" },
                { name: "related_task_id", label: "Task ID", type: "number" },
                { name: "related_client_id", label: "Client ID", type: "number" },
            ]}
        />
    );
};

export default Notes;
