import {FiUsers, FiClipboard, FiBarChart, FiTrendingUp} from 'react-icons/fi';
import {useApi} from '../../hooks/useApi.ts';
import TransactionChartCard from '../../components/visualizations/TransactionChartCard.tsx';
import TaskBarChartCard from '../../components/visualizations/TaskBarChartCard.tsx';
import {useTranslation} from 'react-i18next';

const statusIcons = {
  open: 'border-l-4 border-blue-500',
  'in-progress': 'border-l-4 border-yellow-500',
  completed: 'border-l-4 border-green-500',
};

const Dashboard = () => {
  const {data: users} = useApi('users');
  const {data: projects} = useApi('projects');
  const {data: tasks} = useApi('tasks');
  const {data: transactions} = useApi('transactions');
  const {t} = useTranslation();

  return (
    <div className='mt-1 p-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
      <div className='bg-white p-4 rounded-lg shadow flex items-center space-x-4'>
        <FiUsers className='text-zinc-600 w-10 h-10' />
        <div>
          <p className='text-xl font-semibold text-zinc-900'>
            {users?.length || 0}
          </p>
          <p className='text-zinc-600'>{t('dashboard.total_users')}</p>
        </div>
      </div>
      <div className='bg-white p-4 rounded-lg shadow flex items-center space-x-4'>
        <FiClipboard className='text-zinc-600 w-10 h-10' />
        <div>
          <p className='text-xl font-semibold text-zinc-900'>
            {projects?.length || 0}
          </p>
          <p className='text-zinc-600'>{t('dashboard.total_projects')}</p>
        </div>
      </div>
      <div className='bg-white p-4 rounded-lg shadow flex items-center space-x-4'>
        <FiBarChart className='text-zinc-600 w-10 h-10' />
        <div>
          <p className='text-xl font-semibold text-zinc-900'>
            {transactions?.length || 0}
          </p>
          <p className='text-zinc-600'>{t('dashboard.total_transactions')}</p>
        </div>
      </div>
      <div className='bg-white p-4 rounded-lg shadow flex items-center space-x-4'>
        <FiTrendingUp className='text-zinc-600 w-10 h-10' />
        <div>
          <p className='text-xl font-semibold text-zinc-900'>
            {tasks?.length || 0}
          </p>
          <p className='text-zinc-600'>{t('dashboard.total_tasks')}</p>
        </div>
      </div>

      <div className='col-span-4 flex space-x-4 w-full'>
        <div className='w-1/2'>
          <TaskBarChartCard data={tasks} />
        </div>

        <div className='bg-white p-2 rounded-lg shadow w-1/2'>
          <h2 className='text-xl font-semibold text-zinc-900 mb-3'>
            {t('dashboard.task_list_title')}
          </h2>
          <div className='divide-y divide-zinc-300'>
            {tasks
              ?.filter((t) => t.status === 'open' || t.status === 'in-progress')
              ?.map((task) => (
                <div
                  key={task.id}
                  className={`p-2 flex items-center justify-between text-sm ${statusIcons[task.status as 'open' | 'in-progress']}`}
                >
                  <p className='text-zinc-900 font-medium truncate'>
                    {task.title}
                  </p>
                  <button className='px-2 py-1 text-xs font-medium text-white bg-zinc-700 rounded hover:bg-zinc-800 transition'>
                    {t('dashboard.view')}
                  </button>
                </div>
              )) || (
              <p className='text-zinc-600'>
                {t('dashboard.no_open_tasks_available')}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className='col-span-4 flex space-x-4 w-full'>
        <TransactionChartCard data={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;
