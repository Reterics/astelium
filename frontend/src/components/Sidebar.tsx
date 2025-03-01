import {useState} from 'react';
import {FiChevronDown, FiChevronRight} from 'react-icons/fi';
import {Link} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth.ts';

export interface MenuItem {
  label: string;
  icon?: React.ElementType;
  path?: string;
  submenu?: MenuItem[];
}

interface SidebarProps {
  menu: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({menu}) => {
  const [openSubmenus, setOpenSubmenus] = useState<Record<number, boolean>>({});
  const {logout} = useAuth();

  const toggleSubmenu = (key: number) => {
    setOpenSubmenus((prev) => ({...prev, [key]: !prev[key]}));
  };

  return (
    <aside className='w-44 h-screen bg-zinc-900 text-white p-1 space-y-0'>
      {menu.map((item, index) => (
        <div key={index} className='flex flex-col'>
          {item.path ? (
            <Link
              to={item.path}
              className='flex items-center justify-between w-full p-2 rounded-md hover:bg-zinc-800'
            >
              <div className='flex items-center space-x-2'>
                {item.icon && <item.icon className='w-5 h-5' />}
                <span>{item.label}</span>
              </div>
            </Link>
          ) : (
            <button
              className='flex items-center justify-between w-full p-2 rounded-md hover:bg-zinc-800'
              onClick={() => item.submenu && toggleSubmenu(index)}
            >
              <div className='flex items-center space-x-2'>
                {item.icon && <item.icon className='w-5 h-5' />}
                <span>{item.label}</span>
              </div>
              {item.submenu &&
                (openSubmenus[index] ? (
                  <FiChevronDown className='w-4 h-4' />
                ) : (
                  <FiChevronRight className='w-4 h-4' />
                ))}
            </button>
          )}
          {item.submenu && openSubmenus[index] && (
            <div className='bg-zinc-800 border-y-2 border-zinc-700 space-y-1'>
              {item.submenu.map((sub, subIndex) => (
                <Link
                  key={subIndex}
                  to={sub.path ?? '#'}
                  className='flex items-center space-x-2 w-full p-2 hover:bg-zinc-700'
                >
                  <span>{sub.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
      <button
        key={'logout'}
        onClick={() => logout()}
        className='block w-full p-2 mt-4 text-left rounded-md hover:bg-zinc-800'
      >
        <span>Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
