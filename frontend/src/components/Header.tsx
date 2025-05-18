import {FiBell, FiSun, FiMoon, FiMenu} from 'react-icons/fi';
import PageBreadcrumbs from './PageBreadcrumbs.tsx';
import {MenuItem} from './Sidebar.tsx';

interface HeaderProps {
  username: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  selectedMenu?: MenuItem;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({
  username,
  theme,
  toggleTheme,
  selectedMenu,
  toggleSidebar,
}) => {
  return (
    <header
      className='w-full bg-white border-b border-zinc-200 flex items-center justify-between px-3 py-1 min-h-[40px]'
      style={{boxShadow: 'none'}}
    >
      <div className='flex items-center gap-2 w-1/3'>
        <button
          onClick={toggleSidebar}
          className='p-1.5 bg-transparent border-none rounded-none hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none transition-colors duration-75'
          style={{borderRadius: 0}}
          tabIndex={0}
        >
          <FiMenu className='w-5 h-5 text-zinc-700' />
        </button>
        {selectedMenu && (
          <PageBreadcrumbs
            title={selectedMenu.label}
            breadcrumbs={['Dashboard', selectedMenu.label]}
          />
        )}
      </div>

      <div className='flex items-center gap-3'>
        <button
          onClick={toggleTheme}
          className='p-1.5 bg-transparent border-none rounded-none hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none transition-colors duration-75'
          style={{borderRadius: 0}}
          tabIndex={0}
        >
          {theme === 'light' ? (
            <FiMoon className='w-5 h-5 text-zinc-700' />
          ) : (
            <FiSun className='w-5 h-5 text-zinc-700' />
          )}
        </button>
        <FiBell className='w-5 h-5 text-zinc-500' />
        <span className='font-medium text-zinc-800 text-xs'>{username}</span>
      </div>
    </header>
  );
};

export default Header;
