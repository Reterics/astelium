import CrudManager from '../../components/CrudManager';
import {useEffect, useState} from 'react';
import {SelectOptions} from '../../components/SelectComponent.tsx';

const Projects = () => {
  const [clients, setClients] = useState<SelectOptions>([]);

  useEffect(() => {
    fetch('/api/clients')
      .then((res) => res.json())
      .then((data) =>
        setClients(
          data.map((d: {id: any; name: any}) => ({
            value: d.id,
            label: d.name,
          }))
        )
      );
  }, []);

  if (!clients) return null;

  return (
    <CrudManager
      title='Projects'
      apiEndpoint='/api/projects'
      fields={[
        {name: 'name', label: 'Project Name', type: 'text', editable: true},
        {
          name: 'description',
          label: 'Description',
          type: 'text',
          editable: true,
        },
        {
          name: 'status',
          label: 'Status',
          type: 'select',
          options: ['active', 'completed', 'on-hold'],
          editable: true,
        },
        {
          name: 'client_id',
          label: 'Client',
          type: 'select',
          options: clients,
        },
      ]}
    />
  );
};

export default Projects;
