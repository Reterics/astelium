import React from 'react';
import {Transaction} from '../Pages/Admin/Transactions.tsx';

export type TransactionCategoryPivot = {
  goal_id: number;
  transaction_category_id: number;
};

export interface TransactionCategory {
  id: number;
  name: string;
  icon?: string;
  color?: string;
  account_id: number;
  created_at: Date;
  updated_at: Date;
  pivot?: TransactionCategoryPivot
}

export interface Goal {
  id: number;
  title: string;
  target_amount: number;
  start_date: Date;
  due_date: Date;
  status: 'active' | 'paused' | 'completed';
  transaction_categories: TransactionCategory[];
}

interface GoalProgressCardProps {
  goal: Goal;
  transactions: Transaction[];
  showDetails?: boolean;
}

const GoalProgressCard: React.FC<GoalProgressCardProps> = ({ goal, transactions, showDetails = true }) => {
  const categoryIds = goal.transaction_categories.map((cat) => cat.id);

  // Filter transactions that belong to these categories
  const relevantTransactions = transactions.filter((transaction: any) => {
    if (!transaction.categories || !transaction.categories.length) return false;

    return transaction.categories.some((cat: any) => categoryIds.includes(cat.id));
  });

  // Calculate total amount (only count income transactions)
  const totalAmount = relevantTransactions.reduce((sum: number, transaction: any) => {
    if (transaction.type === 'income') {
      return sum + parseFloat(transaction.amount);
    }
    return sum;
  }, 0);

  const progressPercentage = Math.min(100, Math.round((totalAmount / goal.target_amount) * 100));

  // Calculate days remaining
  const today = new Date();
  const dueDate = new Date(goal.due_date);
  const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Determine color based on progress and days remaining
  let progressColor = 'bg-blue-600';
  if (progressPercentage >= 100) {
    progressColor = 'bg-green-500';
  } else if (daysRemaining < 30 && progressPercentage < 50) {
    progressColor = 'bg-red-500';
  } else if (daysRemaining < 60 && progressPercentage < 75) {
    progressColor = 'bg-yellow-500';
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-medium text-gray-900">{goal.title}</h3>
        <div className="text-sm text-gray-500 mt-1">
          Target: ${goal.target_amount.toLocaleString()}
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className={`${progressColor} h-2.5 rounded-full`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm text-gray-600 mb-4">
          <div>
            <span className="font-medium">${totalAmount.toLocaleString()}</span> raised
          </div>
          <div>
            <span className="font-medium">${(goal.target_amount - totalAmount).toLocaleString()}</span> to go
          </div>
        </div>

        {showDetails && (
          <>
            <div className="border-t border-gray-200 pt-4 mt-2">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Days Remaining:</span>
                <span className="font-medium text-gray-800">
                  {daysRemaining > 0 ? daysRemaining : 'Overdue'}
                </span>
              </div>

              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium text-gray-800">
                  {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium text-gray-800">
                  {new Date(goal.due_date).toLocaleDateString()}
                </span>
              </div>
            </div>

            {goal.transaction_categories && goal.transaction_categories.length > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Linked Categories:</h4>
                <div className="flex flex-wrap gap-1">
                  {goal.transaction_categories.map((category) => (
                    <span
                      key={category.id}
                      className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: category.color ? `${category.color}20` : '#e5e7eb',
                        color: category.color || 'inherit',
                        border: `1px solid ${category.color || '#d1d5db'}`
                      }}
                    >
                      {category.icon && (
                        <span className="material-icons text-xs mr-1">{category.icon}</span>
                      )}
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GoalProgressCard;
