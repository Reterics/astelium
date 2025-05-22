import {useState} from 'react';
import {FiChevronDown, FiChevronRight, FiLogOut} from 'react-icons/fi';
import {Link} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth.ts';

// --- MenuItem and SidebarProps unchanged ---
export interface MenuItem {
  label: string;
  icon?: React.ElementType;
  path?: string;
  submenu?: MenuItem[];
}

interface SidebarProps {
  menu: MenuItem[];
  collapsed?: boolean; // Optional, for future collapsible support
}

const Sidebar: React.FC<SidebarProps> = ({menu, collapsed = false}) => {
  const [openSubmenus, setOpenSubmenus] = useState<Record<number, boolean>>({});
  const {logout} = useAuth();

  const toggleSubmenu = (key: number) => {
    setOpenSubmenus((prev) => ({...prev, [key]: !prev[key]}));
  };

  return (
    <aside
      className={`thin-scrollbar h-screen bg-zinc-900 text-zinc-100 border-r border-zinc-800 flex flex-col transition-all duration-100 ${collapsed ? 'w-12' : 'w-52'} `}
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 14,
        letterSpacing: 0,
      }}
    >
      <nav className='flex-1 py-2 ps-1'>
        {menu.map((item, index) => (
          <div key={index} className='flex flex-col select-none'>
            {item.path ? (
              <Link
                to={item.path}
                className={`flex items-center justify-start gap-2 px-2 py-2 w-full
                  hover:bg-zinc-800 active:bg-zinc-700 border-l-2 border-transparent
                  focus:outline-none focus:bg-zinc-800
                  transition-all duration-100`}
                tabIndex={0}
              >
                {item.icon && <item.icon className='w-5 h-5 flex-shrink-0' />}
                <span
                  className={`transition-all duration-100 truncate font-medium text-[13px] ${
                    collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            ) : (
              <button
                className={`flex items-center justify-start gap-2 px-2 py-2 w-full bg-transparent border-none outline-none
                  hover:bg-zinc-800 active:bg-zinc-700 focus:bg-zinc-800
                  transition-all duration-100`}
                onClick={() => item.submenu && toggleSubmenu(index)}
                tabIndex={0}
                type='button'
              >
                <div className='flex items-center gap-2'>
                  {item.icon && <item.icon className='w-5 h-5 flex-shrink-0' />}
                  <span
                    className={`truncate font-medium text-[13px] transition-all duration-100 ${
                      collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {!collapsed &&
                  item.submenu &&
                  (openSubmenus[index] ? (
                    <FiChevronDown className='w-4 h-4 text-zinc-400' />
                  ) : (
                    <FiChevronRight className='w-4 h-4 text-zinc-400' />
                  ))}
              </button>
            )}
            {item.submenu && openSubmenus[index] && !collapsed && (
              <div className='ml-6 border-l border-zinc-800 bg-zinc-900'>
                {item.submenu.map((sub, subIndex) => (
                  <Link
                    key={subIndex}
                    to={sub.path ?? '#'}
                    className={`flex items-center gap-2 px-2 py-2 w-full text-zinc-300 hover:bg-zinc-800 border-l-2 border-transparent
                      focus:outline-none focus:bg-zinc-800 text-[13px]`}
                  >
                    {sub.icon && <sub.icon className='w-4 h-4 flex-shrink-0' />}
                    <span className='truncate'>{sub.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
      <button
        onClick={() => logout()}
        className='flex items-center gap-2 px-2 py-2 mb-2 text-zinc-400 hover:text-white hover:bg-zinc-800 font-medium border-none bg-transparent outline-none w-full transition'
        tabIndex={0}
      >
        <FiLogOut className='w-5 h-5' />
        {!collapsed && <span className='truncate'>Logout</span>}
      </button>
    </aside>
  );
};

export default Sidebar;
