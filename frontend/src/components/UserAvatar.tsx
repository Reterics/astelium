import React from 'react';
import { getAvatarColor, getInitials } from '../utils/avatar';

interface UserAvatarProps {
  name: string;
  image?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({name, image}) =>
  image ? (
    <div className='h-6 rounded-full text-xs flex items-center justify-center max-h-full max-w-full w-fit'>
      <img
        src={image}
        alt={name}
        className='w-6 h-6 rounded-full object-cover'
      />
    </div>
  ) : (
    <div
      className='w-6 h-6 rounded-full text-xs flex items-center justify-center text-white font-bold'
      style={{backgroundColor: getAvatarColor(name)}}
    >
      {getInitials(name)}
    </div>
  );

export default UserAvatar;
