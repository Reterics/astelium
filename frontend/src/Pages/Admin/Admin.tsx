import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Dashboard from './Dashboard';
import Users from './Users';
import Projects from './Projects';
import Tasks from './Tasks';
import Clients from './Clients';
import Reports from './Reports';
import Settings from './Settings';
import Transactions from './Transactions.tsx';
import Notes from './Notes.tsx';
import StoragePage from './Storage.tsx';
import Sidebar from '../../components/Sidebar.tsx';
import {
  FiHome,
  FiUsers,
  FiFolder,
  FiList,
  FiUser,
  FiDatabase,
  FiCreditCard,
  FiFileText,
  FiSettings,
} from 'react-icons/fi';
import Header from '../../components/Header.tsx';
import {useState} from 'react';
import MainContent from './Example.tsx';

const menu = [
  {label: 'Dashboard', path: '/dashboard', icon: FiHome},
  {label: 'Users', path: '/users', icon: FiUsers},
  {label: 'Projects', path: '/projects', icon: FiFolder},
  {label: 'Tasks', path: '/tasks', icon: FiList},
  {label: 'Clients', path: '/clients', icon: FiUser},
  {label: 'Storage', path: '/storage', icon: FiDatabase},
  {label: 'Transactions', path: '/transactions', icon: FiCreditCard},
  {label: 'Notes', path: '/notes', icon: FiFileText},
  {label: 'Reports', path: '/reports', icon: FiFileText},
  {label: 'Settings', path: '/settings', icon: FiSettings},
];

const AdminPanel = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const logout = () => {
    fetch('/admin/logout', {method: 'POST', credentials: 'include'}).then(() =>
      window.location.reload()
    );
  };

  return (
    <BrowserRouter basename='/admin/'>
      <div className='flex h-screen overflow-hidden bg-zinc-100 text-zinc-700'>
        <Sidebar menu={menu} logout={logout} />
        <div className='flex flex-1 flex-col overflow-x-hidden overflow-y-auto relative'>
          <Header
            theme={theme || 'light'}
            toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            username={'Test'}
          ></Header>

          <Routes>
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/users' element={<Users />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/tasks' element={<Tasks />} />
            <Route path='/clients' element={<Clients />} />
            <Route path='/storage' element={<StoragePage />} />
            <Route path='/transactions' element={<Transactions />} />
            <Route path='/notes' element={<Notes />} />
            <Route path='/reports' element={<Reports />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/example' element={<MainContent />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default AdminPanel;
