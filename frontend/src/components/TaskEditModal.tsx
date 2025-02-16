import React, {useState} from 'react';

interface TaskEditModalProps {
  task: {id: number; title: string; description?: string};
  onClose: () => void;
  onSave: (updatedTask: {
    id: number;
    title: string;
    description?: string;
  }) => void;
}

const TaskEditModal: React.FC<TaskEditModalProps> = ({
  task,
  onClose,
  onSave,
}) => {
  const [editedTask, setEditedTask] = useState(task);

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white p-4 rounded-md shadow-lg'>
        <h2 className='text-xl font-bold'>Edit Task</h2>
        <input
          type='text'
          value={editedTask.title}
          onChange={(e) =>
            setEditedTask({...editedTask, title: e.target.value})
          }
          className='block w-full border p-1'
        />
        <textarea
          value={editedTask.description || ''}
          onChange={(e) =>
            setEditedTask({...editedTask, description: e.target.value})
          }
          className='block w-full border p-1'
        />
        <button onClick={() => onSave(editedTask)} className='mt-2'>
          Save
        </button>
        <button onClick={onClose} className='mt-2 ml-2'>
          Close
        </button>
      </div>
    </div>
  );
};

export default TaskEditModal;
