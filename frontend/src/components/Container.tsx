import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
import {
  FiCreditCard,
  FiDatabase,
  FiFileText,
  FiFolder,
  FiHome,
  FiList,
  FiSettings,
  FiUser,
  FiUsers,
} from 'react-icons/fi';
import {useState} from 'react';
import {useLocation} from 'react-router-dom';
import PageBreadcrumbs from './PageBreadcrumbs.tsx';
import {getFetchOptions} from "../utils.ts";

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

interface ContainerProps {
  children?: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({children}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const logout = () => {
    fetch('/admin/logout', {...getFetchOptions(), method: 'POST'}).then(() =>
      window.location.reload()
    );
  };
  const location = useLocation();

  const selectedMenu = menu.find((m) => m.path === location.pathname);

  return (
    <div className='flex h-screen overflow-hidden bg-zinc-200 text-zinc-700'>
      <Sidebar menu={menu} logout={logout} />
      <div className='flex flex-1 flex-col overflow-x-hidden overflow-y-auto relative'>
        <Header
          theme={theme || 'light'}
          toggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          username={'Test'}
        ></Header>

        {selectedMenu && (
          <PageBreadcrumbs
            title={selectedMenu.label}
            breadcrumbs={['Dashboard', selectedMenu.label]}
          />
        )}

        <div className='py-1 px-4 flex flex-col space-y-6'>{children}</div>
      </div>
    </div>
  );
};

export default Container;
