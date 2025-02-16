import React from 'react';

interface TaskContextMenuProps {
  x: number;
  y: number;
  task: {id: number; title: string};
  onClose: () => void;
  onEdit: () => void;
}

const TaskContextMenu: React.FC<TaskContextMenuProps> = ({
  x,
  y,
  task,
  onClose,
  onEdit,
}) => {
  return (
    <div
      className='absolute bg-white shadow-md border p-2 rounded-md'
      style={{top: y, left: x}}
    >
      <p className='font-bold'>{task.title}</p>
      <button onClick={onEdit} className='block w-full text-left'>
        Edit
      </button>
      <button onClick={onClose} className='block w-full text-left'>
        Close
      </button>
    </div>
  );
};

export default TaskContextMenu;
