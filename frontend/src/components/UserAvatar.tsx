import React from 'react';
import { getAvatarColor, getInitials } from '../utils/avatar';

interface UserAvatarProps {
  name: string;
  image?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({name, image}) =>
  image ? (
    <div className='w-10 h-10 rounded-full flex items-center justify-center'>
      <img
        src={image}
        alt={name}
        className='w-10 h-10 rounded-full object-cover'
      />
    </div>
  ) : (
    <div
      className='w-10 h-10 rounded-full flex items-center justify-center text-white font-bold'
      style={{backgroundColor: getAvatarColor(name)}}
    >
      {getInitials(name)}
    </div>
  );

export default UserAvatar;
