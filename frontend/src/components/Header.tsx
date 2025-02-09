import { FiSearch, FiBell, FiSun, FiMoon } from "react-icons/fi";

interface HeaderProps {
  username: string;
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, theme, toggleTheme }) => {
  return (
    <header className="w-full bg-white shadow-md p-3 flex items-center justify-between">
      <div className="flex items-center space-x-2 w-1/3">
        <FiSearch className="w-5 h-5 text-zinc-600" />
        <input
          type="text"
          placeholder="Search..."
          className="w-full bg-transparent focus:outline-none text-zinc-900 text-base"
        />
      </div>
      <div className="flex items-center space-x-4">
        <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-zinc-200">
          {theme === "light" ? <FiMoon className="w-5 h-5" /> : <FiSun className="w-5 h-5" />}
        </button>
        <FiBell className="w-5 h-5 text-zinc-600" />
        <span className="font-medium text-zinc-900 text-base">{username}</span>
      </div>
    </header>
  );
};

export default Header;
