import Modal from './Modal';
import {useState} from 'react';
import SelectComponent from './SelectComponent.tsx';
import {useApi} from '../hooks/useApi.ts';
import {Task} from './KanbanBoard.tsx';

export interface TaskModalProps {
  task: Task;
  onClose: () => void;
  onSave: (task: Task) => void;
}

const TaskModal = ({task, onClose, onSave}: TaskModalProps) => {
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [newComment, setNewComment] = useState('');

  const {
    data: comments,
    createMutation,
    isLoading: commentsLoading,
  } = useApi(`comments?task_id=${task.id}`);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    await createMutation.mutateAsync({
      task_id: task.id,
      text: newComment,
      author: 'You', // Placeholder for now
      created_at: new Date().toISOString(),
    });
    setNewComment('');
  };

  const handleChange = (key: keyof Task, value: Task[keyof Task]) => {
    setEditedTask((prev) => ({...prev, [key]: value}));
  };

  return (
    <Modal title='Edit Task' onClose={onClose}>
      <div className='grid grid-cols-3 gap-4 p-4'>
        {/* Left Side - Title & Description */}
        <div className='col-span-2 space-y-4'>
          <input
            type='text'
            value={editedTask.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className='w-full text-lg font-bold border-b border-zinc-300 focus:outline-none'
          />
          <textarea
            value={editedTask.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            className='w-full h-24 border border-zinc-300 p-2 rounded'
            placeholder='Task description...'
          />
        </div>

        {/* Right Side - Task Details (Vertically Aligned) */}
        <div className='bg-gray-100 p-4 rounded space-y-3'>
          <div className='flex justify-between'>
            <span className='font-semibold'>Assigned to:</span>
            <SelectComponent
              defaultLabel='Select User'
              column={{
                key: 'assigned_to',
                label: 'Assigned To',
                type: 'select',
              }}
              filters={{assigned_to: editedTask.assigned_to!}}
              handleFilterChange={(_col, value) =>
                handleChange('assigned_to', value)
              }
            />
          </div>
          <div className='flex justify-between'>
            <span className='font-semibold'>Start Time:</span>
            <input
              type='datetime-local'
              value={editedTask.start_time || ''}
              onChange={(e) => handleChange('start_time', e.target.value)}
              className='border border-zinc-300 p-1 rounded'
            />
          </div>
          <div className='flex justify-between'>
            <span className='font-semibold'>Expected Time:</span>
            <input
              type='datetime-local'
              value={editedTask.expected_time || ''}
              onChange={(e) => handleChange('expected_time', e.target.value)}
              className='border border-zinc-300 p-1 rounded'
            />
          </div>
          <div className='flex justify-between'>
            <span className='font-semibold'>Priority:</span>
            <SelectComponent
              defaultLabel='Select Priority'
              column={{key: 'priority', label: 'Priority', type: 'select'}}
              filters={{priority: editedTask.priority!}}
              handleFilterChange={(_col, value) =>
                handleChange('priority', value)
              }
            />
          </div>
          <div className='flex justify-between'>
            <span className='font-semibold'>Story Points:</span>
            <input
              type='number'
              value={editedTask.story_points || ''}
              onChange={(e) => handleChange('story_points', e.target.value)}
              className='border border-zinc-300 p-1 rounded w-16'
            />
          </div>
        </div>

        {/* Bottom Left - Comments Section */}
        <div className='col-span-2 space-y-2'>
          <h4 className='text-lg font-bold'>Comments</h4>

          {/* Display existing comments */}
          <div className='space-y-2 max-h-32 overflow-y-auto p-2 bg-gray-50 rounded'>
            {commentsLoading ? (
              <p>Loading comments...</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className='border-b pb-1'>
                  <p className='text-sm font-semibold'>{comment.author}</p>
                  <p className='text-sm'>{comment.text}</p>
                  <p className='text-xs text-gray-500'>
                    {new Date(comment.created_at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Add new comment */}
          <textarea
            className='w-full h-16 border border-zinc-300 p-2 rounded'
            placeholder='Add a comment...'
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            className='bg-zinc-800 text-white px-2 py-1 rounded hover:bg-zinc-700'
            onClick={handleAddComment}
          >
            Post Comment
          </button>
        </div>
      </div>

      <div className='flex justify-end mt-4'>
        <button
          onClick={() => onSave(editedTask)}
          className='bg-blue-500 text-white px-4 py-2 rounded'
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

export default TaskModal;
