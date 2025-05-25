import {
  FiBell,
  FiMenu,
  FiSettings,
  FiUser,
  FiLogOut,
  FiMail,
} from 'react-icons/fi';
import PageBreadcrumbs from './PageBreadcrumbs.tsx';
import {MenuItem} from './Sidebar.tsx';
import UserAvatar from './UserAvatar.tsx';
import React, {useRef, useState, useEffect} from 'react';
import {useAuth} from '../hooks/useAuth.ts';

interface HeaderProps {
  selectedMenu?: MenuItem;
  toggleSidebar: () => void;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const Header: React.FC<HeaderProps> = ({selectedMenu, toggleSidebar}) => {
  const {user} = useAuth();
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] =
    useState(false);
  const profileDropdownRef = useRef<HTMLDivElement | null>(null);
  const notificationsDropdownRef = useRef<HTMLDivElement | null>(null);

  // Sample notifications data
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Task Assigned',
      message: 'You have been assigned a new task: "Update documentation"',
      time: '5 min ago',
      read: false,
    },
    {
      id: 2,
      title: 'Meeting Reminder',
      message: 'Team meeting starts in 30 minutes',
      time: '30 min ago',
      read: false,
    },
    {
      id: 3,
      title: 'Project Update',
      message: 'Project "Astelium" has been updated to version 2.0',
      time: '2 hours ago',
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setShowProfileDropdown(false);
      }

      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target as Node)
      ) {
        setShowNotificationsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
    if (showNotificationsDropdown) setShowNotificationsDropdown(false);
  };

  const toggleNotificationsDropdown = () => {
    setShowNotificationsDropdown(!showNotificationsDropdown);
    if (showProfileDropdown) setShowProfileDropdown(false);
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? {...n, read: true} : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({...n, read: true})));
  };

  return (
    <header className='w-full bg-white border-b border-zinc-200 flex items-center justify-between px-4 py-2 min-h-[60px] shadow-sm'>
      <div className='flex items-center gap-3 w-1/3'>
        <button
          onClick={toggleSidebar}
          className='p-2 bg-transparent border-none rounded-md hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none transition-colors duration-150'
          tabIndex={0}
          aria-label='Toggle sidebar'
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

      <div className='flex items-center gap-4'>
        {/* Notifications dropdown */}
        <div className='relative' ref={notificationsDropdownRef}>
          <button
            onClick={toggleNotificationsDropdown}
            className='p-2 bg-transparent border-none rounded-md hover:bg-zinc-100 focus:bg-zinc-100 focus:outline-none transition-colors duration-150 relative'
            tabIndex={0}
            aria-label='Notifications'
          >
            <FiBell className='w-5 h-5 text-zinc-600' />
            {unreadCount > 0 && (
              <span className='absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center'>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotificationsDropdown && (
            <div className='absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-10 border border-zinc-200'>
              <div className='p-3 border-b border-zinc-200 flex justify-between items-center'>
                <h3 className='text-sm font-semibold text-zinc-800'>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className='text-xs text-blue-600 hover:text-blue-800'
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              <div className='max-h-80 overflow-y-auto'>
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 border-b border-zinc-100 hover:bg-zinc-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className='flex justify-between items-start'>
                        <h4 className='text-sm font-medium text-zinc-800'>
                          {notification.title}
                        </h4>
                        <span className='text-xs text-zinc-500'>
                          {notification.time}
                        </span>
                      </div>
                      <p className='text-xs text-zinc-600 mt-1'>
                        {notification.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className='p-4 text-center text-zinc-500 text-sm'>
                    No notifications
                  </div>
                )}
              </div>

              <div className='p-2 border-t border-zinc-200 text-center'>
                <button className='text-xs text-blue-600 hover:text-blue-800'>
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div className='relative' ref={profileDropdownRef}>
          <button
            onClick={toggleProfileDropdown}
            className='flex items-center gap-2 p-1 rounded-md hover:bg-zinc-100 focus:outline-none transition-colors duration-150'
            tabIndex={0}
            aria-label='User profile'
          >
            <UserAvatar name={user?.name} image={user?.image} />
            <span className='font-medium text-zinc-800 text-sm hidden sm:inline'>
              {user?.name}
            </span>
          </button>

          {showProfileDropdown && (
            <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-zinc-200'>
              <div className='p-3 border-b border-zinc-200'>
                <div className='flex items-center gap-2'>
                  <UserAvatar name={user?.name} image={user?.image} />
                  <div>
                    <h3 className='text-sm font-semibold text-zinc-800'>
                      {user?.name}
                    </h3>
                    <p className='text-xs text-zinc-500'>
                      {user?.role || 'User'}
                    </p>
                  </div>
                </div>
              </div>

              <div className='py-1'>
                <button className='w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 flex items-center gap-2'>
                  <FiUser className='w-4 h-4' />
                  <span>Profile</span>
                </button>
                <button className='w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 flex items-center gap-2'>
                  <FiMail className='w-4 h-4' />
                  <span>Messages</span>
                </button>
                <button className='w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 flex items-center gap-2'>
                  <FiSettings className='w-4 h-4' />
                  <span>Settings</span>
                </button>
              </div>

              <div className='py-1 border-t border-zinc-200'>
                <button className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-100 flex items-center gap-2'>
                  <FiLogOut className='w-4 h-4' />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
