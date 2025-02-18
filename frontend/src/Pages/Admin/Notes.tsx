import CrudManager from '../../components/CrudManager';

const Notes = () => {
  return (
    <CrudManager
      title='Notes'
      apiEndpoint='notes'
      fields={[
        {key: 'title', label: 'Title', type: 'text'},
        {key: 'content', label: 'Content', type: 'text'},
        {key: 'related_project_id', label: 'Project ID', type: 'number'},
        {key: 'related_task_id', label: 'Task ID', type: 'number'},
        {key: 'related_client_id', label: 'Client ID', type: 'number'},
      ]}
    />
  );
};

export default Notes;
