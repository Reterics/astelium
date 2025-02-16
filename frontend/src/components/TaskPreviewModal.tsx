import React from 'react';

interface TaskPreviewModalProps {
  task: {id: number; title: string; description?: string};
  onClose: () => void;
}

const TaskPreviewModal: React.FC<TaskPreviewModalProps> = ({task, onClose}) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-4 rounded-md shadow-lg'>
        <h2 className='text-xl font-bold'>{task.title}</h2>
        <p>{task.description}</p>
        <button onClick={onClose} className='mt-2'>
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskPreviewModal;
