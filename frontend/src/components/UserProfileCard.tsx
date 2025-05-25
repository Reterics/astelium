import React from 'react';
import {FiBriefcase, FiInfo} from 'react-icons/fi';

export interface UserDetails {
  id: number;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  title?: string;
  workingSchedule?: {
    days: string[];
    hours: string;
  };
  role?: string;
}

interface UserProfileCardProps {
  user: UserDetails;
  loading?: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({
  user,
  loading = false,
}) => {
  if (loading) {
    return (
      <div className='bg-white rounded-lg shadow-md p-6 mb-6 animate-pulse'>
        <div className='flex items-center space-x-4 mb-4'>
          <div className='w-16 h-16 bg-gray-300 rounded-full'></div>
          <div className='flex-1'>
            <div className='h-5 bg-gray-300 rounded w-1/2 mb-2'></div>
            <div className='h-4 bg-gray-300 rounded w-1/3'></div>
          </div>
        </div>
        <div className='space-y-3'>
          <div className='h-4 bg-gray-300 rounded w-3/4'></div>
          <div className='h-4 bg-gray-300 rounded w-full'></div>
          <div className='h-4 bg-gray-300 rounded w-5/6'></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200'>
      <div className='flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6'>
        <div className='flex-shrink-0'>
          <div className='w-24 h-24 rounded-full overflow-hidden border-4 border-blue-100'>
            {user.image ? (
              <img
                src={
                  user.image.startsWith('http')
                    ? user.image
                    : `${process.env.PUBLIC_URL}/storage/${user.image}`
                }
                alt={user.name}
                className='w-full h-full object-cover'
              />
            ) : (
              <div className='w-full h-full flex items-center justify-center bg-blue-500 text-white text-2xl font-bold'>
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className='flex-1 text-center md:text-left'>
          <h2 className='text-2xl font-bold text-gray-800'>{user.name}</h2>
          <p className='text-gray-600 mb-2'>{user.email}</p>

          {user.title && (
            <div className='inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium'>
              {user.title}
            </div>
          )}
        </div>
      </div>

      <div className='mt-6 space-y-4'>
        {user.bio && (
          <div className='flex items-start'>
            <FiInfo className='mt-1 mr-3 text-blue-500' />
            <div>
              <h3 className='font-medium text-gray-800'>Bio</h3>
              <p className='text-gray-600'>{user.bio}</p>
            </div>
          </div>
        )}

        {user.workingSchedule && (
          <div className='flex items-start'>
            <FiBriefcase className='mt-1 mr-3 text-blue-500' />
            <div>
              <h3 className='font-medium text-gray-800'>Working Schedule</h3>
              <p className='text-gray-600'>
                {user.workingSchedule.days.join(', ')} •{' '}
                {user.workingSchedule.hours}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileCard;
