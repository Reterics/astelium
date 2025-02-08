import CrudManager from "../../components/CrudManager";

const Tasks = () => {
    return (
        <CrudManager
            title="Tasks"
            apiEndpoint="/api/tasks"
            fields={[
                { name: "title", label: "Task Title", type: "text" },
                { name: "status", label: "Status", type: "text" },
                { name: "project_id", label: "Project ID", type: "number" },
            ]}
        />
    );
};

export default Tasks;
