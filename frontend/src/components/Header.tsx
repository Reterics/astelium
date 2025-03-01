import {FiBell, FiSun, FiMoon} from 'react-icons/fi';
import PageBreadcrumbs from "./PageBreadcrumbs.tsx";
import {MenuItem} from "./Sidebar.tsx";

interface HeaderProps {
  username: string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  selectedMenu?: MenuItem
}

const Header: React.FC<HeaderProps> = ({username, theme, toggleTheme, selectedMenu}) => {
  return (
    <header className='w-full bg-zinc-200 shadow-md py-1 px-3 flex items-center justify-between border-b border-zinc-300'>
      <div className='flex items-center space-x-2 w-1/3'>
        {selectedMenu && (
          <PageBreadcrumbs
            title={selectedMenu.label}
            breadcrumbs={['Dashboard', selectedMenu.label]}
          />
        )}
      </div>
      <div className='flex items-center space-x-4'>
        <button
          onClick={toggleTheme}
          className='p-2 rounded-md hover:bg-zinc-200'
        >
          {theme === 'light' ? (
            <FiMoon className='w-5 h-5' />
          ) : (
            <FiSun className='w-5 h-5' />
          )}
        </button>
        <FiBell className='w-5 h-5 text-zinc-600' />
        <span className='font-medium text-zinc-900 text-base'>{username}</span>
      </div>
    </header>
  );
};

export default Header;
