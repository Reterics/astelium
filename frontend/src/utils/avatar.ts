const colors = ['#4CAF50', '#FF9800', '#9C27B0', '#03A9F4', '#E91E63'];

export const getAvatarColor = (name: string) => {
  if (!name) {
    return '#b1b1b1';
  }
  const index = name ? String(name).charCodeAt(0) % colors.length : 0;
  return colors[index];
};

export const getInitials = (name: string) => {
  return String(name || '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};
