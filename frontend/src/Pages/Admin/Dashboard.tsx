import React from 'react';
import { Link } from "@inertiajs/react";

const Dashboard: React.FC = () => {
    return (
        <div>
            <nav>
                <ul>
                    <li><Link href="./dashboard">Dashboard</Link></li>
                    <li><Link href="./users">Users</Link></li>
                </ul>
            </nav>
            <h1>Admin Dashboard</h1>
            <p>Welcome to your admin dashboard.</p>
        </div>
    );
};

export default Dashboard;
