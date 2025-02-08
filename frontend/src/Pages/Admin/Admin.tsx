import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./Dashboard";
import Users from "./Users";
import Projects from "./Projects";
import Tasks from "./Tasks";
import Clients from "./Clients";
import Reports from "./Reports";
import Settings from "./Settings";

const AdminPanel = () => {
    const logout = () => {
        fetch("/admin/logout", { method: "POST", credentials: "include" }).then(() =>
            window.location.reload()
        );
    };

    return (
        <BrowserRouter basename="/admin/">
            <div>
                <nav>
                    <ul>
                        <li><Link to="dashboard">Dashboard</Link></li>
                        <li><Link to="users">Users</Link></li>
                        <li><Link to="projects">Projects</Link></li>
                        <li><Link to="tasks">Tasks</Link></li>
                        <li><Link to="clients">Clients</Link></li>
                        <li><Link to="reports">Reports</Link></li>
                        <li><Link to="settings">Settings</Link></li>
                        <li><a onClick={logout}>Logout</a></li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/clients" element={<Clients />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
};

export default AdminPanel;
