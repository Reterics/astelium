import {
  FiUsers,
  FiClipboard,
  FiBarChart,
  FiTrendingUp,
  FiSave,
  FiTarget,
} from 'react-icons/fi';
import {useApi} from '../../hooks/useApi.ts';
import TransactionChartCard from '../../components/visualizations/TransactionChartCard.tsx';
import TaskBarChartCard from '../../components/visualizations/TaskBarChartCard.tsx';
import {useTranslation} from 'react-i18next';
import {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import DraggableDashboard from '../../components/DraggableDashboard.tsx';
import GoalProgressCard from '../../components/GoalProgressCard';

const Dashboard = () => {
  const {data: users} = useApi('users');
  const {data: projects} = useApi('projects');
  const {data: tasks} = useApi('tasks');
  const {data: transactions} = useApi('transactions');
  const {data: goals, isLoading: goalsLoading} = useApi('goals');
  const {t} = useTranslation();
  const [activeView, setActiveView] = useState('default');
  const [isLoading, setIsLoading] = useState(true);
  const [widgetOrder, setWidgetOrder] = useState<number[]>([]);
  const [showSaveButton, setShowSaveButton] = useState(false);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle widget order change
  const handleWidgetOrderChange = (newOrder: number[]) => {
    setWidgetOrder(newOrder);
    setShowSaveButton(true);
  };

  // Save dashboard layout
  const saveDashboardLayout = () => {
    // In a real app, this would save to backend
    localStorage.setItem('dashboardWidgetOrder', JSON.stringify(widgetOrder));
    setShowSaveButton(false);

    // Show success message (in a real app, use a toast notification)
    alert(t('dashboard.layout_saved'));
  };

  // Dashboard view options
  const viewOptions = [
    {id: 'default', label: t('dashboard.default_view')},
    {id: 'performance', label: t('dashboard.performance_view')},
    {id: 'tasks', label: t('dashboard.tasks_view')},
  ];

  // Loading skeleton
  if (isLoading) {
    return (
      <div className='p-6 space-y-6'>
        <div className='flex justify-between items-center'>
          <div className='h-8 w-48 bg-gray-200 rounded animate-pulse'></div>
          <div className='h-10 w-32 bg-gray-200 rounded animate-pulse'></div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6'>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className='bg-white shadow-sm rounded-lg p-4 h-24 animate-pulse'
            >
              <div className='flex items-center gap-4'>
                <div className='w-12 h-12 rounded-full bg-gray-200'></div>
                <div className='space-y-2'>
                  <div className='h-5 w-20 bg-gray-200 rounded'></div>
                  <div className='h-4 w-16 bg-gray-200 rounded'></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div className='bg-white shadow-sm rounded-lg p-4 h-64 animate-pulse'>
            <div className='h-6 w-32 bg-gray-200 rounded mb-4'></div>
            <div className='h-48 bg-gray-200 rounded'></div>
          </div>
          <div className='bg-white shadow-sm rounded-lg p-4 h-64 animate-pulse'>
            <div className='h-6 w-32 bg-gray-200 rounded mb-4'></div>
            <div className='space-y-3'>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className='h-10 bg-gray-200 rounded'></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Create widget components for the draggable dashboard
  const StatCardsWidget = () => (
    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 w-full'>
      <motion.div
        className='bg-white shadow-sm rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow duration-300'
        whileHover={{y: -5}}
        transition={{type: 'spring', stiffness: 300}}
      >
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-blue-100 rounded-lg'>
            <FiUsers className='text-blue-600 w-6 h-6' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>
              {users?.length || 0}
            </p>
            <p className='text-sm text-gray-500'>
              {t('dashboard.total_users')}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className='bg-white shadow-sm rounded-lg p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow duration-300'
        whileHover={{y: -5}}
        transition={{type: 'spring', stiffness: 300}}
      >
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-green-100 rounded-lg'>
            <FiClipboard className='text-green-600 w-6 h-6' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>
              {projects?.length || 0}
            </p>
            <p className='text-sm text-gray-500'>
              {t('dashboard.total_projects')}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className='bg-white shadow-sm rounded-lg p-4 border-l-4 border-purple-500 hover:shadow-md transition-shadow duration-300'
        whileHover={{y: -5}}
        transition={{type: 'spring', stiffness: 300}}
      >
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-purple-100 rounded-lg'>
            <FiBarChart className='text-purple-600 w-6 h-6' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>
              {transactions?.length || 0}
            </p>
            <p className='text-sm text-gray-500'>
              {t('dashboard.total_transactions')}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className='bg-white shadow-sm rounded-lg p-4 border-l-4 border-amber-500 hover:shadow-md transition-shadow duration-300'
        whileHover={{y: -5}}
        transition={{type: 'spring', stiffness: 300}}
      >
        <div className='flex items-center gap-4'>
          <div className='p-3 bg-amber-100 rounded-lg'>
            <FiTrendingUp className='text-amber-600 w-6 h-6' />
          </div>
          <div>
            <p className='text-2xl font-bold text-gray-800'>
              {tasks?.length || 0}
            </p>
            <p className='text-sm text-gray-500'>
              {t('dashboard.total_tasks')}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );

  const TaskChartWidget = () => (
    <div className='bg-white shadow-sm rounded-lg overflow-hidden'>
      <TaskBarChartCard data={tasks} />
    </div>
  );

  const TaskListWidget = () => (
    <div className='bg-white shadow-sm rounded-lg p-4 overflow-hidden'>
      <h2 className='text-lg font-semibold text-gray-800 mb-4'>
        {t('dashboard.task_list_title')}
      </h2>
      <div className='space-y-3'>
        {tasks
          ?.filter((t) => t.status === 'open' || t.status === 'in-progress')
          ?.map((task) => (
            <motion.div
              key={task.id}
              className={`p-3 flex items-center justify-between rounded-lg bg-white shadow-sm ${
                task.status === 'open'
                  ? 'border-l-4 border-blue-500'
                  : 'border-l-4 border-yellow-500'
              }`}
              whileHover={{x: 5}}
              transition={{type: 'spring', stiffness: 400}}
            >
              <div>
                <p className='font-medium text-gray-800'>{task.title}</p>
                <p className='text-xs text-gray-500'>{task.status}</p>
              </div>
              <button className='px-3 py-1 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors duration-200'>
                {t('dashboard.view')}
              </button>
            </motion.div>
          ))
          .slice(0, 4) || (
          <p className='text-gray-500 text-center py-4'>
            {t('dashboard.no_open_tasks_available')}
          </p>
        )}
      </div>
    </div>
  );

  const TransactionChartWidget = () => (
    <div className='bg-white shadow-sm rounded-lg overflow-hidden'>
      <TransactionChartCard data={transactions} />
    </div>
  );

  // Active Goals Widget
  const ActiveGoalsWidget = () => {
    // Filter for active goals
    const activeGoals = goals?.filter(goal => goal.status === 'active') || [];

    if (goalsLoading) {
      return (
        <div className='bg-white shadow-sm rounded-lg p-4 overflow-hidden'>
          <div className='flex items-center gap-2 mb-4'>
            <FiTarget className='text-indigo-600' />
            <h2 className='text-lg font-semibold text-gray-800'>
              {t('dashboard.active_goals')}
            </h2>
          </div>
          <div className='space-y-4 animate-pulse'>
            {[1, 2, 3].map(i => (
              <div key={i} className='h-20 bg-gray-200 rounded'></div>
            ))}
          </div>
        </div>
      );
    }

    if (activeGoals.length === 0) {
      return (
        <div className='bg-white shadow-sm rounded-lg p-4 overflow-hidden'>
          <div className='flex items-center gap-2 mb-4'>
            <FiTarget className='text-indigo-600' />
            <h2 className='text-lg font-semibold text-gray-800'>
              {t('dashboard.active_goals')}
            </h2>
          </div>
          <p className='text-gray-500 text-center py-8'>
            {t('dashboard.no_active_goals')}
          </p>
        </div>
      );
    }

    return (
      <div className='bg-white shadow-sm rounded-lg p-4 overflow-hidden'>
        <div className='flex items-center gap-2 mb-4'>
          <FiTarget className='text-indigo-600' />
          <h2 className='text-lg font-semibold text-gray-800'>
            {t('dashboard.active_goals')}
          </h2>
        </div>
        <div className='space-y-4'>
          {activeGoals.map(goal => (
            <div key={goal.id} className='border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='font-medium text-gray-800'>{goal.title}</h3>
                <span className='text-sm font-medium text-white bg-green-500 px-2 py-0.5 rounded-full'>
                  {t('dashboard.active')}
                </span>
              </div>
              <div className='mb-3'>
                <GoalProgressCard goalId={goal.id} showDetails={true} />
              </div>
              <div className='flex justify-between items-center text-sm'>
                <span className='text-gray-500'>
                  {t('dashboard.target')}: ${parseFloat(goal.target_amount).toLocaleString()}
                </span>
                <span className='text-gray-500'>
                  {t('dashboard.due')}: {new Date(goal.due_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Dashboard widgets array
  const dashboardWidgets = [
    <StatCardsWidget key='stats' />,
    <div key='charts' className='grid grid-cols-1 lg:grid-cols-2 gap-6 w-full'>
      <TaskChartWidget />
      <TaskListWidget />
    </div>,
    <TransactionChartWidget key='transactions' />,
    <ActiveGoalsWidget key='active-goals' />,
  ];

  return (
    <div className='p-6 space-y-6'>
      {/* Dashboard header with view selector and save button */}
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>
          {t('dashboard.title')}
        </h1>
        <div className='flex items-center gap-4'>
          {showSaveButton && (
            <button
              onClick={saveDashboardLayout}
              className='flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200'
            >
              <FiSave className='w-4 h-4' />
              {t('dashboard.save_layout')}
            </button>
          )}
          <div className='flex items-center space-x-2 bg-white shadow-sm rounded-lg p-1'>
            {viewOptions.map((option) => (
              <button
                key={option.id}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  activeView === option.id
                    ? 'bg-indigo-500 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveView(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Draggable dashboard */}
      <DraggableDashboard onOrderChange={handleWidgetOrderChange}>
        {dashboardWidgets}
      </DraggableDashboard>
    </div>
  );
};

export default Dashboard;
