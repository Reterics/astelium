import Sidebar, {MenuItem} from './Sidebar.tsx';
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
  FiCalendar,
  FiMap,
} from 'react-icons/fi';

import {useState} from 'react';
import {useLocation} from 'react-router-dom';

const menu: MenuItem[] = [
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
      {label: 'Clients', path: '/clients', icon: FiUser},
      {label: 'Invoices', path: '/invoices', icon: FiFile},
      {label: 'Appointments', path: '/appointments', icon: FiCalendar},
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
    label: 'Maps',
    icon: FiMap,
    path: '/maps',
  },

  {
    label: 'Admin',
    icon: FiSettings,
    submenu: [
      {label: 'Users', path: '/users', icon: FiUsers},
      {label: 'Invoice Users', path: '/invoice-users', icon: FiUser},
      {label: 'Settings', path: '/settings', icon: FiSettings},
    ],
  },
];

interface ContainerProps {
  children?: React.ReactNode;
  menu?: MenuItem[];
}

const Container: React.FC<ContainerProps> = ({children, menu: propMenu}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const currentMenu = propMenu || menu;

  const selectedMenu =
    currentMenu.find((m) => m.path === location.pathname) ||
    currentMenu
      .flatMap((m) => m.submenu || [])
      .find((s) => s.path === location.pathname);

  return (
    <div className='flex h-screen overflow-hidden bg-neutral-100 text-zinc-700'>
      <Sidebar menu={currentMenu} collapsed={sidebarCollapsed} />
      <div className='flex flex-1 flex-col overflow-x-hidden overflow-y-auto relative'>
        <Header
          selectedMenu={selectedMenu}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        ></Header>

        <div className='flex flex-col space-y-6'>{children}</div>
      </div>
    </div>
  );
};

export default Container;
