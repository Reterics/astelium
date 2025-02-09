import { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";

interface MenuItem {
  label: string;
  icon?: React.ElementType;
  path?: string;
  submenu?: MenuItem[];
}

interface SidebarProps {
  menu: MenuItem[];
  logout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menu, logout }) => {
  const [openSubmenus, setOpenSubmenus] = useState<Record<number, boolean>>({});

  const toggleSubmenu = (key: number) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <aside className="w-64 h-screen bg-zinc-900 text-white p-2 space-y-2">
      {menu.map((item, index) => (
        <div key={index} className="flex flex-col">
          {item.path ? (
            <Link
              to={item.path}
              className="flex items-center justify-between w-full p-2 rounded-md hover:bg-zinc-800"
            >
              <div className="flex items-center space-x-2">
                {item.icon && <item.icon className="w-5 h-5" />}
                <span>{item.label}</span>
              </div>
            </Link>
          ) : (
            <button
              className="flex items-center justify-between w-full p-2 rounded-md hover:bg-zinc-800"
              onClick={() => item.submenu && toggleSubmenu(index)}
            >
              <div className="flex items-center space-x-2">
                {item.icon && <item.icon className="w-5 h-5" />}
                <span>{item.label}</span>
              </div>
              {item.submenu && (
                openSubmenus[index] ? (
                  <FiChevronDown className="w-4 h-4" />
                ) : (
                  <FiChevronRight className="w-4 h-4" />
                )
              )}
            </button>
          )}
          {item.submenu && openSubmenus[index] && (
            <div className="ml-5 space-y-1 border-l border-zinc-700 pl-2">
              {item.submenu.map((sub, subIndex) => (
                <Link
                  key={subIndex}
                  to={sub.path ?? "#"}
                  className="flex items-center space-x-2 w-full p-2 rounded-md hover:bg-zinc-800"
                >
                  {sub.icon && <sub.icon className="w-4 h-4" />}
                  <span>{sub.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
      <button
        onClick={logout}
        className="w-full p-2 mt-4 text-left rounded-md hover:bg-zinc-800"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
