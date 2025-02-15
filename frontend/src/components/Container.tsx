import Sidebar from './Sidebar.tsx';
import Header from './Header.tsx';
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
  FiArchive,
  FiGlobe,
  FiFile,
  FiClipboard,
  FiColumns,
} from 'react-icons/fi';

import {useState} from 'react';
import {useLocation} from 'react-router-dom';
import PageBreadcrumbs from './PageBreadcrumbs.tsx';

const menu = [
  {label: 'Dashboard', path: '/dashboard', icon: FiHome},

  {
    label: 'Projects',
    icon: FiFolder,
    path: '/projects',
  },
  {
    label: 'Tasks',
    icon: FiList,
    submenu: [
      {label: 'List', path: '/tasks', icon: FiList},
      {label: 'Board', path: '/board', icon: FiColumns},
    ],
  },
  {
    label: 'Notes',
    icon: FiFileText,
    path: '/notes',
  },

  {
    label: 'Inventory',
    icon: FiArchive,
    submenu: [
      {label: 'Warehouses', path: '/warehouses', icon: FiDatabase},
      {label: 'Storage', path: '/storage', icon: FiDatabase},
      {label: 'Domains', path: '/domains', icon: FiGlobe},
    ],
  },

  {
    label: 'Management',
    icon: FiClipboard,
    submenu: [
      {label: 'Invoice Users', path: '/invoice-users', icon: FiUser},
      {label: 'Invoices', path: '/invoices', icon: FiFile},
      {
        label: 'Contract Templates',
        path: '/contract-templates',
        icon: FiFileText,
      },
      {label: 'Contracts', path: '/contracts', icon: FiFileText},
      {label: 'Transactions', path: '/transactions', icon: FiCreditCard},
    ],
  },

  {
    label: 'Reports',
    icon: FiFileText,
    path: '/reports',
  },

  {
    label: 'Admin',
    icon: FiSettings,
    submenu: [
      {label: 'Users', path: '/users', icon: FiUsers},
      {label: 'Settings', path: '/settings', icon: FiSettings},
    ],
  },
];

interface ContainerProps {
  children?: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({children}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const location = useLocation();

  const selectedMenu =
    menu.find((m) => m.path === location.pathname) ||
    menu
      .flatMap((m) => m.submenu || [])
      .find((s) => s.path === location.pathname);

  return (
    <div className='flex h-screen overflow-hidden bg-zinc-200 text-zinc-700'>
      <Sidebar menu={menu} />
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
