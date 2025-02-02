import React from 'react';

interface DashboardProps {
    user: {
        id: number;
        name: string;
        email: string;
    };
    stats: {
        projects: number;
        tasks: number;
    };
}

export const Dashboard: React.FC<DashboardProps> = ({ user, stats }) => {
    return (
        <div>
            <h1>Welcome, {user.name}</h1>
            <div>
                <p>You have {stats.projects} projects.</p>
                <p>You have {stats.tasks} tasks.</p>
            </div>
        </div>
    );
};

export default Dashboard;