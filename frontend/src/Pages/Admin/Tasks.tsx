import CrudManager from '../../components/CrudManager';
import {useApi} from "../../hooks/useApi.ts";

const Tasks = () => {
  const { data: projectsRaw, isLoading: projectsAreLoading } = useApi('projects');
  const { data: usersRaw, isLoading: usersAreLoading } = useApi('users');

  if (projectsAreLoading || usersAreLoading) return <p>Loading...</p>;

  const projects =  projectsRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }))

  const users =  usersRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }))

  if (!projects) return <p>Please create a project for using Tasks</p>;

  return (
    <CrudManager
      title='Tasks'
      apiEndpoint='tasks'
      fields={[
        { name: "title", label: "Title", type: "text", editable: true, sortable: true },
        { name: "description", label: "Description", type: "textarea", editable: true },
        { name: "status", label: "Status", type: "select", editable: true, options: ["open", "in-progress", "review", "completed", "closed"] },
        { name: "project_id", label: "Project", type: "select", editable: true, options: projects },
        { name: "assigned_to", label: "Assigned To", type: "select", editable: true, options: users },
        { name: "start_time", label: "Start Time", type: "datetime-local", editable: true },
        { name: "expected_time", label: "Expected Time (hours)", type: "number", editable: true },
        { name: "priority", label: "Priority", type: "select", editable: true, options: ["low", "medium", "high"] },
        { name: "story_points", label: "Story Points", type: "number", editable: true },
      ]}
    />
  );
};

export default Tasks;
