import {useState, useEffect} from 'react';
import {
  FiChevronDown,
  FiChevronRight,
  FiLogOut,
  FiHome,
  FiSettings,
  FiMenu,
} from 'react-icons/fi';
import {Link, useLocation} from 'react-router-dom';
import {useAuth} from '../hooks/useAuth.ts';

// Enhanced MenuItem interface with category support
export interface MenuItem {
  label: string;
  icon?: React.ElementType;
  path?: string;
  submenu?: MenuItem[];
  category?: string; // Optional category for grouping
}

interface SidebarProps {
  menu: MenuItem[];
  collapsed?: boolean;
  toggleCollapsed?: () => void; // Function to toggle collapsed state
}

const Sidebar: React.FC<SidebarProps> = ({
  menu,
  collapsed = false,
  toggleCollapsed,
}) => {
  const [openSubmenus, setOpenSubmenus] = useState<Record<number, boolean>>({});
  const {logout} = useAuth();
  const location = useLocation();

  // Group menu items by category
  const categorizedMenu = menu.reduce(
    (acc, item) => {
      const category = item.category || 'General';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  // Categories order (customize as needed)
  const categoryOrder = ['General', 'Management', 'Settings', 'Other'];

  // Sort categories
  const sortedCategories = Object.keys(categorizedMenu).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  // Check if a menu item or its submenu is active
  const isActive = (item: MenuItem): boolean => {
    if (item.path && location.pathname === item.path) {
      return true;
    }

    if (item.submenu) {
      return item.submenu.some(
        (subItem) => subItem.path && location.pathname === subItem.path
      );
    }

    return false;
  };

  // Auto-open submenu for active items
  useEffect(() => {
    const newOpenSubmenus: Record<number, boolean> = {};

    menu.forEach((item, index) => {
      if (
        item.submenu &&
        item.submenu.some(
          (subItem) => subItem.path && location.pathname === subItem.path
        )
      ) {
        newOpenSubmenus[index] = true;
      }
    });

    setOpenSubmenus((prev) => ({...prev, ...newOpenSubmenus}));
  }, [location.pathname, menu]);

  const toggleSubmenu = (key: number) => {
    setOpenSubmenus((prev) => ({...prev, [key]: !prev[key]}));
  };

  return (
    <aside
      className={`thin-scrollbar h-screen bg-zinc-900 text-zinc-100 border-r border-zinc-800 flex flex-col transition-all duration-200 ease-in-out ${
        collapsed ? 'w-16' : 'w-64'
      }`}
      style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontSize: 14,
        letterSpacing: 0,
      }}
    >
      {/* Sidebar header with logo and collapse toggle */}
      <div className='flex items-center justify-between p-4 border-b border-zinc-800'>
        <div
          className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}
        >
          <span
            className={`text-lg font-bold text-white ${collapsed ? 'hidden' : 'block'}`}
          >
            Astelium
          </span>
          {collapsed && <FiHome className='w-6 h-6 text-white' />}
        </div>

        {!collapsed && (
          <button
            onClick={toggleCollapsed}
            className='p-1 rounded-md hover:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-colors'
            aria-label='Collapse sidebar'
          >
            <FiMenu className='w-5 h-5 text-zinc-400' />
          </button>
        )}
      </div>

      <nav className='flex-1 py-4 overflow-y-auto'>
        {sortedCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className='mb-4'>
            {/* Category header (only show when not collapsed) */}
            {!collapsed && (
              <div className='px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider'>
                {category}
              </div>
            )}

            {/* Menu items in this category */}
            {categorizedMenu[category].map((item, index) => {
              const globalIndex = menu.findIndex((m) => m.label === item.label);
              const active = isActive(item);

              return (
                <div key={index} className='flex flex-col select-none'>
                  {item.path ? (
                    <Link
                      to={item.path}
                      className={`flex items-center justify-start gap-3 px-4 py-2.5 w-full
                        hover:bg-zinc-800 active:bg-zinc-700
                        focus:outline-none focus:bg-zinc-800
                        transition-all duration-150 relative
                        ${active ? 'bg-zinc-800 text-white' : 'text-zinc-300'}`}
                      tabIndex={0}
                    >
                      {active && (
                        <div className='absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r'></div>
                      )}

                      <div className={`${collapsed ? 'mx-auto' : ''}`}>
                        {item.icon && (
                          <item.icon
                            className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-400' : 'text-zinc-400'}`}
                          />
                        )}
                      </div>

                      <span
                        className={`transition-all duration-200 truncate font-medium text-sm ${
                          collapsed
                            ? 'opacity-0 w-0 absolute'
                            : 'opacity-100 w-auto'
                        }`}
                      >
                        {item.label}
                      </span>

                      {/* Tooltip for collapsed mode */}
                      {collapsed && (
                        <div className='absolute left-full ml-2 px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity duration-150'>
                          {item.label}
                        </div>
                      )}
                    </Link>
                  ) : (
                    <button
                      className={`flex items-center justify-between gap-3 px-4 py-2.5 w-full bg-transparent border-none outline-none
                        hover:bg-zinc-800 active:bg-zinc-700 focus:bg-zinc-800
                        transition-all duration-150 relative
                        ${active ? 'bg-zinc-800 text-white' : 'text-zinc-300'}`}
                      onClick={() => item.submenu && toggleSubmenu(globalIndex)}
                      tabIndex={0}
                      type='button'
                    >
                      {active && (
                        <div className='absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r'></div>
                      )}

                      <div className='flex items-center gap-3'>
                        <div className={`${collapsed ? 'mx-auto' : ''}`}>
                          {item.icon && (
                            <item.icon
                              className={`w-5 h-5 flex-shrink-0 ${active ? 'text-blue-400' : 'text-zinc-400'}`}
                            />
                          )}
                        </div>

                        <span
                          className={`truncate font-medium text-sm transition-all duration-200 ${
                            collapsed
                              ? 'opacity-0 w-0 absolute'
                              : 'opacity-100 w-auto'
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>

                      {!collapsed && item.submenu && (
                        <div className='flex-shrink-0'>
                          {openSubmenus[globalIndex] ? (
                            <FiChevronDown className='w-4 h-4 text-zinc-400' />
                          ) : (
                            <FiChevronRight className='w-4 h-4 text-zinc-400' />
                          )}
                        </div>
                      )}
                    </button>
                  )}

                  {/* Submenu items */}
                  {item.submenu && openSubmenus[globalIndex] && !collapsed && (
                    <div className='ml-7 pl-4 border-l border-zinc-700 bg-zinc-900/50 rounded-sm my-1'>
                      {item.submenu.map((sub, subIndex) => {
                        const subActive =
                          sub.path && location.pathname === sub.path;

                        return (
                          <Link
                            key={subIndex}
                            to={sub.path ?? '#'}
                            className={`flex items-center gap-3 px-3 py-2 my-0.5 w-full rounded-md
                              ${
                                subActive
                                  ? 'bg-zinc-800 text-white'
                                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200'
                              }
                              focus:outline-none focus:bg-zinc-800 text-sm transition-colors duration-150`}
                          >
                            {sub.icon && (
                              <sub.icon
                                className={`w-4 h-4 flex-shrink-0 ${subActive ? 'text-blue-400' : ''}`}
                              />
                            )}
                            <span className='truncate'>{sub.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Sidebar footer */}
      <div className='mt-auto border-t border-zinc-800 pt-2 pb-4'>
        {!collapsed && (
          <div className='px-4 py-2 mb-2'>
            <div className='flex items-center gap-3 p-2 bg-zinc-800/50 rounded-md'>
              <FiSettings className='w-5 h-5 text-zinc-400' />
              <div className='flex-1'>
                <div className='text-sm font-medium text-zinc-300'>
                  Settings
                </div>
                <div className='text-xs text-zinc-500'>
                  Configure your workspace
                </div>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => logout()}
          className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start gap-3'}
            px-4 py-2 mx-2 text-zinc-400 hover:text-white hover:bg-zinc-800
            font-medium border-none bg-transparent outline-none rounded-md
            transition-colors duration-150 w-auto`}
          tabIndex={0}
        >
          <FiLogOut className='w-5 h-5' />
          {!collapsed && <span className='truncate text-sm'>Logout</span>}
        </button>
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          onClick={toggleCollapsed}
          className='mx-auto mb-4 p-2 rounded-md hover:bg-zinc-800 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-colors'
          aria-label='Expand sidebar'
        >
          <FiChevronRight className='w-5 h-5 text-zinc-400' />
        </button>
      )}
    </aside>
  );
};

export default Sidebar;
