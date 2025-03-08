import { useState } from 'react';
import {FiChevronDown, FiChevronRight, FiLogOut} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.ts';

export interface MenuItem {
  label: string;
  icon?: React.ElementType;
  path?: string;
  submenu?: MenuItem[];
}

interface SidebarProps {
  menu: MenuItem[];
  collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ menu, collapsed }) => {
  const [openSubmenus, setOpenSubmenus] = useState<Record<number, boolean>>({});
  const { logout } = useAuth();

  const toggleSubmenu = (key: number) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside
      className={`h-screen bg-zinc-900 text-white p-1 space-y-0 transition-all duration-100 ${
        collapsed ? 'w-12' : 'w-44'
      }`}
    >
      {menu.map((item, index) => (
        <div key={index} className="flex flex-col">
          {item.path ? (
            <Link
              to={item.path}
              className="flex items-center justify-between w-full p-2 py-4 rounded-md hover:bg-zinc-800"
            >
              <div className="flex items-center space-x-2">
                {item.icon && <item.icon className="w-5 h-5" />}
                <span
                  className={`transition-all duration-100 ${
                    collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  }`}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          ) : (
            <button
              className="flex items-center justify-between w-full p-2 py-4 rounded-md hover:bg-zinc-800"
              onClick={() => item.submenu && toggleSubmenu(index)}
            >
              <div className="flex items-center space-x-2">
                {item.icon && <item.icon className="w-5 h-5" />}
                <span
                  className={`transition-all duration-100 ${
                    collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {!collapsed &&
                item.submenu &&
                (openSubmenus[index] ? (
                  <FiChevronDown className="w-4 h-4" />
                ) : (
                  <FiChevronRight className="w-4 h-4" />
                ))}
            </button>
          )}
          {item.submenu && openSubmenus[index] && !collapsed && (
            <div className="bg-zinc-800 border-y-2 border-zinc-700 space-y-1">
              {item.submenu.map((sub, subIndex) => (
                <Link
                  key={subIndex}
                  to={sub.path ?? '#'}
                  className="flex items-center space-x-2 w-full p-2 hover:bg-zinc-700"
                >
                  <span>{sub.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
      <button
        key="logout"
        onClick={() => logout()}
        className="flex items-center w-full p-2 mt-4 rounded-md hover:bg-zinc-800"
      >
        <FiLogOut className="w-5 h-5" />
        {!collapsed && <span className="ml-2">Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;
