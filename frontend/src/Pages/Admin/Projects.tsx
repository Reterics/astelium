import CrudManager from '../../components/CrudManager';

const Projects = () => {
  return (
    <CrudManager
      title='Projects'
      apiEndpoint='/api/projects'
      fields={[
        {name: 'name', label: 'Project Name', type: 'text'},
        {name: 'description', label: 'Description', type: 'text'},
        {name: 'status', label: 'Status', type: 'text'},
        {name: 'client_id', label: 'Client ID', type: 'number'},
      ]}
    />
  );
};

export default Projects;
