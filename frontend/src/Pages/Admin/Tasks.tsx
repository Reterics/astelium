import CrudManager from '../../components/CrudManager';
import {useApi} from "../../hooks/useApi.ts";

const Tasks = () => {
  const { data, isLoading } = useApi('projects');

  if (isLoading) return <p>Loading...</p>;

  const projects =  data.map((d: {id: any; name: any}) => ({
    value: d.id,
    label: d.name,
  }))

  if (!projects) return <p>Please create a project for using Tasks</p>;

  return (
    <CrudManager
      title='Tasks'
      apiEndpoint='tasks'
      fields={[
        {name: 'title', label: 'Task Title', type: 'text'},
        {name: 'status', label: 'Status', type: 'select', options: ['pending','in-progress','completed']},
        {name: 'project_id', label: 'Project ID', type: 'select', options: projects,},
      ]}
    />
  );
};

export default Tasks;
