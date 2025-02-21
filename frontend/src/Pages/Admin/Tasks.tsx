import CrudManager from '../../components/CrudManager';
import {useApi} from '../../hooks/useApi.ts';
import {getTranslatedList} from '../../i18n/utils.ts';
import {OPTIONS} from '../../constants.ts';
import {useTranslation} from 'react-i18next';

const Tasks = () => {
  const {data: projectsRaw, isLoading: projectsAreLoading} = useApi('projects');
  const {data: usersRaw, isLoading: usersAreLoading} = useApi('users');
  const {t} = useTranslation();
  const translationPrefix = 'task.';

  if (projectsAreLoading || usersAreLoading) return <p>Loading...</p>;

  const projects = projectsRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  const users = usersRaw.map((d) => ({
    value: d.id,
    label: d.name,
  }));

  if (!projects) return <p>Please create a project for using Tasks</p>;

  return (
    <div>
      <CrudManager
        title='Tasks'
        apiEndpoint='tasks'
        fields={[
          {
            key: 'title',
            label: t('title'),
            type: 'text',
            editable: true,
            sortable: true,
          },
          {
            key: 'description',
            label: t('description'),
            type: 'text',
            editable: true,
          },
          {
            key: 'status',
            label: t('status'),
            type: 'select',
            editable: true,
            options: getTranslatedList(
              OPTIONS.task.status,
              t,
              translationPrefix
            ),
          },
          {
            key: 'type',
            label: t('type'),
            type: 'select',
            editable: true,
            options: getTranslatedList(OPTIONS.task.type, t, translationPrefix),
          },
          {
            key: 'project_id',
            label: t('project'),
            type: 'select',
            editable: true,
            options: projects,
          },
          {
            key: 'assigned_to',
            label: t('assigned_to'),
            type: 'select',
            editable: true,
            options: users,
          },
          {
            key: 'start_time',
            label: t('start_time'),
            type: 'datetime-local',
            editable: true,
          },
          {
            key: 'expected_time',
            label: t('expected_time'),
            type: 'number',
            editable: true,
          },
          {
            key: 'priority',
            label: t('priority'),
            type: 'select',
            editable: true,
            options: getTranslatedList(
              OPTIONS.priorities,
              t,
              translationPrefix
            ),
          },
          {
            key: 'story_points',
            label: t('story_points'),
            type: 'number',
            editable: true,
          },
        ]}
      />
    </div>
  );
};

export default Tasks;
