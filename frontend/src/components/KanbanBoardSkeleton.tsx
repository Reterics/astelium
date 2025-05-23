import React from 'react';
import Skeleton from './ui/Skeleton';
import { statuses } from './KanbanBoard.tsx';

/**
 * Skeleton component for KanbanBoard loading state
 */
const KanbanBoardSkeleton: React.FC = () => {
  // If statuses is not exported from KanbanBoard, use a default array
  const statusColumns = statuses || [
    { id: 'open', title: 'Open' },
    { id: 'in-progress', title: 'In Progress' },
    { id: 'review', title: 'Review' },
    { id: 'completed', title: 'Completed' },
    { id: 'closed', title: 'Closed' },
  ];

  return (
    <div className='flex gap-4 overflow-x-auto p-4'>
      {statusColumns.map((status) => (
        <div
          key={status.id}
          className='w-1/5 min-w-[250px] border border-zinc-200 bg-white rounded-md shadow-sm flex flex-col transition-all duration-200'
        >
          <div className='px-3 py-2 border-b flex items-center gap-2 text-left'>
            <Skeleton width={20} height={20} circle />
            <Skeleton width={80} height={16} />
            <Skeleton width={24} height={16} className="ml-auto rounded-full" />
          </div>

          <div className='bg-zinc-50 p-2 min-h-[500px] flex flex-col gap-2'>
            {/* Generate random number of tasks per column */}
            {Array.from({ length: Math.floor(Math.random() * 3) + 2 }).map((_, index) => (
              <div
                key={index}
                className='bg-white border border-zinc-200 p-3 rounded-md shadow-sm flex flex-col gap-2'
              >
                <div className='flex items-start justify-between'>
                  <Skeleton width="80%" height={16} />
                  <Skeleton width={16} height={16} />
                </div>

                <div className='flex items-center gap-2 flex-wrap'>
                  <Skeleton width={60} height={16} className="rounded-full" />
                  <Skeleton width={80} height={16} className="rounded-full" />
                  {Math.random() > 0.5 && (
                    <Skeleton width={60} height={16} className="ml-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default KanbanBoardSkeleton;
