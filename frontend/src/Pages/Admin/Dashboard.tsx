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
    <div className='mt-1 p-2 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3'>
      <div className='bg-white border border-zinc-200 p-3 rounded-none flex items-center gap-3'>
        <FiUsers className='text-zinc-600 w-8 h-8' />
        <div>
          <p className='text-base font-semibold text-zinc-900 m-0'>
            {users?.length || 0}
          </p>
          <p className='text-xs text-zinc-600 m-0'>
            {t('dashboard.total_users')}
          </p>
        </div>
      </div>
      <div className='bg-white border border-zinc-200 p-3 rounded-none flex items-center gap-3'>
        <FiClipboard className='text-zinc-600 w-8 h-8' />
        <div>
          <p className='text-base font-semibold text-zinc-900 m-0'>
            {projects?.length || 0}
          </p>
          <p className='text-xs text-zinc-600 m-0'>
            {t('dashboard.total_projects')}
          </p>
        </div>
      </div>
      <div className='bg-white border border-zinc-200 p-3 rounded-none flex items-center gap-3'>
        <FiBarChart className='text-zinc-600 w-8 h-8' />
        <div>
          <p className='text-base font-semibold text-zinc-900 m-0'>
            {transactions?.length || 0}
          </p>
          <p className='text-xs text-zinc-600 m-0'>
            {t('dashboard.total_transactions')}
          </p>
        </div>
      </div>
      <div className='bg-white border border-zinc-200 p-3 rounded-none flex items-center gap-3'>
        <FiTrendingUp className='text-zinc-600 w-8 h-8' />
        <div>
          <p className='text-base font-semibold text-zinc-900 m-0'>
            {tasks?.length || 0}
          </p>
          <p className='text-xs text-zinc-600 m-0'>
            {t('dashboard.total_tasks')}
          </p>
        </div>
      </div>

      <div className='col-span-4 flex gap-3 w-full'>
        <div className='w-1/2'>
          <TaskBarChartCard data={tasks} />
        </div>
        <div className='bg-white border border-zinc-200 p-3 rounded-none w-1/2 flex flex-col'>
          <h2 className='text-base font-semibold text-zinc-900 mb-2'>
            {t('dashboard.task_list_title')}
          </h2>
          <div className='divide-y divide-zinc-200 flex-1'>
            {tasks
              ?.filter((t) => t.status === 'open' || t.status === 'in-progress')
              ?.map((task) => (
                <div
                  key={task.id}
                  className={`py-2 flex items-center justify-between text-xs ${statusIcons[task.status as 'open' | 'in-progress']}`}
                >
                  <p className='text-zinc-900 font-medium truncate m-0'>
                    {task.title}
                  </p>
                  <button
                    className='px-2 py-1 text-xs font-medium text-white bg-zinc-700 hover:bg-zinc-800 rounded-none transition'
                    style={{borderRadius: 0}}
                  >
                    {t('dashboard.view')}
                  </button>
                </div>
              ))
              .slice(0, 4) || (
              <p className='text-zinc-600 text-xs m-0'>
                {t('dashboard.no_open_tasks_available')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className='col-span-4 flex gap-3 w-full'>
        <TransactionChartCard data={transactions} />
      </div>
    </div>
  );
};

export default Dashboard;
