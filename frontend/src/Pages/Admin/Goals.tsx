import {useState} from 'react';
import CrudManager from '../../components/CrudManager';
import { useApi } from '../../hooks/useApi.ts';
import GoalLineChart from '../../components/visualizations/GoalLineChart';

const Goals = () => {
  const { data: categoriesRaw, isLoading: categoriesAreLoading } = useApi('transaction-categories');
  const { data: goals, isLoading: goalsLoading } = useApi('goals');
  const [selectedGoal, setSelectedGoal] = useState<Record<string, any> | null>(null);
  const [timeScale, setTimeScale] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  if (categoriesAreLoading) return <p>Loading...</p>;

  const categoryOptions = categoriesRaw.map((category) => ({
    value: category.id.toString(),
    label: category.name,
  }));

  return (
    <div className="space-y-6">
      <CrudManager
        title="Financial Goals"
        apiEndpoint="goals"
        actions={[
          {
            icon: 'Select',
            isActive: () => true,
            onClick: async (row) => {
              if (goalsLoading) {
                return;
              }
              setSelectedGoal(goals.find((goal) => goal.id === row.id) || null);
            },
          },
        ]}
        fields={[
          { key: 'title', label: 'Goal Title', type: 'text' },
          { key: 'target_amount', label: 'Target Amount', type: 'number' },
          { key: 'start_date', label: 'Start Date', type: 'date' },
          { key: 'due_date', label: 'Due Date', type: 'date' },
          {
            key: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'active', label: 'Active' },
              { value: 'paused', label: 'Paused' },
              { value: 'completed', label: 'Completed' }
            ],
          },
          {
            key: 'progress',
            label: 'Progress',
            type: 'text',
            editable: false,
            creatable: false,
          },
          {
            key: 'transaction_categories',
            label: 'Categories',
            type: 'multiselect',
            editable: true,
            creatable: true,
            filterable: true,
            options: categoryOptions,
          }
        ]}
      />

      {selectedGoal && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Goal Progress Chart</h2>
            <div className="flex space-x-2">
              {['daily', 'weekly', 'monthly', 'yearly'].map((scale) => (
                <button
                  key={scale}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                    timeScale === scale
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => setTimeScale(scale as "daily" | "weekly" | "monthly" | "yearly")}
                >
                  {scale.charAt(0).toUpperCase() + scale.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="h-96">
            {selectedGoal && <GoalLineChart goal={selectedGoal} timeScale={timeScale} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
