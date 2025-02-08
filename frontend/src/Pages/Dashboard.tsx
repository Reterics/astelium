import React from 'react';

interface DashboardProps {
  user: {
    id: number;
    name?: string;
    email?: string;
  } | null;
  stats: {
    projects: number;
    tasks: number;
  };
}

export const Dashboard: React.FC<DashboardProps> = ({user, stats}) => {
  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>
      <p>User: {user ? user.name : 'Guest'}</p>
      <div className='mt-4'>
        <p>Projects: {stats.projects}</p>
        <p>Tasks: {stats.tasks}</p>
      </div>
    </div>
  );
};

export default Dashboard;
