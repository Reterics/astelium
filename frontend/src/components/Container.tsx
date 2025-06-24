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
  {label: 'Dashboard', path: '/admin/dashboard', icon: FiHome},

  {
    label: 'Projects',
    icon: FiFolder,
    path: '/admin/projects',
  },
  {
    label: 'Tasks',
    icon: FiList,
    submenu: [
      {label: 'List', path: '/admin/tasks', icon: FiList},
      {label: 'Board', path: '/admin/board', icon: FiColumns},
    ],
  },
  {
    label: 'Notes',
    icon: FiFileText,
    path: '/admin/notes',
  },

  {
    label: 'Inventory',
    icon: FiArchive,
    submenu: [
      {label: 'Warehouses', path: '/admin/warehouses', icon: FiDatabase},
      {label: 'Storage', path: '/admin/storage', icon: FiDatabase},
      {label: 'Domains', path: '/admin/domains', icon: FiGlobe},
    ],
  },

  {
    label: 'Management',
    icon: FiClipboard,
    submenu: [
      {label: 'Clients', path: '/admin/clients', icon: FiUser},
      {label: 'Invoices', path: '/admin/invoices', icon: FiFile},
      {label: 'Appointments', path: '/admin/appointments', icon: FiCalendar},
      {
        label: 'Contract Templates',
        path: '/admin/contract-templates',
        icon: FiFileText,
      },
      {label: 'Contracts', path: '/admin/contracts', icon: FiFileText},
      {label: 'Transactions', path: '/admin/transactions', icon: FiCreditCard},
    ],
  },

  {
    label: 'Reports',
    icon: FiFileText,
    path: '/admin/reports',
  },
  {
    label: 'Maps',
    icon: FiMap,
    path: '/admin/maps',
  },

  {
    label: 'Admin',
    icon: FiSettings,
    submenu: [
      {label: 'Users', path: '/admin/users', icon: FiUsers},
      {label: 'Invoice Users', path: '/admin/invoice-users', icon: FiUser},
      {label: 'Settings', path: '/admin/settings', icon: FiSettings},
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
      <Sidebar menu={currentMenu} collapsed={sidebarCollapsed} toggleCollapsed={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className='flex flex-1 flex-col overflow-x-hidden overflow-y-auto relative'>
        <Header
          selectedMenu={selectedMenu}
          collapsed={sidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        ></Header>

        <div className='flex flex-col space-y-6'>{children}</div>
      </div>
    </div>
  );
};

export default Container;
