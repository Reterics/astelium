import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import Users from './Users';
import {router} from "@inertiajs/react";

const Admin: React.FC = () => {
    const logout = ()=>{
        router.post('logout', undefined, {
            onFinish: ()=>{
                window.location.href = '/'
            }
        })
    };

    return (
        <BrowserRouter basename='/admin/'>
            <div>
                <nav>
                    <ul>
                        <li><Link to="dashboard">Dashboard</Link></li>
                        <li><Link to="users">Users</Link></li>
                        <li><a onClick={()=> logout()}>Logout</a></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default Admin;
